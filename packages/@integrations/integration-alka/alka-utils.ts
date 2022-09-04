import {firebaseProvider} from '@ledger-sync/core-integration-firebase'
import {EntityPayload} from '@ledger-sync/ledger-sync'
import {compact, z} from '@ledger-sync/util'
// eslint-disable-next-line import/no-cycle
import {zConfig, zSettings} from './alka-schema'

const repoNameByEntityName = {
  account: 'accounts',
  transaction: 'transactions',
  commodity: 'commodities',
} as const

export const pathOf = (
  ledgerId: string,
  entityName?: EntityPayload['entityName'],
) =>
  compact([
    'ledgers',
    ledgerId,
    repoNameByEntityName[entityName as EntityPayload['entityName']] ??
      entityName,
  ]).join('/')

const ID_PREFIXES: EnumOf<Id.SimpleBrand> = {
  acct: 'acct',
  bal: 'bal',
  comm: 'comm',
  conn: 'conn',
  evt: 'evt',
  lbl: 'lbl',
  ldgr: 'ldgr',
  note: 'note',
  ntf: 'ntf',
  op: 'op',
  post: 'post',
  prce: 'prce',
  rule: 'rule',
  sd: 'sd',
  sr: 'sr',
  sv: 'sv',
  txn: 'txn',
  usr: 'usr',
}
export function matchesId<K extends keyof typeof ID_PREFIXES>(prefix: K) {
  return (str: string): str is Id.Simple[Id.SimpleBrandMapInverse[K]] =>
    str.startsWith(`${prefix}_`)
}

interface FirebaseOptions {
  projectId: string
  apiKey: string
  appId: string
  authDomain: string
  databaseURL: string
  storageBucket: string
  measurementId?: string
  messagingSenderId?: string
}
export const prodConstants = {
  firebaseOptions: {
    projectId: 'alka-production',
    apiKey: 'AIzaSyBB9Gu-H-WhY1AcW4yt0rYu4HJvByra0_A',
    appId: '1:865948916187:web:379d1bf9130b5b788d2ffe',
    authDomain: 'alka-production.firebaseapp.com',
    databaseURL: 'https://alka-production.firebaseio.com',
    storageBucket: 'alka-production.appspot.com',
    measurementId: 'G-FVLRBWG8WE',
    messagingSenderId: '865948916187',
  } as FirebaseOptions,
  plaidPublicKey: '34772d6bfe7581903fa4841a08db90',
  intercomAppId: 'xh8esf08',
  segmentAlkaWriteKey: 'leX5eRz6YNFEVOmUZ34eh4ZTFZrLYHHF',
  segmentTabsWriteKey: '55BgIePzh27C3Tm4mYYxnpMtQhU8VRef',
  sentryAlkaDsn: 'https://34054fd33d524ba5bf7d5be5087e2f19@sentry.io/1797178',
  sentryTabsDsn:
    'https://c70f4fe4c76541959ad612e6d8c75ae0@o239586.ingest.sentry.io/6020923',
  stripeAlkaPublishableKey: 'pk_live_GrL1CeZ7rJqeWAYrxB4KOPks00sSGUMnMg',
  stripeTabsPublishableKey: 'pk_live_GrL1CeZ7rJqeWAYrxB4KOPks00sSGUMnMg',
  servicebotId: '3zW4ATokvB2B',
  servicebotService: 'Alka',
  calendlyUrl:
    'https://calendly.com/alkafinance/onboarding?hide_event_type_details=1',
  commandBarOrgId: '6df4d085',
}

export const stagingConstants: typeof prodConstants = {
  ...prodConstants,
  firebaseOptions: {
    projectId: 'alka-staging',
    apiKey: 'AIzaSyBRTaCz9C7XdNah6bi9FWx0G6iMx7AuwOU',
    appId: '1:240412991968:web:bf93871d5cc0caad790b85',
    authDomain: 'alka-staging.firebaseapp.com',
    databaseURL: 'https://alka-staging.firebaseio.com',
    storageBucket: 'alka-staging.appspot.com',
    measurementId: 'G-CSF1YYFNWK',
    messagingSenderId: '240412991968',
  },
  intercomAppId: 'lkyfciv6',
  segmentAlkaWriteKey: '7DKyCoqXUvsb7545rkL3n3HUxmxZDqOn',
  segmentTabsWriteKey: 'QVz1Bb5DZ6GGFw6HDHwTdgJvwiiEGuwv',
  stripeAlkaPublishableKey: 'pk_test_Gjua0LS5XOQ4z3cSWjSM1nBM00wuQQ1lOP',
  stripeTabsPublishableKey: 'pk_test_Gjua0LS5XOQ4z3cSWjSM1nBM00wuQQ1lOP',
  servicebotId: '1vKLs1ebg7rJ',
  servicebotService: 'Alka Test',
  calendlyUrl: 'https://calendly.com/yenbekbay/30min?hide_event_type_details=1',
}

export const devConstants: typeof stagingConstants = {
  ...stagingConstants,
  firebaseOptions: {
    // `demo-` is a special namespace reserved for the emulator
    // https://github.com/firebase/firebase-tools/pull/3291
    projectId: 'demo-alka',
    apiKey: 'fake-api-key',
    appId: 'fake-app-id',
    authDomain: 'demo-alka.firebaseapp.com',
    databaseURL: 'https://demo-alka.firebaseio.com',
    storageBucket: 'demo-alka.appspot.com',
  },
  segmentAlkaWriteKey: 'HAvf1qIy3jFdmLrpZkcYMQD4kM637iAM',
  segmentTabsWriteKey: 'HAvf1qIy3jFdmLrpZkcYMQD4kM637iAM',
}

const constantsByEnv = {
  production: prodConstants,
  staging: stagingConstants,
  dev: devConstants,
}

export const firebaseSettings = (
  config: z.infer<typeof zConfig>,
  settings: Extract<z.infer<typeof zSettings>, {type: `firebase-${string}`}>,
): z.infer<typeof firebaseProvider['def']['connectionSettings']> =>
  settings.type === 'firebase-admin'
    ? {
        role: 'admin',
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        serviceAccount: config.serviceAccountByEnv?.[settings.envName]!, // initFirestore will validate
      }
    : {
        role: 'user',
        authData: settings.authData,
        firebaseConfig: constantsByEnv[settings.envName].firebaseOptions,
      }
