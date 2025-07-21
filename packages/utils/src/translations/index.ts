import type {
  GenericTranslationsObject,
  NestedKeysStripped,
  SupportedLanguages,
} from '@payloadcms/translations';

import en from './en.js';

export const translations: Record<string, GenericTranslationsObject> = {
  en,
};

export const getTranslationsWithEnglishFallbackOnMissingLanguages = (
  supportedLanguages: SupportedLanguages | undefined,
) => {
  if (!supportedLanguages) {
    return translations;
  }

  const result: Record<string, GenericTranslationsObject> = { ...translations };

  for (const lang of Object.keys(supportedLanguages)) {
    result[lang] ??= en;
  }

  return result;
};

export type RiveoUtilsTranslations = typeof en;

export type RiveoUtilsTranslationKeys =
  NestedKeysStripped<RiveoUtilsTranslations>;
