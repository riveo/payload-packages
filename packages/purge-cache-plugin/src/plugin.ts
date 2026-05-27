import { definePlugin } from 'payload';
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

const purgeCachePlugin = definePlugin<PurgeCachePluginConfig>({
  slug: PLUGIN_SLUG,
  plugin: ({ plugins, config, ...pluginConfig }) => {
    if (
      pluginConfig?.enabled === false ||
      pluginConfig.purgers.length === 0 ||
      !config.admin
    ) {
      return config;
    }

    const path: `/${string}` = `/${(pluginConfig?.path ?? DEFAULT_PATH).replace(/^\//g, '')}`;

    const serverProps: PurgeCachePluginServerProps = {
      purgeCachePlugin: {
        purgers: [], // pluginConfig.purgers,
        path,
        access: pluginConfig.access,
      },
    };

    return {
      ...config,
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
