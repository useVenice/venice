import type {zUser} from './splitwise-schema'
import {zCurrentUser, zExpense, zGroup} from './splitwise-schema'
import {makeSplitwiseClient} from './SplitwiseClientNext'
import {makeSyncProvider} from '@ledger-sync/cdk-core'
import {ledgerSyncProviderBase, makePostingsMap} from '@ledger-sync/cdk-ledger'
import {
  A,
  DateTime,
  legacy_formatAmount,
  math,
  objectFromArray,
  parseMoney,
  Rx,
  rxjs,
  z,
} from '@ledger-sync/util'

const def = makeSyncProvider.def({
  ...ledgerSyncProviderBase.def,
  name: z.literal('splitwise'),
  connectionSettings: z.object({
    currentUser: zCurrentUser.nullish(),
    accessToken: z.string(),
  }),

  sourceOutputEntity: z.discriminatedUnion('entityName', [
    z.object({
      id: z.string(),
      entityName: z.literal('account'),
      entity: zGroup,
    }),
    z.object({
      id: z.string(),
      entityName: z.literal('transaction'),
      entity: zExpense.extend({group_name: z.string()}),
    }),
  ]),
})

export const splitwiseProvider = makeSyncProvider({
  ...ledgerSyncProviderBase(def, {
    sourceMapEntity: {
      account: ({entity: a}) => ({
        id: `${a.id}`,
        entityName: 'account',
        entity: {
          name: `Groups/${a.name}`,
          // balance: getSplitwiseAccountBalance(a, 'current'), // how to get this?
          // No longer true
          type: 'asset',
        },
      }),
      transaction: ({entity: t}) => {
        const cost = A(parseMoney(t.cost), t.currency_code)
        const partialTxn: Pick<
          Standard.Transaction,
          'date' | 'removed' | 'notes' | 'payee'
        > = {
          notes: t.details,
          date: DateTime.fromISO(t.date).toISODate(),
          removed: t.deleted_at != null,
          payee: t.group_name,
        }

        if (t.payment) {
          const from = t.users.find(
            (u) => u.user.id === t.repayments[0]?.from,
          )?.user
          const to = t.users.find(
            (u) => u.user.id === t.repayments[0]?.to,
          )?.user
          return {
            id: `${t.id}`,
            entityName: 'transaction',
            entity: {
              ...partialTxn,
              description: `${formatUser(from)} paid ${formatUser(
                to,
              )} ${legacy_formatAmount(cost)}`,
              postingsMap: makePostingsMap(
                {},
                {
                  from: {
                    accountType: 'equity/clearing',
                    // TODO: Figure out whether we should be using account name here
                    // at all...
                    accountName: `${formatUser(from)}/Transfers`,
                    amount: A.invert(cost),
                  },
                  to: {
                    accountType: 'equity/clearing',
                    accountName: `${formatUser(to)}/Transfers`,
                    amount: cost,
                  },
                },
              ),
            },
          }
        }

        const contribs = t.users
          .filter((u) => math.isNonZero(parseMoney(u.paid_share)))
          .map((u) => ({
            user: u.user,
            posting: {
              accountType:
                parseMoney(u.paid_share) < 0
                  ? ('expense' as const)
                  : ('income' as const),
              accountName: `Uncategorized-${
                parseMoney(u.paid_share) < 0 ? 'Expense' : 'Income'
              }`,
              // accountName: `${formatUser(u.user)}/Contributions`,
              amount: A(-1 * parseMoney(u.paid_share), cost.unit),
            },
            remainder: {
              accountName: t.group_name,
              accountType: 'liability',
              amount: A(parseMoney(u.paid_share), cost.unit),
            },
          }))
        return {
          id: `${t.id}`,
          entityName: 'transaction',
          entity: {
            ...partialTxn,
            description: t.description,
            externalCategory: t.category.name,
            postingsMap: makePostingsMap(
              {
                main: contribs.length === 1 ? contribs[0]?.posting : undefined,
              },
              contribs.length > 1
                ? objectFromArray(
                    contribs,
                    (c) => `contrib_${c.user.id}`,
                    (c) => c.posting,
                  )
                : {
                    // This is  for "Liabilities" in beancount, cannot set it as remainder because we Omit "amount"
                    liabilities:
                      contribs.length === 1
                        ? (contribs[0]?.remainder as Standard.Posting)
                        : undefined,
                  },
            ),
          },
        }
      },
    },
  }),

  sourceSync: ({settings: {accessToken}}) => {
    const splitwise = makeSplitwiseClient({accessToken})

    async function* iterateEntities() {
      const groups = await splitwise.getGroups()

      yield groups.map((a) => def._opData('account', `${a.id}`, a))

      let offset = 0
      let limit = 100

      while (true) {
        const expenses = await splitwise.getExpenses({offset, limit})
        if (expenses.length === 0) {
          break
        }
        yield expenses.map((t) => {
          // For now it's easiest to get the group name
          // TODO: Need to check for the better way to get the group name
          const group_name =
            groups.filter((a) =>
              a.name
                .toLowerCase()
                .includes(formatUser(t.users[0]?.user).toLowerCase()),
            )[0]?.name || formatUser(t.users[0]?.user)
          return def._opData('transaction', `${t.id}`, {
            ...t,
            group_name,
          })
        })
        offset += expenses.length
        limit = 500
      }
    }

    return rxjs
      .from(iterateEntities())
      .pipe(Rx.mergeMap((ops) => rxjs.from([...ops, def._op('commit')])))
  },
})

// Helpers
function formatUser(user?: z.infer<typeof zUser>) {
  return user
    ? `${user.first_name ?? ''} ${user.last_name ?? ''}`.trim()
    : 'Unnamed user'
}
