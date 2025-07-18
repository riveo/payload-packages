import type { TFunction } from '@payloadcms/translations';
import { get, has } from 'lodash-es';
import type { TextField } from 'payload';
import type { RiveoUtilsTranslationKeys } from '../translations/index.js';
import type { FieldOptions } from './types.js';

type InternalTitleOptions = FieldOptions<TextField & { hasMany: false }> & {
  /**
   * The field used to autogenerate internal title when it's empty.
   */
  generateFrom?: string;
};

const internalTitleField = (options?: InternalTitleOptions): TextField => {
  const beforeChange = options?.overrides?.hooks?.beforeChange ?? [];
  const generateFrom = options?.generateFrom;

  if (generateFrom) {
    beforeChange.push(({ value, data, collection }) => {
      if (!data || value || !has(data, generateFrom)) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return value;
      }

      const possibleValue = `${get(data, generateFrom)}`;
      if (possibleValue) {
        return possibleValue;
      }

      return `${collection?.slug}-${data?.id}`;
    });
  }

  return {
    name: 'internalTitle',
    type: 'text',
    label: ({ t }) =>
      (t as TFunction<RiveoUtilsTranslationKeys>)(
        'riveo:utils:fields:internalTitle:label',
      ),
    ...(options?.overrides ?? {}),
    hooks: {
      ...(options?.overrides?.hooks ?? {}),
      beforeChange,
    },
  };
};

export default internalTitleField;
