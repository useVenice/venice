import {A, z} from '@alka/util'

const zYodleeAmount = z.object({
  amount: z.number(),
  currency: z.string(),
})
export function getYodleeAccountName(account: YodleeAccount) {
  const name = account.nickname || account.accountName || account.displayedName
  const lastFour = account.accountNumber?.slice(-4) ?? null

  // const subtype = startCase(account.accountType)
  // return `${subtype}/${name}`
  // This is now handled in the view layer.
  // return `${provider.name}: ${name}`

  // https://cl.ly/61a480734dd7 Name can be undefined? We added `provider.name`
  // since so might be ok
  return `${account.providerName}: ${[name, lastFour]
    .filter(Boolean)
    .join(' - ')}`
}

const zPrice = z.object({
  amount: z.number(),
  currency: z.string(),
})
const zContainer = z.enum([
  'bank',
  'creditCard',
  'investment',
  'insurance',
  'loan',
  'otherAssets',
  'otherLiabilities',
  'realEstate',
  'reward',
  'bill',
  /** Not sure if these actually get returned separately or part of investment */
  'investment (SN 1.0)',
  'investment (SN 2.0)',
])

const zCategoryType = z.enum([
  'TRANSFER',
  'DEFERRED_COMPENSATION',
  'UNCATEGORIZE',
  'INCOME',
  'EXPENSE',
])
export const zYodleeTransaction = z.object({
  accountId: z.number(),
  amount: zYodleeAmount,
  baseType: z.enum(['DEBIT', 'CREDIT']),
  type: z.enum(['BUY', 'SELL']).nullish(),
  category: z.string(),
  categoryId: z.number(),
  categorySource: z.enum(['SYSTEM', 'USER']),
  categoryType: zCategoryType,
  CONTAINER: zContainer,
  createdDate: z.string(),
  date: z.string(),
  description: z.object({
    original: z.string(),
    consumer: z.string(),
    simple: z.string(),
  }),
  id: z.number(),
  isManual: z.boolean(),
  highLevelCategoryId: z.number(),
  lastUpdated: z.string(),
  merchant: z
    .object({
      categoryLabel: z.string().array(),
      id: z.number(),
      name: z.string(),
    })
    .nullish(),
  postDate: z.string(),
  quantity: z.number().nullish(),
  sourceType: z.enum(['YODLEE', 'FACTUAL']),
  price: zPrice,
  status: z.enum(['POSTED', 'PENDING', 'SCHEDULED', 'FAILED']),
  symbol: z.string().nullish(),
  transactionDate: z.string(),
  isDeleted: z.boolean(),
})
export const zYodleeAccount = z.object({
  accountName: z.string(),
  accountNumber: z.string().nullish(),
  accountType: z.string(),
  accountStatus: z.enum(['ACTIVE', 'INACTIVE', 'TO_BE_CLOSED', 'CLOSED']),
  aggregationSource: z.enum(['SYSTEM', 'USER']),
  amountDue: zYodleeAmount,
  annuityBalance: zYodleeAmount,
  availableBalance: zYodleeAmount,
  availableCash: zYodleeAmount,
  availableCredit: zYodleeAmount,
  balance: zYodleeAmount,
  cash: zYodleeAmount,
  classification: z.enum([
    'CORPORATE',
    'OTHER',
    'PERSONAL',
    'SMALL_BUSINESS',
    'TRUST',
    'VIRTUAL_CARD',
    'ADD_ON_CARD',
  ]),
  createdDate: z.string(),

  CONTAINER: zContainer,
  currentBalance: zYodleeAmount.nullish(),
  dueDate: z.string(),
  displayedName: z.string(),
  expirationDate: z.string(),
  id: z.number(),
  includeInNetWorth: z.boolean(),
  isAsset: z.boolean(),
  isManual: z.boolean(),
  interestRate: z.number(),
  lastPayment: zYodleeAmount,
  lastPaymentAmount: zYodleeAmount,
  lastPaymentDate: z.string(),
  lastUpdated: z.string(),
  memo: z.string().nullish(),
  minimumAmountDue: zYodleeAmount,
  nickname: z.string().nullish(),
  providerAccountId: z.number(),
  providerId: z.string(),
  providerName: z.string(),
  remainingBalance: zYodleeAmount,
  totalCashLimit: zYodleeAmount,
  totalCreditLine: zYodleeAmount,
  userClassification: z.enum(['PERSONAL', 'BUSINESS']),
  isDeleted: z.boolean().nullish(),
})

