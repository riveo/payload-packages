import type { GenericTranslationsObject, NestedKeysStripped } from '@payloadcms/translations'

import en from './en.js'

export const translations: Record<string, GenericTranslationsObject> = {
  en,
}

export type RiveoUtilsTranslations = typeof en;

export type RiveoUtilsTranslationKeys = NestedKeysStripped<RiveoUtilsTranslations>
