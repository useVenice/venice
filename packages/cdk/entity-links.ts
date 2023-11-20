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
  zFunction,
} from '@usevenice/util'
import {z} from '@usevenice/zod'

import {handlersLink, transformLink} from './base-links'
import type {Id} from './id.types'
import type {EntityMapper, IntegrationDef} from './integration.types'
import type {AnyEntityPayload, Link} from './protocol'
import type {
  EntityPayload,
  EntityPayloadWithRaw,
  StdSyncOperation,
} from './protocol'
import type {Pta} from './verticals/pta'

// TODO: Can we use the `parsedReso` type here?
export function mapStandardEntityLink({
  integration: {provider},
  settings: initialSettings,
  id: sourceId,
}: {
  integration: {provider: IntegrationDef}
  settings: unknown
  id: Id['reso'] | undefined
}): Link<AnyEntityPayload, EntityPayloadWithRaw> {
  return Rx.mergeMap((op) => {
    if (op.type !== 'data') {
      return rxjs.of(op)
    }
    // TODO: Extract this mapStandard into tis own function!
    const [vertical, entityName] = op.data.entityName.split('.')
    const mapper = provider.streams?.[vertical as 'accounting']?.[
      entityName as never
    ] as unknown as EntityMapper

    const id = op.data.id
    if (mapper) {
      const standard = mapper(op.data.entity as never, initialSettings)
      return rxjs.of({
        ...op,
        data: {
          entityName: op.data.entityName as 'account',
          entity: standard as any,
          id,
          raw: op.data.entity,
          providerName: provider.name,
          sourceId,
        } satisfies EntityPayloadWithRaw,
      })
    }

    return rxjs.of({
      ...op,
      data: {
        ...op.data,
        id,
        entity: undefined as any,
        entityName: `${provider.name}_${op.data.entityName}`,
        raw: op.data.entity as any,
        providerName: provider.name,
        sourceId,
      } satisfies EntityPayloadWithRaw,
    })

    // @deprecated
    // const entity = provider.standardMappers?.entity
    // if (!entity) {
    //   throw new Error('Expecting VeniceProvider in mapStandardEntityLink')
    // }
    // // TODO: Update the initialReso as we receive resource updates
    // const payload = R.pipe(entity, (map) =>
    //   typeof map === 'function'
    //     ? map(op.data, initialSettings)
    //     : map?.[op.data.entityName]?.(op.data, initialSettings),
    // )

    // if (!payload) {
    //   // console.error('[mapStandardEntityLink] Unable to map payload', op)
    //   return rxjs.EMPTY
    // }

    // return rxjs.of({
    //   ...op,
    //   data: {
    //     ...payload,
    //     id,
    //     external: op.data.entity,
    //     providerName: provider.name,
    //     externalId: op.data.id,
    //     sourceId,
    //   },
    // })
  })
}

// TODO: Move into entityLink
export interface StdCache {
  account: Record<string, Pta.Account>
  transaction: Record<string, Pta.Transaction>
  commodity: Record<string, Pta.Commodity>
  [k: string]: Record<string, unknown>
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
      const entityCache = cache[op.data.entityName] ?? {}
      if (!cache[op.data.entityName]) {
        cache[op.data.entityName] = entityCache
      }
      if (op.data.entity) {
        entityCache[op.data.id] = op.data.entity
      } else {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete entityCache[op.data.id]
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
  transformLink<EntityPayload<Pta.Account>>((op) => {
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
  transform: (txn: WritableDraft<Pta.Transaction>) => Pta.Transaction | void,
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
export function mergeTransferLink(): Link<EntityPayload<Pta.Transaction>> {
  const txnsByTransferId: Record<string, Pta.Transaction[]> = {}
  return handlersLink<EntityPayload<Pta.Transaction>>({
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
          (txn): StdSyncOperation<Pta.Transaction> => ({
            type: 'data',
            data: {id: txn.id, entityName: 'transaction', entity: txn},
          }),
        ),
        op,
      ]),
  })
}

export function _makeMergedTransactions(
  txnsByTransferId: Record<string, Pta.Transaction[]>,
) {
  return objectEntries(txnsByTransferId).map(
    // TODO: Make SetRequired type work
    ([transferId, txns]): Pta.Transaction & {id: TransactionId} => {
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