export function getYodleeAccountType(
  acct: YodleeAccount,
): Standard.AccountType {
  // switch (acct.CONTAINER) {
  //   case 'creditCard':
  //     return 'credit_card'
  //   case 'otherAssets':
  //   case 'otherLiabilities':
  //     return startCase(
  //       acct.accountType.toLowerCase(),
  //     ) as Standard.LegacyAccountSubtype
  //   // Is there a better way to explicity try to fall through again?
  //   // @ts-ignore
  //   case 'bank': {
  //     switch (acct.accountType) {
  //       case 'CHECKING':
  //         return 'checking'
  //       case 'SAVINGS':
  //         return 'savings'
  //     }
  //   }
  //   default:
  //     return [acct.CONTAINER, acct.accountType]
  //       .filter((t) => t)
  //       .map((t) => startCase(t.toLowerCase()))
  //       .join('/') as Standard.LegacyAccountSubtype
  // }
  switch (acct.CONTAINER) {
    case 'bank':
      return 'asset/bank'
    case 'investment':
    // Not sure if these actually get returned separately or part of investment
    case 'investment (SN 1.0)':
    case 'investment (SN 2.0)':
      return 'asset/brokerage' // Is this right?
    case 'insurance':
    case 'realEstate':
      return 'asset/real_estate'
    case 'reward':
      return 'asset/rewards'
    case 'otherAssets':
      return 'asset'
    case 'creditCard':
      return 'liability/credit_card'
    case 'loan':
      return 'liability/personal_loan'
    case 'bill':
    case 'otherLiabilities':
      return 'liability'
    default:
      return 'asset'
  }
}

export type YodleeAccount = z.infer<typeof zYodleeAccount> & {
  _balancesMap?: Record<
    ISODate,
    {
      /** USD Balances. If holdings exist, this is the value of holdings */
      balances: YodleeBalances
      holdings: Yodlee.HoldingWithSecurity[]
    }
  >
}
export type YodleeTransaction = z.infer<typeof zYodleeTransaction>
export type YodleeBalances = Partial<
  Pick<
    YodleeAccount,
    | 'cash'
    | 'balance'
    | 'balance'
    | 'remainingBalance'
    | 'currentBalance'
    | 'annuityBalance'
    | 'availableBalance'
    | 'availableCredit'
    | 'availableCash'
  >
>
export function getYodleeAccountBalance(
  acct: Pick<YodleeAccount, 'accountType' | 'CONTAINER'> & YodleeBalances,
  type: keyof YodleeBalances,
) {
  const sign =
    acct.accountType === 'CREDIT' ||
    acct.accountType === 'MORTGAGE' ||
    acct.CONTAINER === 'creditCard' ||
    acct.CONTAINER === 'loan' ||
    acct.CONTAINER === 'otherLiabilities' || // Presumably??
    acct.CONTAINER === 'bill' // Presumably??
      ? -1
      : 1
  const amt = acct[type]
  return amt == null ? null : A(amt.amount * sign, amt.currency)
}

export const zGetTransactionParams = z.object({
  /** bank/creditCard/investment/insurance/loan	query	String */
  container: zContainer.nullish(),
  /** DEBIT/CREDIT	query	String */
  baseType: z.string().nullish(),
  /** Transaction search text	query	String */
  keyword: z.string().nullish(),
  /** Comma separated accountIds	query	String */
  accountId: z.string(),
  /** Transaction from date(YYYY-MM-DD)	query	String */
  fromDate: z.string().nullish(),
  /** Transaction end date (YYYY-MM-DD)	query	String */
  toDate: z.string().nullish(),
  /** Comma separated categoryIds	query	String */
  categoryId: z.string().nullish(),
  /** Comma separated highLevelCategoryIds	query	String */
  highLevelCategoryId: z.string().nullish(),
  /** Transaction Type(Supported containers: bank/card/investment)	query	String */
  type: z.string().nullish(),
  /** Transaction Category Type(UNCATEGORIZE, INCOME, TRANSFER, EXPENSE or DEFERRED_COMPENSATION)	query	String */
  categoryType: zCategoryType.nullish(),
  /** UNRECONCILED(Default value),RECONCILED	query	String */
  accountReconType: z.string().nullish(),
  /** skip (Min 0)	query	Integer */
  skip: z.number().nullish(),
  /** top (Max 500)	query	Integer */
  top: z.number().nullish(),
  /** Comma separated detailCategoryIds	query	String */
  detailCategoryId: z.string().nullish(),
})


export type YodleeGetTransactionParams = z.infer<typeof zGetTransactionParams>