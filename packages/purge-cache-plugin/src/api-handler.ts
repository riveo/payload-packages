import {
  addDataAndFileToRequest,
  headersWithCors,
  type PayloadHandler,
} from 'payload';
import { z } from 'zod';
import type { PurgeCachePluginConfig } from './types.js';

const requestSchema = z.object({
  purge: z.array(z.string()),
});

export type PurgeCacheRequestData = z.infer<typeof requestSchema>;

export const createApiHandler: (
  config: PurgeCachePluginConfig,
) => PayloadHandler = (config) => {
  return async (req) => {
    const headers = headersWithCors({
      headers: new Headers(),
      req,
    });

    if (req.method?.toUpperCase() !== 'POST') {
      return new Response('', {
        status: 405,
        headers,
      });
    }

    if (!req?.user) {
      return Response.json({ error: 'forbidden' }, { status: 403, headers });
    }

    const allowAccess = config.access
      ? !(await config.access({ user: req.user }))
      : true;

    if (!allowAccess) {
      return Response.json({ error: 'forbidden' }, { status: 403, headers });
    }

    await addDataAndFileToRequest(req);
    const parsedRequest = requestSchema.safeParse(req.data);

    if (!parsedRequest.success) {
      return Response.json(
        {
          error: z.treeifyError(parsedRequest.error),
        },
        { status: 400 },
      );
    }

    const promises = parsedRequest.data.purge.map(async (purgerName) => {
      const purger = config.purgers[purgerName];

      if (!purger) {
        return [
          purgerName,
          {
            success: false,
            error: 'Not found.',
          },
        ];
      }

      return [purgerName, await purger.action()];
    });

    const results = await Promise.all(promises);

    return Response.json(Object.fromEntries(results));
  };
};
