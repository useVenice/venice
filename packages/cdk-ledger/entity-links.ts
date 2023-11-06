import type {
  AnyEntityPayload,
  Id,
  IntegrationDef,
  Link,
} from '@usevenice/cdk-core'
import {handlersLink, transformLink} from '@usevenice/cdk-core'
import type {Standard} from '@usevenice/standard'
import type {AmountMap, WritableDraft} from '@usevenice/util'
import {
  A,
  AM,
  computeTrialBalance,
  objectEntries,
  produce,
  R,
  Rx,
  rxjs,
  setDefault,
  z,
  zFunction,
} from '@usevenice/util'

import type {
  EntityPayload,
  EntityPayloadWithExternal,
  StdSyncOperation,
} from './entity-link-types'
import {makeStandardId, zStandardEntityPrefixFromName} from './utils'

// TODO: Can we use the `parsedReso` type here?
export function mapStandardEntityLink({
  integration: {provider},
  settings: initialSettings,
  id: sourceId,
}: {
  integration: {provider: IntegrationDef}
  settings: unknown
  id: Id['reso'] | undefined
}): Link<AnyEntityPayload, EntityPayloadWithExternal> {
  return Rx.mergeMap((op) => {
    if (op.type !== 'data') {
      return rxjs.of(op)
    }
    // TODO: Extract this mapStandard into tis own function!
    const [vertical, entityName] = op.data.entityName.split('.')
    const mapper =
      provider.mappers?.[vertical as 'accounting']?.[entityName as 'account']

    const id = makeStandardId(
      // TODO: leverage openAPI format field!
      entityName === 'expense'
        ? ('exp' as never)
        : zStandardEntityPrefixFromName.parse(entityName ?? vertical),
      provider.name,
      op.data.id,
    )
    if (mapper) {
      const standard = mapper(op.data.entity as never, initialSettings)
      return rxjs.of({
        ...op,
        data: {
          entityName: op.data.entityName as 'account',
          entity: standard as any,
          id,
          external: op.data.entity,
          providerName: provider.name,
          externalId: op.data.id,
          sourceId,
        } satisfies EntityPayloadWithExternal,
      })
    }

    // @deprecated
    const sourceMapEntity = provider.extension?.sourceMapEntity
    if (!sourceMapEntity) {
      throw new Error('Expecting VeniceProvider in mapStandardEntityLink')
    }
    // TODO: Update the initialReso as we receive resource updates
    const payload = R.pipe(sourceMapEntity, (map) =>
      typeof map === 'function'
        ? map(op.data, initialSettings)
        : map?.[op.data.entityName]?.(op.data, initialSettings),
    )

    if (!payload) {
      // console.error('[mapStandardEntityLink] Unable to map payload', op)
      return rxjs.EMPTY
    }

    return rxjs.of({
      ...op,
      data: {
        ...payload,
        id,
        external: op.data.entity,
        providerName: provider.name,
        externalId: op.data.id,
        sourceId,
      },
    })
  })
}

// TODO: Move into entityLink
export interface StdCache {
  account: Record<string, Standard.Account>
  transaction: Record<string, Standard.Transaction>
  commodity: Record<string, Standard.Commodity>
}

export function _opsFromCache(cache: StdCache) {
  return R.pipe(
    cache,
    (c) => objectEntries(c),
    R.flatMap(([entityName, entityById]) =>
      objectEntries(entityById).map(
        // @ts-expect-error Not fully sure how to type this
        ([id, entity]): EntityPayload => ({id, entity, entityName}),
      ),
    ),
    R.map((input): StdSyncOperation => ({type: 'data', data: input})),
  )
}

/** Performs cumulative transform */
export function cachingLink(
  onCommit: (c: StdCache) => rxjs.Observable<StdSyncOperation>,
) {
  const cache: StdCache = {account: {}, transaction: {}, commodity: {}}
  let numChanges = 0
  return handlersLink({
    data: (op) => {
      if (op.data.entity) {
        cache[op.data.entityName][op.data.id] = op.data.entity
      } else {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete cache[op.data.entityName][op.data.id]
      }
      numChanges++
    },
    commit: () => {
      if (numChanges === 0) {
        return
      }
      console.log('[makeCachingLink] commit', {numChanges})
      numChanges = 0
      return onCommit(cache)
    },
  })
}

export function cachingTransformLink(
  transform: (c: WritableDraft<StdCache>) => StdCache | void,
) {
  return cachingLink((cache) =>
    rxjs.from([
      ..._opsFromCache(produce(cache, transform)),
      R.identity<StdSyncOperation>({type: 'commit'}),
    ]),
  )
}

// TODO: Move this entire file into @usevenice/cdk-ledger package

/**
 * Used to workaround beancount limitation https://groups.google.com/g/beancount/c/PmkPVgLNKgg
 * Not ideal that we have to use Venice link to workaround
 * beancount quirk. Maybe this should actually be a beancount plugin in python?
 * @see https://share.cleanshot.com/8AVFxc
 * We have two options instead
 * 1) Implement this as a beancount plugin in python, which would also
 *    make this configurable rather than hard-coded here...
 * 2) Alternatively we can implement it as a caching plugin based on detecting
 *    parent account and the presence of balance entry there.
 * In any case these should be configurable
 */

