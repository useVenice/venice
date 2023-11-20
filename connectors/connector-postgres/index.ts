// Should this actually be called `integration-export` or `integration-standard`? Similar to `integration-spreadsheet`?
// Previously this used to be called `integration-alka`, but given alka is no longer relevant, how do we want to define this?

import postgresDef from './def'
import postgresServer from './server'

// codegen:start {preset: barrel, include: "./{*.{ts,tsx},*/index.{ts,tsx}}", exclude: "./**/*.{d,spec,test,fixture,gen,node}.{ts,tsx}"}
export * from './def'
export * from './makePostgresClient'
export * from './server'
// codegen:end

export const postgresProvider = {
  ...postgresDef,
  ...postgresServer,
}
