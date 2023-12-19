import type {components} from '@opensdks/sdk-qbo/qbo.oas.types'
import type {ConnectorDef, ConnectorSchemas, Pta} from '@usevenice/cdk'
import {
  connHelpers,
  makePostingsMap,
  oauthBaseSchema,
  zEntityPayload,
} from '@usevenice/cdk'
import type {EnumOf} from '@usevenice/util'
import {A, DateTime, R, z, zCast} from '@usevenice/util'

export type QBO = components['schemas']

export type TransactionTypeName = Extract<
  QBO['EntityName'],
  'Purchase' | 'Deposit' | 'JournalEntry' | 'Invoice' | 'Payment'
>

export const TRANSACTION_TYPE_NAME: EnumOf<TransactionTypeName> = {
  Purchase: 'Purchase',
  Deposit: 'Deposit',
  JournalEntry: 'JournalEntry',
  Invoice: 'Invoice',
  Payment: 'Payment',
}

export const QBO_ENTITY_NAME: EnumOf<QBO['EntityName']> = {
  ...TRANSACTION_TYPE_NAME,
  Account: 'Account',
  Bill: 'Bill',
  BillPayment: 'BillPayment',
  CreditMemo: 'CreditMemo',
  Transfer: 'Transfer',
  Vendor: 'Vendor',
  Customer: 'Customer',
  Item: 'Item',
  CompanyInfo: 'CompanyInfo',
}

export const zConfig = oauthBaseSchema.connectorConfig.extend({
  envName: z.enum(['sandbox', 'production']),
  url: z.string().nullish().describe('For proxies, not typically needed'),
  verifierToken: z.string().nullish().describe('For webhooks'),
})

const oReso = oauthBaseSchema.resourceSettings
/** Very verbose definition... Do we want it a bit simpler maybe? */
export const zSettings = oReso.extend({
  oauth: oReso.shape.oauth.extend({
    connection_config: z.object({
      realmId: z.string(),
    }),
    credentials: oReso.shape.oauth.shape.credentials.extend({
      raw: oReso.shape.oauth.shape.credentials.shape.raw.extend({
        refresh_token: z.string(),
      }),
    }),
  }),
})

export const qboSchemas = {
  name: z.literal('qbo'),
  connectorConfig: zConfig,
  resourceSettings: zSettings,
  connectOutput: oauthBaseSchema.connectOutput,
  sourceOutputEntity: zEntityPayload,
  sourceOutputEntities: R.mapValues(QBO_ENTITY_NAME, () => z.unknown()),

  verticals: {
    accounting: {
      account: zCast<QBO['Account']>(),
      expense: zCast<QBO['Purchase']>(),
      vendor: zCast<QBO['Vendor']>(),
    },
    pta: {
      account: zCast<QBO['Account']>(),
      transaction: z.discriminatedUnion('type', [
        z
          .object({type: z.literal('Deposit'), entity: zCast<QBO['Deposit']>()})
          .extend({realmId: z.string()}),
        z
          .object({
            type: z.literal('Purchase'),
            entity: zCast<QBO['Purchase']>(),
          })
          .extend({realmId: z.string()}),
        z
          .object({
            type: z.literal('JournalEntry'),
            entity: zCast<QBO['JournalEntry']>(),
          })
          .extend({realmId: z.string()}),
        z
          .object({type: z.literal('Invoice'), entity: zCast<QBO['Invoice']>()})
          .extend({realmId: z.string()}),
        z
          .object({type: z.literal('Payment'), entity: zCast<QBO['Payment']>()})
          .extend({realmId: z.string()}),
      ]),
    },
  },
} satisfies ConnectorSchemas

export const qboHelpers = connHelpers(qboSchemas)

export const qboDef = {
  name: 'qbo',
  schemas: qboSchemas,
  metadata: {
    displayName: 'Quickbooks Online',
    stage: 'beta',
    categories: ['accounting'],
    logoUrl: '/_assets/logo-qbo.svg',
    nangoProvider: 'quickbooks',
  },
  streams: {
    $defaults: {
      primaryKey: 'Id',
      cursorField: 'Metadata.LastUpdatedTime',
    },
    accounting: {
      account: (a) => ({
        name: a.Name,
        type: a.AccountType as 'asset',
        id: a.Id,
      }),
      expense: (e) => ({
        id: e.Id,
        amount: e.TotalAmt,
        currency: e.CurrencyRef.value,
        payment_account: e.AccountRef.value,
      }),
      vendor: (v) => ({id: v.Id, name: v.DisplayName, url: ''}),
    },
    pta: {
      account: (a) => ({
        name: a.FullyQualifiedName.replaceAll(':', '/'),
        // QBO account balance should always be computed because we are guaranteed
        // the full data set and no need for balance syncing
        type: mapQboAccountType(a),
        removed: a.status === 'deleted',
        defaultUnit: (a.CurrencyRef.value ?? undefined) as Unit | undefined,
        informationalBalances: {
          current: A(a.CurrentBalance, a.CurrencyRef.value),
        },
      }),

      transaction: (t) => {
        switch (t.type) {
          case 'Purchase': {
            const sign = t.entity.Credit ? 1 : -1
            const postings: Pta.PostingsMap = {
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
                // TODO: Handle non-accountBasedExpenseLineDetail
                accountExternalId:
                  l.AccountBasedExpenseLineDetail &&
                  globalId(
                    t.realmId,
                    l.AccountBasedExpenseLineDetail.AccountRef.value,
                  ),
                amount: A(-1 * sign * l.Amount, t.entity.CurrencyRef.value),
                memo: l.Description,
              }
            }
            return {
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
            }
          }
          case 'Deposit': {
            const postings: Pta.PostingsMap = {
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
                // Handle https://gist.github.com/tonyxiao/a9873b41c2df76f4f66c226933134a82
                accountExternalId:
                  l.DepositLineDetail?.AccountRef &&
                  globalId(t.realmId, l.DepositLineDetail.AccountRef.value),
                amount: A(-1 * l.Amount, t.entity.CurrencyRef.value),
                memo: l.Description,
              }
            }
            return {
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
            }
          }
          case 'JournalEntry': {
            const postings: Pta.PostingsMap = {}
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
            }
          }
          case 'Invoice': {
            const postings: Pta.PostingsMap = {
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
                accountExternalId:
                  t.entity.DepositToAccountRef &&
                  globalId(t.realmId, t.entity.DepositToAccountRef.value),
              },
              remainder: {
                accountType: 'asset/accounts_receivable',
                accountName: 'Accounts Receivable',
              },
            })
            return {
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
            }
          }
          default:
            // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
            throw new Error(`[qbo] Unhandled txn type: ${(t as any).type}`)
        }
      },
    },
  },
} satisfies ConnectorDef<typeof qboSchemas>

const QBO_CLASSFICATION_TO_ACCOUNT_TYPE: Record<
  QBO['Account']['Classification'],
  Pta.AccountType
> = {
  Asset: 'asset',
  Equity: 'equity',
  Liability: 'liability',
  Revenue: 'income',
  Expense: 'expense',
}

function mapQboAccountType(a: QBO['Account']) {
  // TODO: Take into account a.AccountType and a.AccountSubtype
  return QBO_CLASSFICATION_TO_ACCOUNT_TYPE[a.Classification]
}
/** Prefix id with realmId to get id global within QBO provider */
function globalId(realmId: string, entityId: string) {
  return `${realmId}_${entityId}` as ExternalId
}

export default qboDef
