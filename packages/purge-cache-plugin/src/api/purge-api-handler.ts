import {
  addDataAndFileToRequest,
  headersWithCors,
  type PayloadHandler,
  type PayloadRequest,
} from 'payload';
import { z, type ZodError } from 'zod';
import { canAccessPurgeCache } from '../access.js';
import { runPurger } from '../runtime/run-purger.js';
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
      return response(req, { error: 'Method not allowed.' }, { status: 405 });
    }

    if (
      !(await canAccessPurgeCache({ user: req.user, access: config.access }))
    ) {
      return response(req, { error: 'Forbidden.' }, { status: 403 });
    }

    await addDataAndFileToRequest(req);
    const parsedRequest = purgeCacheRequestSchema.safeParse(req.data);

    if (!parsedRequest.success) {
      return response(
        req,
        {
          error: 'Invalid request.',
          violations: parsedRequest.error.issues,
        },
        { status: 422 },
      );
    }

    const results = await Promise.all(
      parsedRequest.data.purge.map(async (purgerName) => {
        return [
          purgerName,
          await runPurger(config.purgers[purgerName]),
        ] as const;
      }),
    );

    return response(req, {
      results: Object.fromEntries(results),
    });
  };
};
