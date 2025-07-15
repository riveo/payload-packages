import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`pages\` ADD \`riveo_utils_slug_value\` text NOT NULL;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`riveo_utils_slug_auto\` integer DEFAULT true;`)
  await db.run(sql`CREATE UNIQUE INDEX \`pages_riveo_utils_slug_riveo_utils_slug_value_idx\` ON \`pages\` (\`riveo_utils_slug_value\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP INDEX \`pages_riveo_utils_slug_riveo_utils_slug_value_idx\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`riveo_utils_slug_value\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`riveo_utils_slug_auto\`;`)
}
