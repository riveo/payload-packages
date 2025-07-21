import { deepMerge, type Plugin } from 'payload';
import { getTranslationsWithEnglishFallbackOnMissingLanguages } from './translations/index.js';

export { default as groupContentTypes } from './groupContentTypes.js';

const riveoUtilsPlugin: () => Plugin = () => (incomingConfig) => {
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
        getTranslationsWithEnglishFallbackOnMissingLanguages(
          incomingConfig?.i18n?.supportedLanguages,
        ),
      ),
    },
  };
};

export default riveoUtilsPlugin;
