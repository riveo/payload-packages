import { z, type ZodError } from 'zod';
import type { PurgerResult } from './types.js';

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
