import {firebaseProvider} from '@ledger-sync/core-integration-firebase'
import {fsProvider, makeFsKVStore} from '@ledger-sync/core-integration-fs'
import {mongodbProvider} from '@ledger-sync/core-integration-mongodb'
import {
  corePostgresProvider,
  makePostgresKVStore,
} from '@ledger-sync/core-integration-postgres'
import {makeRedisKVStore} from '@ledger-sync/core-integration-redis'
import {debugProvider, logLink, makeCoreSync} from '@ledger-sync/core-sync'
import {beancountProvider} from '@ledger-sync/integration-beancount'
import {foreceiptProvider} from '@ledger-sync/integration-foreceipt'
import {importProvider} from '@ledger-sync/integration-import'
import {oneBrickProvider} from '@ledger-sync/integration-onebrick'
import {plaidProviderNext} from '@ledger-sync/integration-plaid'
import {postgresProvider} from '@ledger-sync/integration-postgres'
import {rampProvider} from '@ledger-sync/integration-ramp'
import {splitwiseProvider} from '@ledger-sync/integration-splitwise'
import {stripeProvider} from '@ledger-sync/integration-stripe'
import {tellerProvider} from '@ledger-sync/integration-teller'
import {togglProvider} from '@ledger-sync/integration-toggl'
import {wiseProvider} from '@ledger-sync/integration-wise'
import {yodleeProviderNext} from '@ledger-sync/integration-yodlee'
import {
  addRemainderByDateLink,
  mapAccountNameAndTypeLink,
  mapStandardEntityLink,
  renameAccountLink,
} from '@ledger-sync/ledger-sync'
import {identity, R, Rx, safeJSONParse} from '@ledger-sync/util'
import {z} from 'zod'

function getEnv(key: string, opts?: {json?: boolean; required?: boolean}) {
  return R.pipe(
    z.string({required_error: `process.env[${key}] is required`}),
    (zt) => (!opts?.required ? zt.optional() : zt),
    (zt) => (opts?.json ? zt.transform((arg) => safeJSONParse(arg)) : zt),
    (zt) => zt.parse(process.env[key]),
  )
}
const getKvStore = () => {
  const variant = z
    .enum(['fs', 'postgres', 'redis'])
    .default('fs')
    .parse(process.env['KV_STORE'])
  switch (variant) {
    case 'fs':
      return makeFsKVStore({
        basePath: getEnv('FS_META_PATH') ?? `./data/meta`,
      })
    case 'postgres':
      return makePostgresKVStore({
        databaseUrl: getEnv('POSTGRES_URL', {required: true}),
      })
    case 'redis':
      return makeRedisKVStore({
        redisUrl: getEnv('REDIS_URL'),
      })
  }
}

export const ledgerSyncConfig = makeCoreSync.config({
  // Turn providers into a map rather than array so that we can prevent from
  // a data-structure level multiple providers with the same `name` being passed in?
  providers: [
    // Core
    debugProvider,
    fsProvider,
    firebaseProvider,
    mongodbProvider,
    corePostgresProvider,
    // Ledger
    plaidProviderNext,
    beancountProvider,
    importProvider,
    oneBrickProvider,
    tellerProvider,
    stripeProvider,
    rampProvider,
    wiseProvider,
    togglProvider,
    foreceiptProvider,
    yodleeProviderNext,
    splitwiseProvider,
    postgresProvider,
  ],
  linkMap: {renameAccount: renameAccountLink, log: logLink},
  // Integrations shall include `config`.
  // In contrast, connection shall include `external`
  // We do need to figure out which secrets to tokenize and which one not to though
  // Perhaps the best way is to use `secret_` prefix? (think how we might work with vgs)
  defaultIntegrations: {
    plaid: {
      ...safeJSONParse(process.env['PLAID_CREDENTIALS']),
      clientName: 'Alka',
    },
    onebrick: safeJSONParse(process.env['ONEBRICK_CREDENTIALS']),
    teller: safeJSONParse(process.env['TELLER_CREDENTIALS']),
    yodlee: {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      clientId: process.env['YODLEE_BAYU_CLIENT_ID']!,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      clientSecret: process.env['YODLEE_BAYU_CLIENT_SECRET']!,
    },
    // we could use multiple alka here...
    // alka: {
    //   baseDir: './data',
    //   // serviceAccountJson: safeJSONParse(
    //   //   process.env['FIREBASE_SERVICE_ACCOUNT_STAGING'],
    //   // ),
    //   // envName: 'staging',
    // },
  },
  kvStore: getKvStore(),
  routerUrl: '/api',
  getLinksForPipeline: ({src, links, dest}) =>
    dest.provider.name === 'beancount'
      ? [
          ...links,
          mapStandardEntityLink(src),
          addRemainderByDateLink, // What about just the addRemainder plugin?
          // renameAccountLink({
          //   Ramp: 'Ramp/Posted',
          //   'Apple Card': 'Apple Card/Posted',
          // }),
          mapAccountNameAndTypeLink(),
          logLink({prefix: 'preDest', verbose: true}),
        ]
      : dest.provider.name === 'alka'
      ? [
          ...links,
          // logLink({prefix: 'preMap'}),
          mapStandardEntityLink(src),
          // prefixIdLink(src.provider.name),
          logLink({prefix: 'preDest'}),
        ]
      : [
          ...links,
          // logLink({prefix: 'preMapStandard', verbose: true}),
          mapStandardEntityLink(src),
          Rx.map((op) =>
            op.type === 'data' && dest.provider.name !== 'postgres'
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
  defaultPipeline: {
    dest: {
      provider: 'debug',
      // provider: 'alka',
      // data: {
      //   // authUserJson: safeJSONParse(process.env['FIREBASE_AUTH_USER_STAGING']),
      //   ledgerIds: ['ldgr_default' as Id.ldgr],
      // },
    },
  },
  // defaultDestination: {
  //   provider: 'beancount',
  //   data: {outPath: './data'},
  // },
})
