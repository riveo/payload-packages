import {seoField, slugField, internalTitleField} from "@riveo/payload-utils/fields";
import type { CollectionConfig } from 'payload';

export const Pages: CollectionConfig = {
  slug: 'pages',
  fields: [
    internalTitleField(),
    internalTitleField({
      generateFrom: 'title',
      overrides: {
        name: 'internalTitleAuto',
        label: 'Internal Title Auto Generated',
      },
    }),
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
    },
    {
      type: 'group',
      name: 'riveoUtils',
      fields: [slugField({ autogenerateSourceField: 'title' })],
    },
    seoField(),
  ],
};
