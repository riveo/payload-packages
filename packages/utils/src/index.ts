import { deepMerge, type Plugin } from 'payload';
import { translations } from './translations/index.js';

export { default as groupContentTypes } from './groupContentTypes.js';

const riveoEssentialsPlugin: () => Plugin = () => (incomingConfig) => {
  return {
    ...incomingConfig,
    i18n: {
      ...(incomingConfig.i18n ?? {}),
      translations: deepMerge(
        incomingConfig?.i18n?.translations ?? {},
        translations,
      ),
    },
  };
};

export default riveoEssentialsPlugin;
