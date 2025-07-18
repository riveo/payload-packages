import { deepMerge, type Plugin } from 'payload';
import { translations } from './translations/index.js';

export { default as groupContentTypes } from './groupContentTypes.js';

export const riveoUtilsPlugin: () => Plugin = () => (incomingConfig) => {
  return {
    ...incomingConfig,
    admin: {
      avatar: 'default',
      ...(incomingConfig.admin ?? {}),
    },
    i18n: {
      ...(incomingConfig.i18n ?? {}),
      translations: deepMerge(
        incomingConfig?.i18n?.translations ?? {},
        translations,
      ),
    },
  };
};

export default riveoUtilsPlugin;
