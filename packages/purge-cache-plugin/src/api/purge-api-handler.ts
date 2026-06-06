import {
  addDataAndFileToRequest,
  headersWithCors,
  type PayloadHandler,
  type PayloadRequest,
} from 'payload';
import { z, type ZodError } from 'zod';
import { canAccessPurgeCache } from '../access.js';
import type { PurgeCachePluginConfig, PurgerResult } from '../types.js';

export const purgeCacheRequestSchema = z.object({
  purge: z.array(z.string()),
});

export type PurgeCacheRequestData = z.infer<typeof purgeCacheRequestSchema>;

export type PurgeCacheResponse = {
  results: Record<string, PurgerResult>;
};

export type PurgeCacheErrorResponse = {
  error: string;
  violations?: ZodError['issues'];
};

const response = (
  req: PayloadRequest,
  body: PurgeCacheErrorResponse | PurgeCacheResponse,
  init?: ResponseInit,
): Response => {
  const headers = headersWithCors({
    headers: new Headers(init?.headers),
    req,
  });

  return Response.json(body, {
    ...(init ?? {}),
    headers,
  });
};

export const createApiHandler: (
  config: PurgeCachePluginConfig,
) => PayloadHandler = (config) => {
  return async (req) => {
    if (req.method?.toUpperCase() !== 'POST') {
      return response(req, { error: 'Invalid method' }, { status: 405 });
    }

    if (
      !(await canAccessPurgeCache({ user: req.user, access: config.access }))
    ) {
      return response(req, { error: 'Forbidden' }, { status: 403 });
    }

    await addDataAndFileToRequest(req);
    const parsedRequest = purgeCacheRequestSchema.safeParse(req.data);

    if (!parsedRequest.success) {
      return response(
        req,
        {
          error: 'Validation error',
          violations: parsedRequest.error.issues,
        },
        { status: 422 },
      );
    }

    const promises = parsedRequest.data.purge.map(
      async (purgerName): Promise<[string, PurgerResult]> => {
        const purger = config.purgers[purgerName];

        if (!purger) {
          return [
            purgerName,
            {
              success: false,
              error: 'Not found',
            },
          ];
        }

        try {
          return [purgerName, await purger.action()];
        } catch (err) {
          console.error(err);
          return [purgerName, { success: false, error: 'Unknown error.' }];
        }
      },
    );

    const results = await Promise.all(promises);

    return response(req, {
      results: Object.fromEntries(results),
    });
  };
};
