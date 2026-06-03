import type { PurgerAction } from '../types.js';

type CloudflarePurgerFactoryOptions = {
  apiKey: string;
  zoneId: string;
  /**
   * List of hosts to purge
   */
  hosts?: string[];
  /**
   * List of cache tags to purge
   */
  tags?: string[];
  /**
   * List of prefixes to purge. A prefix has to include hostname but not scheme
   * e.g.: example.com/prefix
   */
  prefixes?: string[];
  /**
   * List of specific urls to purge. An url has to include scheme, hostname and path
   * e.g.: https://example.com/full/path
   */
  files?: string[];
};

export const getCloudflarePurgerAction = (
  options: CloudflarePurgerFactoryOptions,
): PurgerAction => {
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
