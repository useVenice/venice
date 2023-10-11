import type {IntegrationDef, IntegrationSchemas} from '@usevenice/cdk-core'
import {intHelpers} from '@usevenice/cdk-core'
import {makePostingsMap} from '@usevenice/cdk-ledger'
import type {Standard} from '@usevenice/standard'
import type {EnumOf} from '@usevenice/util'
import {A, DateTime, z, zCast} from '@usevenice/util'

import {zConfig, zCreds} from './QBOClient'

export const qboSchemas = {
  name: z.literal('qbo'),
  integrationConfig: zConfig,
  resourceSettings: zCreds,
  sourceOutputEntity: z.discriminatedUnion('entityName', [
    z.object({
      id: z.string(),
      entityName: z.literal('account'),
      entity: zCast<QBO.Account>(),
    }),
    z.object({
      id: z.string(),
      entityName: z.literal('transaction'),
      entity: z.discriminatedUnion('type', [
        z
          .object({type: z.literal('Deposit'), entity: zCast<QBO.Deposit>()})
          .extend({realmId: z.string()}),
        z
          .object({type: z.literal('Purchase'), entity: zCast<QBO.Purchase>()})
          .extend({realmId: z.string()}),
        z
          .object({
            type: z.literal('JournalEntry'),
            entity: zCast<QBO.JournalEntry>(),
          })
          .extend({realmId: z.string()}),
        z
          .object({type: z.literal('Invoice'), entity: zCast<QBO.Invoice>()})
          .extend({realmId: z.string()}),
        z
          .object({type: z.literal('Payment'), entity: zCast<QBO.Payment>()})
          .extend({realmId: z.string()}),
      ]),
    }),
  ]),
} satisfies IntegrationSchemas

export const qboHelpers = intHelpers(qboSchemas)

