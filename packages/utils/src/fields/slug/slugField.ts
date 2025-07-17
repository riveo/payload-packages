import type { TFunction } from '@payloadcms/translations';
import type { GroupField } from 'payload';
import type { RiveoUtilsTranslationKeys } from '../../translations/index.js';
import type { FieldOptions } from '../types.js';
import { formatSlugHook } from './formatSlug.js';

type SlugFieldOptions = FieldOptions<GroupField> & {
  autogenerateSourceField?: string;
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
        type: 'text',
        name: 'value',
        unique: true,
        index: true,
        hooks: {
          beforeValidate: [formatSlugHook(options?.autogenerateSourceField)],
        },
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
            autogenerateSourceField: options?.autogenerateSourceField,
          },
        },
        ...(options?.overrides?.admin?.components ?? {}),
      },
    },
  };
};

export default slugField;
