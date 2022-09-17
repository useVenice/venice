/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {logLink, makeId, swapPrefix} from '@ledger-sync/cdk-core'
import {
  addRemainderByDateLink,
  mapAccountNameAndTypeLink,
  mapStandardEntityLink,
  renameAccountLink,
} from '@ledger-sync/cdk-ledger'
import {makePostgresMetaService} from '@ledger-sync/core-integration-postgres'
import {makeSyncEngine} from '@ledger-sync/engine-backend'
// console.log('Using config', ledgerSyncConfig) // Too verbose...
import {type inferProcedureInput} from '@ledger-sync/engine-backend'
import {identity, Rx, zParser} from '@ledger-sync/util'

import {ledgerSyncCommonConfig} from './commonConfig'
import {parseIntConfigsFromEnv, zAllEnv} from './env'

const env = zParser(zAllEnv).parseUnknown(process.env)

/**
 * This requires the env vars to exist...
 * TODO: Separate it so that the entire config isn't constructed client side
 * and only the minimal needed methods are...
 */
export const ledgerSyncBackendConfig = makeSyncEngine.config({
  ...ledgerSyncCommonConfig,
  jwtSecretOrPublicKey: env.JWT_SECRET_OR_PUBLIC_KEY,
  metaService: makePostgresMetaService({databaseUrl: env.POSTGRES_URL}),
  // TODO: support other config service such as fs later...
  linkMap: {renameAccount: renameAccountLink, log: logLink},
  // Integrations shall include `config`.
  // In contrast, connection shall include `external`
  // We do need to figure out which secrets to tokenize and which one not to though
  // Perhaps the best way is to use `secret_` prefix? (think how we might work with vgs)

  // TODO: Validate these immediately upon launch?
  // TODO: Do not expose any of this to the frontend
  defaultIntegrations: parseIntConfigsFromEnv(env),
  getLinksForPipeline: ({source, links: links, destination}) =>
    destination.integration.provider.name === 'beancount'
      ? [
          ...links,
          mapStandardEntityLink(source),
          addRemainderByDateLink, // What about just the addRemainder plugin?
          // renameAccountLink({
          //   Ramp: 'Ramp/Posted',
          //   'Apple Card': 'Apple Card/Posted',
          // }),
          mapAccountNameAndTypeLink(),
          logLink({prefix: 'preDest', verbose: true}),
        ]
      : destination.integration.provider.name === 'alka'
      ? [
          ...links,
          // logLink({prefix: 'preMap'}),
          mapStandardEntityLink(source),
          // prefixIdLink(src.provider.name),
          logLink({prefix: 'preDest'}),
        ]
      : [
          ...links,
          // logLink({prefix: 'preMapStandard', verbose: true}),
          mapStandardEntityLink(source),
          Rx.map((op) =>
            op.type === 'data' &&
            destination.integration.provider.name !== 'postgres'
              ? identity<typeof op>({
                  ...op,
                  data: {
                    ...op.data,
                    entity: {
                      standard: op.data.entity,
                      external: op.data.external,
                    },
                  },
                })
              : op,
          ),
          logLink({prefix: 'preDest'}),
        ],
  // Default destination connection, may contain integration data
  // Default destination will have to be computed at runtime based on the current
  // user id for example. Will sort this later
  getDefaultPipeline: (conn) => ({
    id: conn?.id ? swapPrefix(conn.id, 'pipe') : makeId('pipe', 'default'),
    source: conn,
    destination: {
      id: 'conn_postgres',
      // TODO: Add validation here, and perhaps migration too

      settings: {databaseUrl: process.env['POSTGRES_URL']!},
      // provider: 'alka',
      // settings: {
      //   // authUserJson: getEnv('FIREBASE_AUTH_USER_STAGING'),
      //   ledgerIds: ['ldgr_default' as Id.ldgr],
      // },
    },
  }),
})

export const {router: ledgerSyncRouter, ...syncEngine} = makeSyncEngine(
  ledgerSyncBackendConfig,
)
export type LedgerSyncRouter = typeof ledgerSyncRouter
export type LedgerSyncInput = inferProcedureInput<
  LedgerSyncRouter['_def']['mutations']['syncPipeline']
>[0]
