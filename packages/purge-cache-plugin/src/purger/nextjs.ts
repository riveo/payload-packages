import { revalidatePath } from 'next/cache.js';
import type { PurgerAction } from '../types.js';

export const getNextjsPurgerAction = (basePath = '/'): PurgerAction => {
  return () => {
    revalidatePath(basePath, 'layout');

    return Promise.resolve({ success: true });
  };
};
