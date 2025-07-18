import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite';

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`pages_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` integer NOT NULL,
  	\`path\` text NOT NULL,
  	\`pages_id\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`pages_id\`) REFERENCES \`pages\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `);
  await db.run(
    sql`CREATE INDEX \`pages_rels_order_idx\` ON \`pages_rels\` (\`order\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`pages_rels_parent_idx\` ON \`pages_rels\` (\`parent_id\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`pages_rels_path_idx\` ON \`pages_rels\` (\`path\`);`,
  );
  await db.run(
    sql`CREATE INDEX \`pages_rels_pages_id_idx\` ON \`pages_rels\` (\`pages_id\`);`,
  );
  await db.run(
    sql`ALTER TABLE \`pages\` ADD \`riveo_utils_link_text\` text DEFAULT '///' NOT NULL;`,
  );
  await db.run(
    sql`ALTER TABLE \`pages\` ADD \`riveo_utils_link_link_type\` text DEFAULT 'custom' NOT NULL;`,
  );
  await db.run(sql`ALTER TABLE \`pages\` ADD \`riveo_utils_link_url\` text;`);
  await db.run(
    sql`ALTER TABLE \`pages\` ADD \`riveo_utils_link_new_tab\` integer;`,
  );
}

export async function down({
  db,
  payload,
  req,
}: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`pages_rels\`;`);
  await db.run(
    sql`ALTER TABLE \`pages\` DROP COLUMN \`riveo_utils_link_text\`;`,
  );
  await db.run(
    sql`ALTER TABLE \`pages\` DROP COLUMN \`riveo_utils_link_link_type\`;`,
  );
  await db.run(
    sql`ALTER TABLE \`pages\` DROP COLUMN \`riveo_utils_link_url\`;`,
  );
  await db.run(
    sql`ALTER TABLE \`pages\` DROP COLUMN \`riveo_utils_link_new_tab\`;`,
  );
}
