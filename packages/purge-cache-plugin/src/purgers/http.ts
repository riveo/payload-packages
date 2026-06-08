import type { PurgerAction } from '../types.js';

export const getHttpPurgerAction = (
  endpoint: RequestInfo,
  options?: RequestInit,
): PurgerAction => {
  return async () => {
    try {
      const response = await fetch(endpoint, options);

      if (response.status >= 400) {
        return {
          success: false,
          error: `${response.status} ${await response.text()}`,
        };
      }

      return { success: true };
    } catch (e) {
      console.error(e);
      return { success: false, error: 'API call error.' };
    }
  };
};
