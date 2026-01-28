import type { TFunction } from '@payloadcms/translations';
import type { CollectionSlug, GroupField } from 'payload';
import type { RiveoUtilsTranslationKeys } from '../translations/index.js';
import type { FieldOptions } from './types.js';

type SeoFieldOptions = FieldOptions<GroupField> & {
  /**
   * Media collection slug to use for SEO image
   */
  mediaCollection?: CollectionSlug | false;
};

const seoField = (options?: SeoFieldOptions): GroupField => {
  const fields: GroupField['fields'] = [
    {
      type: 'text',
      name: 'title',
      localized: true,
      label: ({ t }) =>
        (t as TFunction<RiveoUtilsTranslationKeys>)(
          'riveo:utils:fields:seo:title',
        ),
    },
    {
      type: 'textarea',
      name: 'description',
      localized: true,
      label: ({ t }) =>
        (t as TFunction<RiveoUtilsTranslationKeys>)(
          'riveo:utils:fields:seo:description',
        ),
    },
  ];

  if (options?.mediaCollection) {
    fields.push({
      name: 'image',
      type: 'upload',
      localized: true,
      label: ({ t }) =>
        (t as TFunction<RiveoUtilsTranslationKeys>)(
          'riveo:utils:fields:seo:image',
        ),
      relationTo: options.mediaCollection,
      required: false,
      filterOptions: {
        mimeType: { contains: 'image/' },
      },
    });
  }

  fields.push(...(options?.overrides?.fields ?? []));

  return {
    interfaceName: 'SeoField',
    name: 'seo',
    label: ({ t }) =>
      (t as TFunction<RiveoUtilsTranslationKeys>)(
        'riveo:utils:fields:seo:label',
      ),
    ...(options?.overrides ?? {}),
    admin: {
      disableListColumn: true,
      ...(options?.overrides?.admin ?? {}),
    },
    type: 'group',
    fields,
  };
};

export default seoField;
