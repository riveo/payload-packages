import path from 'path';
import { fileURLToPath } from 'url';
import { sqliteAdapter } from '@payloadcms/db-sqlite';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import purgeCachePlugin, {
  getNextjsPurgerAction,
} from '@riveo/payload-purge-cache-plugin';
import riveoUtilsPlugin, { groupContentTypes } from '@riveo/payload-utils';
import { buildConfig, type CollectionConfig } from 'payload';
import sharp from 'sharp';
import { migrations } from '../migrations';
import { Media } from './collections/Media';
import { Users } from './collections/Users';
import { Pages } from '@/collections/Pages';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    autoLogin:
      process.env.NODE_ENV === 'development'
        ? {
            email: 'admin@example.com',
            password: 'secret',
            prefillOnly: true,
          }
        : false,
    avatar: 'default',
    importMap: {
      baseDir: dirname,
    },
  },
  collections: groupContentTypes<CollectionConfig>(
    {
      group: 'Content',
      items: [Pages, Media],
    },
    Users,
  ),
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET ?? '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: sqliteAdapter({
    client: {
      url: `file:db.sqlite`,
    },
    migrationDir: path.resolve(process.cwd(), 'migrations'),
    push: false,
    prodMigrations: migrations,
  }),
  sharp,
  plugins: [
    purgeCachePlugin({
      purgers: [
        {
          label: 'Frontend',
          action: getNextjsPurgerAction('/'),
        },
      ],
    }),
    riveoUtilsPlugin(),
  ],
});
