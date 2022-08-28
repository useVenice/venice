import {computeTrialBalance} from '@ledger-sync/accounting'
import {
  AnyEntityPayload,
  AnySyncProvider,
  handlersLink,
  Link,
  transformLink,
} from '@ledger-sync/cdk-core'
import {
  A,
  AM,
  identity,
  objectEntries,
  produce,
  R,
  Rx,
  rxjs,
  setDefault,
  WritableDraft,
  z,
  zFunction,
} from '@ledger-sync/util'
import {
  EntityPayload,
  EntityPayloadWithExternal,
  StdSyncOperation,
} from './entity-link-types'
import {isLedgerSyncProvider} from './ledgerSyncProviderBase'
import {makeStandardId, zStandardEntityPrefixFromName} from './utils'

export const mapStandardEntityLink = ({
  provider,
  settings: initialSettings,
  id: sourceId,
}: {
  provider: AnySyncProvider
  settings: any
  id: string
}): Link<AnyEntityPayload, EntityPayloadWithExternal> => {
  if (!isLedgerSyncProvider(provider)) {
    throw new Error('Expecting LedgerSyncProvider in mapStandardEntityLink')
  }
  return Rx.mergeMap((op) => {
    if (op.type !== 'data') {
      return rxjs.of(op)
    }
    // TODO: Fold in the `prefixId` link
    // TODO: Update the initialConn as we receive connection updates

    const payload = R.pipe(provider.extension.sourceMapEntity, (map) =>
      typeof map === 'function'
        ? map?.(op.data, initialSettings)
        : map?.[op.data.entityName]?.(op.data, initialSettings),
    )

    if (!payload) {
      // console.error('[mapStandardEntityLink] Unable to map payload', op)
      return rxjs.EMPTY
    }

    const id = makeStandardId(
      zStandardEntityPrefixFromName.parse(payload.entityName),
      provider.name,
      payload.id,
    )
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
export const cachingLink = (
  onCommit: (c: StdCache) => rxjs.Observable<StdSyncOperation>,
) => {
  const cache: StdCache = {account: {}, transaction: {}, commodity: {}}
  let numChanges = 0
  return handlersLink({
    data: (op) => {
      if (op.data.entity) {
        cache[op.data.entityName][op.data.id] = op.data.entity
      } else {
        delete cache[op.data.entityName][op.data.id]
      }
      numChanges++
    },
    commit: () => {
      if (numChanges === 0) {
        return
      }
      console.log(`[makeCachingLink] commit`, {numChanges})
      numChanges = 0
      return onCommit(cache)
    },
  })
}

export const cachingTransformLink = (
  transform: (c: WritableDraft<StdCache>) => StdCache | void,
) =>
  cachingLink((cache) =>
    rxjs.from([
      ..._opsFromCache(produce(cache, transform)),
      identity<StdSyncOperation>({type: 'commit'}),
    ]),
  )

// TODO: Move this entire file into @ledger-sync/cdk-ledger package

/**
 * Used to workaround beancount limitation https://groups.google.com/g/beancount/c/PmkPVgLNKgg
 * Not ideal that we have to use LedgerSync link to workaround
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
export const mapAccountNameAndTypeLink = () =>
  cachingTransformLink((draft) => {
    // console.debug('[mapAccountNameAndTypeLink]', draft.account)
    for (const txn of Object.values(draft.transaction)) {
      for (const post of R.pipe(txn.postingsMap ?? {}, R.values, R.compact)) {
        const acct =
          post.accountId &&
          draft.account[post.accountId as unknown as Id.external]
        post.accountName = acct?.name ?? post.accountName
        post.accountType = acct?.type ?? post.accountType
      }
    }
  })

export const transformTransactionLink = (
  transform: (
    txn: WritableDraft<Standard.Transaction>,
  ) => Standard.Transaction | void,
) =>
  transformLink<EntityPayload>((op) => {
    if (
      op.type === 'data' &&
      op.data.entityName === 'transaction' &&
      op.data.entity != null
    ) {
      op.data.entity = produce(op.data.entity, transform)
    }
  })

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
        const postKey = `remainder___${date}___${amount.unit}_${i}` as Id.post
        postingsMap[postKey] = {
          accountId: '_acct_transfer_in_transit' as Id.acct,
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
    ([transferId, txns]): Standard.Transaction & {id: Id.txn} => {
      const postings = txns.flatMap((t, i) =>
        R.toPairs(t.postingsMap ?? {}).map(([key, post]) => ({
          ...post,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          accountId: post.accountId!,
          key: `${i}-${key}` as Id.post,
          custom: {...post.custom, transaction_id: t.id},
        })),
      )
      const balByAccount = postings.reduce((acc, p) => {
        acc[p.accountId] = AM.add(
          acc[p.accountId] ?? {},
          p.amount ? {[p.amount.unit]: p.amount.quantity} : {},
        )
        return acc
      }, {} as Record<string, AmountMap>)

      // Not technically correct, but for heck for now.
      // We are ignoring impact of dates and not merging metadata for instance...
      const mergedId = `txn_${transferId}` as Id.txn
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
