import { revalidatePath } from 'next/cache.js';
import type { PurgerRunner } from '../types.js';

export const createNextJsPathPurger = (basePath = '/'): PurgerRunner => {
  return () => {
    revalidatePath(basePath, 'layout');

    return Promise.resolve({ success: true });
  };
};
