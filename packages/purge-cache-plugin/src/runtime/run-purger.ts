import type { Purger, PurgerResult } from '../types.js';

export const runPurger = async (purger?: Purger): Promise<PurgerResult> => {
  if (!purger) {
    return {
      success: false,
      error: 'Purger not found.',
    };
  }

  try {
    return await purger.run();
  } catch (err) {
    console.error(err);
    return {
      success: false,
      error: 'Purge failed.',
    };
  }
};
