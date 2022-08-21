import {upsertByIdQuery} from './makePostgresClient'
import './register.node'

// String snapshot serializer
expect.addSnapshotSerializer({
  serialize: (val: string, _, indent) =>
    val
      .split('\n')
      .filter((s) => !!s.trim())
      .map((s) => indent + s.trim())
      .join('\n'),
  test: (val) => typeof val === 'string',
})

test('sql generation', () => {
  const tableName = 'transaction'
  const id = 'txn_test'
  const valueMap = {provider_name: 'plaid', connection_id: 'conn_test123'}
  const query = upsertByIdQuery(tableName, id, valueMap)

  expect(query.sql).toMatchInlineSnapshot(`
    INSERT INTO "transaction" (id, "provider_name", "connection_id", "updated_at")
    VALUES ($1, $2, $3, 'now()')
    ON CONFLICT (id) DO UPDATE SET
    "provider_name" = excluded."provider_name",
    "connection_id" = excluded."connection_id",
    "updated_at" = excluded."updated_at"
    WHERE
    "transaction"."provider_name" IS DISTINCT FROM excluded."provider_name" OR
    "transaction"."connection_id" IS DISTINCT FROM excluded."connection_id";
  `)
  expect(query.values).toMatchInlineSnapshot(`
    Array [
        txn_test,
        plaid,
        conn_test123,
    ]
  `)
})
