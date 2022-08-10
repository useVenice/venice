import {Kysely} from 'kysely'

export async function up(db: Kysely<unknown>): Promise<void> {
  await db.schema
    .createTable('meta')
    .addColumn('id', 'varchar', (col) => col.primaryKey())
    .addColumn('data', 'jsonb', (col) => col.notNull().defaultTo('{}'))
    .addColumn('updated_at', 'timestamptz', (col) =>
      col.notNull().defaultTo('now()'),
    )
    .addColumn('created_at', 'timestamptz', (col) =>
      col.notNull().defaultTo('now()'),
    )
    .execute()
}

export async function down(db: Kysely<unknown>): Promise<void> {
  await db.schema.dropTable('meta').execute()
}
