import {
  addLocalesToRequestFromData,
  headersWithCors,
  type PayloadHandler,
} from 'payload';
import { z } from 'zod';
import type { PurgeCachePluginConfig } from './types.js';

const requestSchema = z.object({
  purge: z.array(z.string()),
});

export const createHander: (
  config: PurgeCachePluginConfig,
) => PayloadHandler = (config) => {
  return async (req) => {
    const headers = headersWithCors({
      headers: new Headers(),
      req,
    });

    if (req.method !== 'post') {
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

    addLocalesToRequestFromData(req);
    const result = requestSchema.safeParse(req.data);

    if (!result.success) {
      return Response.json(
        {
          error: z.treeifyError(result.error),
        },
        { status: 422 },
      );
    }

    return Response.json(result.data);
  };
};
