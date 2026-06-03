import { definePlugin } from 'payload';
import { createApiHandler } from './api-handler.js';
import type {
  PurgeCachePluginConfig,
  PurgeCachePluginServerProps,
} from './types.js';

const DEFAULT_PATH = '/riveo-purge-cache';
const PLUGIN_SLUG = 'riveo-purge-cache';

declare module 'payload' {
  interface RegisteredPlugins {
    [PLUGIN_SLUG]: PurgeCachePluginConfig;
  }
}

const normalizePath = (path: string): `/${string}` =>
  `/${path.replace(/^\//g, '')}`;

const purgeCachePlugin = definePlugin<PurgeCachePluginConfig>({
  slug: PLUGIN_SLUG,
  plugin: ({ plugins, config, ...pluginConfig }) => {
    if (pluginConfig?.enabled === false || !config.admin) {
      return config;
    }

    const path = normalizePath(pluginConfig?.path ?? DEFAULT_PATH);
    const apiPath = normalizePath(pluginConfig?.apiPath ?? path);

    const serverProps: PurgeCachePluginServerProps = {
      purgeCachePlugin: {
        purgers: pluginConfig.purgers,
        path,
        apiPath,
        access: pluginConfig.access,
      },
    };

    return {
      ...config,
      endpoints: [
        ...(config.endpoints ?? []),
        {
          method: 'post',
          path: apiPath,
          handler: createApiHandler(pluginConfig),
        },
      ],
      admin: {
        ...config.admin,
        components: {
          ...(config.admin?.components ?? {}),
          settingsMenu: [
            ...(config.admin?.components?.settingsMenu ?? []),
            {
              path: '@riveo/payload-purge-cache-plugin/components#ToolsMenu',
              serverProps,
            },
          ],
          views: {
            ...(config.admin?.components?.views ?? {}),
            riveoPurgeCache: {
              Component: {
                path: '@riveo/payload-purge-cache-plugin/components#PurgeCache',
                serverProps,
              },
              path,
              exact: true,
            },
          },
        },
      },
    };
  },
});

export default purgeCachePlugin;