export const qboDef = {
  name: 'qbo',
  def: qboSchemas,
  metadata: {
    displayName: 'Quickbooks Online',
    stage: 'beta',
    categories: ['accounting'],
    logoUrl: '/_assets/logo-qbo.svg',
    nangoProvider: 'quickbooks',
  },
  extension: {
    sourceMapEntity: {
      account: ({entity: a}) => ({
        id: a.Id,
        entityName: 'account',
        entity: {
          name: a.FullyQualifiedName.replaceAll(':', '/'),
          // QBO account balance should always be computed because we are guaranteed
          // the full data set and no need for balance syncing
          type: mapQboAccountType(a),
          removed: a.status === 'deleted',
          defaultUnit: (a.CurrencyRef.value ?? undefined) as Unit | undefined,
          informationalBalances: {
            current: A(a.CurrentBalance, a.CurrencyRef.value),
          },
        },
      }),
      transaction: ({entity: t}) => {
        switch (t.type) {
          case 'Purchase': {
            const sign = t.entity.Credit ? 1 : -1
            const postings: Standard.PostingsMap = {
              main: {
                accountExternalId: globalId(
                  t.realmId,
                  t.entity.AccountRef.value,
                ),
                amount: A(sign * t.entity.TotalAmt, t.entity.CurrencyRef.value),
              },
            }
            for (const l of t.entity.Line) {
              postings[l.Id] = {
                accountExternalId: globalId(
                  t.realmId,
                  l.AccountBasedExpenseLineDetail.AccountRef.value,
                ),
                amount: A(-1 * sign * l.Amount, t.entity.CurrencyRef.value),
                memo: l.Description,
              }
            }
            return {
              id: t.entity.Id,
              entityName: 'transaction',
              entity: {
                date: DateTime.fromISO(t.entity.TxnDate, {
                  zone: 'UTC',
                }).toISODate(),
                pending: false, // fix me?
                postingsMap: postings,
                payee:
                  // TODO: Figure out if '-- Vendor name pending --' is a Pilot specific thing
                  t.entity.EntityRef?.name !== '-- Vendor name pending --'
                    ? t.entity.EntityRef?.name
                    : undefined,
                description:
                  Object.values(postings).find((post) => post.memo)?.memo ??
                  t.entity.PrivateNote ??
                  '',
                notes: t.entity.PrivateNote,
                removed: t.entity.status === 'deleted',
              },
            }
          }
          case 'Deposit': {
            const postings: Standard.PostingsMap = {
              main: {
                accountExternalId: globalId(
                  t.realmId,
                  t.entity.DepositToAccountRef.value,
                ),
                amount: A(t.entity.TotalAmt, t.entity.CurrencyRef.value),
              },
            }
            for (const l of t.entity.Line) {
              postings[l.Id] = {
                accountExternalId: globalId(
                  t.realmId,
                  l.DepositLineDetail.AccountRef.value,
                ),
                amount: A(-1 * l.Amount, t.entity.CurrencyRef.value),
                memo: l.Description,
              }
            }
            return {
              id: t.entity.Id,
              entityName: 'transaction',
              entity: {
                date: DateTime.fromISO(t.entity.TxnDate, {
                  zone: 'UTC',
                }).toISODate(),
                pending: false, // fix me?
                postingsMap: postings,
                description:
                  Object.values(postings).find((post) => post.memo)?.memo ??
                  t.entity.PrivateNote ??
                  '',
                notes: t.entity.PrivateNote,
                removed: t.entity.status === 'deleted',
              },
            }
          }
          case 'JournalEntry': {
            const postings: Standard.PostingsMap = {}
            const filteredLines = t.entity.Line.filter(
              // https://c9.qbo.intuit.com/app/journal?txnId=842 For instance
              // has a line that looks like { "Id": "0", "DetailType": "DescriptionOnly" }
              (l) => l.DetailType !== 'DescriptionOnly',
            )
            for (const l of filteredLines) {
              postings[l.Id] = {
                accountExternalId: globalId(
                  t.realmId,
                  l.JournalEntryLineDetail.AccountRef.value,
                ),
                amount: A(
                  (l.JournalEntryLineDetail.PostingType === 'Credit' ? -1 : 1) *
                    l.Amount,
                  t.entity.CurrencyRef.value,
                ),
                memo: l.Description ?? '',
              }
            }

            return {
              id: t.entity.Id,
              entityName: 'transaction',
              entity: {
                date: DateTime.fromISO(t.entity.TxnDate, {
                  zone: 'UTC',
                }).toISODate(),
                pending: false, // fix me?
                postingsMap: postings,
                description:
                  (t.entity.DocNumber
                    ? `Journal Entry #${t.entity.DocNumber}`
                    : null) ??
                  Object.values(postings).find((post) => post.memo)?.memo ??
                  t.entity.PrivateNote ??
                  '',
                notes: t.entity.PrivateNote,
                removed: t.entity.status === 'deleted',
              },
            }
          }
          case 'Invoice': {
            const postings: Standard.PostingsMap = {
              main: {
                amount: A(t.entity.TotalAmt, t.entity.CurrencyRef.value),
                // https://quickbooks.intuit.com/learn-support/en-us/install/does-qbo-support-multiple-a-r-accounts-or-is-there-a-workaround/00/193034
                // QBO uses a default accounts receivable account. but it does not appear possible to know
                // exactly the id of the default account. therefore we wiill have to make do...
                // https://c9.qbo.intuit.com/app/invoice?txnId=3968 for instance
                accountType: 'asset/accounts_receivable',
                accountName: 'Accounts Receivable',
              },
            }
            for (const l of t.entity.Line) {
              const postId = l.Id ?? l.DetailType
              const memo = l.Description ?? ''
              if (l.SalesItemLineDetail) {
                postings[postId] = {
                  memo,
                  // Income is negative
                  amount: A(-1 * l.Amount, t.entity.CurrencyRef.value),
                  accountType: 'income',
                  accountName: 'Revenue',
                }
              } else if (l.DiscountLineDetail) {
                postings[postId] = {
                  memo,
                  // Discount is positive
                  amount: A(l.Amount, t.entity.CurrencyRef.value),
                  accountExternalId: globalId(
                    t.realmId,
                    l.DiscountLineDetail.DiscountAccountRef.value,
                  ),
                }
              }
            }

            return {
              id: t.entity.Id,
              entityName: 'transaction',
              entity: {
                date: DateTime.fromISO(t.entity.TxnDate, {
                  zone: 'UTC',
                }).toISODate(),
                pending: false, // fix me?
                postingsMap: postings,
                description:
                  Object.values(postings).find((post) => post.memo)?.memo ??
                  t.entity.PrivateNote ??
                  '',
                notes: t.entity.PrivateNote,
                removed: t.entity.status === 'deleted',
              },
            }
          }
          // TODO: Generate postings map rather than entire transaction to reduce duplication
          case 'Payment': {
            // https://c9.qbo.intuit.com/app/recvpayment?txnId=3992 for instance
            const postings = makePostingsMap({
              main: {
                amount: A(t.entity.TotalAmt, t.entity.CurrencyRef.value),
                // https://quickbooks.intuit.com/learn-support/en-us/install/does-qbo-support-multiple-a-r-accounts-or-is-there-a-workaround/00/193034
                // QBO uses a default accounts receivable account. but it does not appear possible to know
                // exactly the id of the default account. therefore we wiill have to make do...
                // https://c9.qbo.intuit.com/app/invoice?txnId=3968 for instance
                accountExternalId: globalId(
                  t.realmId,
                  t.entity.DepositToAccountRef.value,
                ),
              },
              remainder: {
                accountType: 'asset/accounts_receivable',
                accountName: 'Accounts Receivable',
              },
            })
            return {
              id: t.entity.Id,
              entityName: 'transaction',
              entity: {
                date: DateTime.fromISO(t.entity.TxnDate, {
                  zone: 'UTC',
                }).toISODate(),
                pending: false, // fix me?
                postingsMap: postings,
                description:
                  Object.values(postings).find((post) => post.memo)?.memo ??
                  t.entity.PrivateNote ??
                  '',
                notes: t.entity.PrivateNote,
                removed: t.entity.status === 'deleted',
              },
            }
          }
          default:
            // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
            throw new Error(`[qbo] Unhandled txn type: ${(t as any).type}`)
        }
      },
    },
  },
} satisfies IntegrationDef<typeof qboSchemas>

export const TRANSACTION_TYPE_NAME: EnumOf<QBO.TransactionTypeName> = {
  Purchase: 'Purchase',
  Deposit: 'Deposit',
  JournalEntry: 'JournalEntry',
  Invoice: 'Invoice',
  Payment: 'Payment',
}

const QBO_CLASSFICATION_TO_ACCOUNT_TYPE: Record<
  QBO.Account['Classification'],
  Standard.AccountType
> = {
  Asset: 'asset',
  Equity: 'equity',
  Liability: 'liability',
  Revenue: 'income',
  Expense: 'expense',
}

function mapQboAccountType(a: QBO.Account) {
  // TODO: Take into account a.AccountType and a.AccountSubtype
  return QBO_CLASSFICATION_TO_ACCOUNT_TYPE[a.Classification]
}
/** Prefix id with realmId to get id global within QBO provider */
function globalId(realmId: string, entityId: string) {
  return `${realmId}_${entityId}` as ExternalId
}

export default qboDef
