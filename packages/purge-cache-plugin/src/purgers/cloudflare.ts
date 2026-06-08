import type { PurgerRunner } from '../types.js';

type CloudflarePurgerFactoryOptions = {
  apiKey: string;
  zoneId: string;
  /** Hostnames to purge. */
  hosts?: string[];
  /** Cache tags to purge. */
  tags?: string[];
  /** Prefixes to purge, including hostname but not scheme. Example: `example.com/prefix`. */
  prefixes?: string[];
  /** Full URLs to purge. Example: `https://example.com/full/path`. */
  files?: string[];
};

export const createCloudflarePurger = (
  options: CloudflarePurgerFactoryOptions,
): PurgerRunner => {
  return async () => {
    if (!options.apiKey || !options.zoneId) {
      console.warn(
        'Cloudflare API token or zone ID is not set. Skipping cache purge.',
      );

      return {
        success: false,
        error: 'Cloudflare API token or zone ID is not set.',
      };
    }

    const endpoint = `https://api.cloudflare.com/client/v4/zones/${options.zoneId}/purge_cache`;

    const { hosts, tags, prefixes, files } = options;
    const isPurgeEverything = !hosts && !tags && !prefixes && !files;

    const purgeRequestBody = isPurgeEverything
      ? { purge_everything: true }
      : { hosts, tags, prefixes, files };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${options.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(purgeRequestBody),
    });

    if (!response.ok) {
      return { success: false, error: await response.text() };
    }

    return {
      success: true,
    };
  };
};
