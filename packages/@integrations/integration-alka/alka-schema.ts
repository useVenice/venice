import {
  zAuthData,
  zServiceAccount,
} from '@ledger-sync/core-integration-firebase'
import {R, z} from '@ledger-sync/util'
import {matchesId} from './alka-utils'

const zFirebaseConfig = z.object({
  projectId: z.string(),
  apiKey: z.string(),
  appId: z.string(),
  authDomain: z.string(),
  databaseURL: z.string(),
  storageBucket: z.string().optional(),
  measurementId: z.string().optional(),
  messagingSenderId: z.string().optional(),
})
const zFirebaseUserConfig = z.object({
  firebaseConfig: zFirebaseConfig.nullish(),
  authData: zAuthData,
})
export const zSettings = R.pipe(
  z.object({envName: z.enum(['staging', 'production'])}),
  (env) =>
    z.discriminatedUnion('type', [
      z.object({type: z.literal('fs')}),
      // Need to be careful who can can actually create a connection...
      env.extend({type: z.literal('firebase-admin')}),
      env.extend({type: z.literal('firebase-user')}).merge(zFirebaseUserConfig),
    ]),
)

export const zDestSyncOptions = z.object({
  ledgerId: z.string().refine(matchesId('ldgr')),
})

export const zConfig = z.object({
  /** Support reading data from firebase */
  serviceAccountByEnv: z
    .object({
      staging: zServiceAccount.nullish(),
      production: zServiceAccount.nullish(),
    })
    .nullish(),
  /** Support reading data from fs */
  fsBasePath: z.string().nullish(),
})


