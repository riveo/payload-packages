import type { CollectionSlug, GroupField, OptionObject } from 'payload';
import type { FieldOptions } from './types.js';

type LinkFieldOptions = FieldOptions<GroupField> & {
  /**
   * Name of the field. And be rewriteen by `overrides.name`
   */
  name: string;
  /**
   * Collection slugs that are allowed as Internal Link
   */
  internalLinkCollections?: CollectionSlug[];
};

const LinkTypeValue = {
  custom: 'custom',
  internal: 'internal',
} as const;

const linkField = (options: LinkFieldOptions): GroupField => {
  const hasInternalLink =
    options?.internalLinkCollections &&
    options.internalLinkCollections.length > 0;

  const linkTypeOptions: [OptionObject, ...OptionObject[]] = [
    {
      value: LinkTypeValue.custom,
      label: ({ t }) => t('fields:customURL'),
    },
  ];

  const fields: GroupField['fields'] = [
    {
      type: 'text',
      name: 'text',
      label: ({ t }) => t('fields:textToDisplay'),
      required: true,
    },
    {
      type: 'radio',
      name: 'linkType',
      label: ({ t }) => t('fields:linkType'),
      required: true,
      admin: {
        description: ({ t }) => t('fields:chooseBetweenCustomTextOrDocument'),
      },
      defaultValue: LinkTypeValue.custom,
      options: linkTypeOptions,
    },
    {
      type: 'text',
      name: 'url',
      label: ({ t }) => t('fields:enterURL'),
      required: true,
      admin: {
        condition: (_, siblingData) =>
          !hasInternalLink || siblingData?.linkType === LinkTypeValue.custom,
      },
    },
  ];

  if (hasInternalLink) {
    fields.push({
      name: 'doc',
      label: ({ t }) => t('fields:chooseDocumentToLink'),
      type: 'relationship',
      relationTo: options?.internalLinkCollections ?? [],
      required: true,
      maxDepth: 1,
      admin: {
        condition: (_, siblingData) => siblingData?.linkType === 'internal',
      },
    });

    linkTypeOptions.push({
      label: ({ t }) => t('fields:internalLink'),
      value: LinkTypeValue.internal,
    });
  }

  fields.push({
    type: 'checkbox',
    name: 'newTab',
    label: ({ t }) => t('fields:openInNewTab'),
  });

  fields.push(...(options?.overrides?.fields ?? []));

  return {
    name: options?.name,
    interfaceName: 'LinkField',
    localized: true,
    admin: {
      hideGutter: true,
      ...(options?.overrides?.admin ?? {}),
    },
    ...(options?.overrides ?? {}),
    type: 'group',
    fields,
  };
};

export default linkField;
