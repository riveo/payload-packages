import {seoField, slugField} from "@riveo/payload-utils/fields";
import type { CollectionConfig } from 'payload';

export const Pages: CollectionConfig = {
  slug: 'pages',
  fields: [
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
