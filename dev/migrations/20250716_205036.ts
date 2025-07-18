import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite';

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`pages\` ADD \`seo_title\` text;`);
  await db.run(sql`ALTER TABLE \`pages\` ADD \`seo_description\` text;`);
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`seo_title\`;`);
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`seo_description\`;`);
}