export const renameAccountLink = zFunction(z.record(z.string()), (mapping) =>
  transformLink<EntityPayload>((op) => {
    if (
      op.type === 'data' &&
      op.data.entityName === 'account' &&
      op.data.entity
    ) {
      op.data.entity.name = mapping[op.data.entity.name] ?? op.data.entity.name
    }
  }),
)

/** Link is always a function by Rx.js convention. remeda is looser though */
export function mapAccountNameAndTypeLink() {
  return cachingTransformLink((draft) => {
    // console.debug('[mapAccountNameAndTypeLink]', draft.account)
    for (const txn of Object.values(draft.transaction)) {
      for (const post of R.pipe(txn.postingsMap ?? {}, R.values, R.compact)) {
        const acct =
          post.accountId &&
          draft.account[post.accountId as unknown as ExternalId]
        post.accountName = acct?.name ?? post.accountName
        post.accountType = acct?.type ?? post.accountType
      }
    }
  })
}

export function transformTransactionLink(
  transform: (
    txn: WritableDraft<Standard.Transaction>,
  ) => Standard.Transaction | void,
) {
  return transformLink<EntityPayload>((op) => {
    if (
      op.type === 'data' &&
      op.data.entityName === 'transaction' &&
      op.data.entity != null
    ) {
      op.data.entity = produce(op.data.entity, transform)
    }
  })
}

// Remaining...
// - [ ] Add composeLinks to combine multiple links into one
// - [ ] Figure out why injecting account breaks stuff
// - [ ] Add test
// - [ ] Better handling of splitting date in beancount
// - [ ] Figure out whether links could be represented with Observable instead
export const addRemainderByDateLink = transformTransactionLink((txn) => {
  const postingsMap = setDefault(txn, 'postingsMap', {})
  const inPosts = R.pipe(
    postingsMap,
    R.values,
    R.compact,
    R.map((p) => ({...p, date: p.date ?? txn.date})),
  )
  const {balanceByDate} = computeTrialBalance(inPosts)
  for (const [date, am] of Object.entries(balanceByDate)) {
    // This is needed to support settlement dates...
    for (const amount of AM.toAmounts(AM.omitZeros(am))) {
      const sAmounts = A.splitNearEqually(amount, 1) // For now
      for (const [i, amt] of sAmounts.entries()) {
        const postKey = `remainder___${date}___${amount.unit}_${i}` as PostingId
        postingsMap[postKey] = {
          accountId: '_acct_transfer_in_transit' as AccountId,
          amount: A.invert(amt),
          date,
        }
      }
    }
  }
})

// Very verbose...
export function mergeTransferLink(): Link<EntityPayload> {
  const txnsByTransferId: Record<string, Standard.Transaction[]> = {}
  return handlersLink<EntityPayload>({
    data: (op) => {
      if (op.data.entityName === 'transaction' && op.data.entity?.transferId) {
        const txns = txnsByTransferId[op.data.entity.transferId] ?? []
        txns.push(op.data.entity)
        txnsByTransferId[op.data.entity.transferId] = txns
      }
    },
    commit: (op) =>
      rxjs.from([
        ..._makeMergedTransactions(txnsByTransferId).map(
          (txn): StdSyncOperation => ({
            type: 'data',
            data: {id: txn.id, entityName: 'transaction', entity: txn},
          }),
        ),
        op,
      ]),
  })
}

export function _makeMergedTransactions(
  txnsByTransferId: Record<string, Standard.Transaction[]>,
) {
  return objectEntries(txnsByTransferId).map(
    // TODO: Make SetRequired type work
    ([transferId, txns]): Standard.Transaction & {id: TransactionId} => {
      const postings = txns.flatMap((t, i) =>
        R.toPairs(t.postingsMap ?? {}).map(([key, post]) => ({
          ...post,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          accountId: post.accountId!,
          key: `${i}-${key}` as PostingId,
          custom: {...post.custom, transaction_id: t.id},
        })),
      )
      const balByAccount = postings.reduce<Record<string, AmountMap>>(
        (acc, p) => {
          acc[p.accountId] = AM.add(
            acc[p.accountId] ?? {},
            p.amount ? {[p.amount.unit]: p.amount.quantity} : {},
          )
          return acc
        },
        {},
      )

      // Not technically correct, but for heck for now.
      // We are ignoring impact of dates and not merging metadata for instance...
      const mergedId = `txn_${transferId}` as TransactionId
      return {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        ...txns[0]!,
        id: mergedId,
        postingsMap: R.pipe(
          postings,
          R.filter((p) => !AM.isZero(balByAccount[p.accountId] ?? {})),
          R.mapToObj(({key, ...p}) => [key, p]),
        ),
      }
    },
  )
}
