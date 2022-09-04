import {
  anyFirestore,
  firebaseProvider,
} from '@ledger-sync/core-integration-firebase'
import {fsProvider} from '@ledger-sync/core-integration-fs'
import {makeSyncProvider} from '@ledger-sync/core-sync'
import {
  ledgerSyncProviderBase,
  zEntityPayloadWithExternal,
} from '@ledger-sync/ledger-sync'
import {deepOmitUndefined, R, Rx, rxjs, z} from '@ledger-sync/util'
import {zConfig, zDestSyncOptions, zSettings} from './alka-schema'
import {firebaseSettings, pathOf} from './alka-utils'

const def = makeSyncProvider.def({
  ...ledgerSyncProviderBase.def,
  name: z.literal('alka'),
  connectionSettings: zSettings,
  integrationConfig: zConfig.nullish(),
  destinationSyncOptions: zDestSyncOptions,
  destinationInputEntity: zEntityPayloadWithExternal,
})

const _now = () =>
  R.pipe(Date.now(), (now) => ({
    seconds: Math.floor(now / 1000),
    nanoseconds: (now % 1000) * 1000,
  }))
export const alkaProvider = makeSyncProvider({
  ...makeSyncProvider.defaults,
  def,

  destinationSync: ({settings, config, options: {ledgerId}}) => {
    const {currentTimestamp, fieldDelete} =
      settings.type === 'fs'
        ? {
            currentTimestamp: (): any => _now(),
            fieldDelete: (): any => undefined,
          }
        : R.pipe(
            anyFirestore(
              settings.type.replace('firebase-', '') as 'admin' | 'user',
            ),
            (fst) => ({
              currentTimestamp: () => fst.Timestamp.now(),
              fieldDelete: () => fst.FieldValue.delete(),
            }),
          )

    return rxjs.pipe(
      Rx.mergeMap(async (op) => {
        if (op.type !== 'data') {
          return op
        }
        const {connectionId, externalId, ...data} = op.data
        const raw = deepOmitUndefined({
          id: data.id as Id.acct,
          ledgerId,
          externalId: externalId as Id.external,
          providerName: data.providerName as any,
          external: {...(data.external as any), _id: externalId},
          original: data.entity ?? undefined,
          deletedAt: data.entity
            ? fieldDelete() // Next: Handle undefined (and setPartial) inside fs provider
            : currentTimestamp(),
          // deletedAt: incremental ? undefined : fieldDelete(),
          connectionId: connectionId as Id.conn | undefined,
          createdAt: currentTimestamp(),
          updatedAt: currentTimestamp(),
          syncedAt: currentTimestamp(),
          // Allow deleted objects to come back if we are not doing incremental sync
          // This logic is really not great. We should use some other mechanism to force
          // object to be deleted or otherwise excluded from sync, not based on
          // whether sync is incremental...
          // Let us no longer worry about sync tokens...
          // syncToken,
          // TODO: This is confusing given that it can also be overriden in `manual` and `original`.
          removed: data.external === null,
          orphanedAt: false,
        })
        // TODO: Add handling for pendingTransactionExternalId

        return {
          ...op, // make me less verbose...
          settings: {
            ...op.data,
            entityName: pathOf(ledgerId, op.data.entityName),
            entity: raw,
          },
        }
      }),
      settings.type === 'fs'
        ? fsProvider.destinationSync({
            settings: {
              basePath: z
                .string() // Make fsBasePath required by parsing
                .parse(config?.fsBasePath, {path: ['config', 'fsBasePath']}),
            },
          })
        : firebaseProvider.destinationSync({
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            settings: firebaseSettings(config!, settings),
          }),
    )
  },
})
