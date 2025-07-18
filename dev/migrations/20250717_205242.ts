import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`pages\` ADD \`internal_title\` text;`)
  await db.run(sql`ALTER TABLE \`pages\` ADD \`internal_title_auto\` text;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`internal_title\`;`)
  await db.run(sql`ALTER TABLE \`pages\` DROP COLUMN \`internal_title_auto\`;`)
}
