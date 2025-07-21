import type { TFunction } from '@payloadcms/translations';
import type { GroupField, TextFieldSingleValidation } from 'payload';
import { text } from 'payload/shared';
import type { RiveoUtilsTranslationKeys } from '../../translations/index.js';
import type { FieldOptions } from '../types.js';
import { formatSlugHook } from './formatSlug.js';

type SlugFieldOptions = FieldOptions<GroupField> & {
  /**
   * The field used to autogenerate slug
   */
  generateFrom?: string;

  /**
   * Allow empty string as slug
   */
  allowEmptyValue?: boolean;
};

const slugField = (options?: SlugFieldOptions): GroupField => {
  return {
    name: 'slug',
    type: 'group',
    label: ({ t }) =>
      (t as TFunction<RiveoUtilsTranslationKeys>)(
        'riveo:utils:fields:slug:label',
      ),
    localized: true,
    fields: [
      {
        admin: {
          disableListColumn: true,
        },
        type: 'text',
        name: 'value',
        unique: true,
        index: true,
        required: true,
        hooks: {
          beforeValidate: [formatSlugHook(options?.generateFrom)],
        },
        validate: ((value, validateOptions) => {
          return text(value, {
            ...validateOptions,
            required: options?.allowEmptyValue !== true,
          });
        }) satisfies TextFieldSingleValidation,
      },
      {
        type: 'checkbox',
        required: false,
        name: 'auto',
        defaultValue: true,
        admin: {
          disableListColumn: true,
          disableListFilter: true,
          disableBulkEdit: true,
        },
      },
    ],
    ...(options?.overrides ?? {}),
    admin: {
      hideGutter: true,
      ...(options?.overrides?.admin ?? {}),
      components: {
        Cell: '@riveo/payload-utils/components#SlugCell',
        Field: {
          path: '@riveo/payload-utils/components#SlugField',
          clientProps: {
            generateFrom: options?.generateFrom,
          },
        },
        ...(options?.overrides?.admin?.components ?? {}),
      },
    },
  };
};

export default slugField;
