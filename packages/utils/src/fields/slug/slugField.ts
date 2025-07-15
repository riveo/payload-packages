import type { GroupField } from 'payload';
import type {FieldOptions} from "../types.js";
import { formatSlugHook } from './formatSlug.js';

type SlugFieldOptions = FieldOptions<GroupField> & {
  autogenerateSourceField?: string;
};

const slugField = (options?: SlugFieldOptions): GroupField => {
  return {
    name: 'slug',
    type: 'group',
    label: 'Slug',
    localized: true,
    fields: [
      {
        type: 'text',
        name: 'value',
        unique: true,
        index: true,
        required: true,
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
        Cell: '@/fields/slug/components/Cell',
        Field: {
          path: '@/fields/slug/components/Field',
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
