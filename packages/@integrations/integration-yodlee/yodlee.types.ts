import {z} from '@ledger-sync/util'

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

// Models

export const zYodleeAmount = z.object({
  amount: z.number(),
  currency: z.string(),
})

export const zPrice = z.object({
  amount: z.number(),
  currency: z.string(),
})

export const zContainer = z.enum([
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

export const zCategoryType = z.enum([
  'TRANSFER',
  'DEFERRED_COMPENSATION',
  'UNCATEGORIZE',
  'INCOME',
  'EXPENSE',
])

export type YodleeTransaction = z.infer<typeof zYodleeTransaction>
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

export type YodleeAccount = z.infer<typeof zYodleeAccount> & {
  _id: Id.external
  _balancesMap?: Record<
    ISODate,
    {
      /** USD Balances. If holdings exist, this is the value of holdings */
      balances: YodleeBalances
      holdings: Yodlee.HoldingWithSecurity[]
    }
  >
}
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

export const zYodleeProvider = z
  .object({
    id: z.number(),
    name: z.string(),
    loginUrl: z.string(),
    baseUrl: z.string(),
    favicon: z.string(),
    /** Should be a url already */
    logo: z.string(),
    status: z.string(),
    isAutoRefreshEnabled: z.boolean(),
    authType: z.string(),
    lastModified: z.string(),
    languageISOCode: z.string(),
    primaryLanguageISOCode: z.string(),
    countryISOCode: z.string(),
  })
  .nullish()

export const zProviderAccount = z.object({
  aggregationSource: z.string(),
  createdDate: z.string(),
  dataset: z.array(z.any()), // TODO: Change it with Yodlee.Dataset
  id: z.number(),
  isManual: z.boolean(),
  providerId: z.number(),
  status: z.enum([
    'LOGIN_IN_PROGRESS',
    'USER_INPUT_REQUIRED',
    'IN_PROGRESS',
    'PARTIAL_SUCCESS',
    'SUCCESS',
    'FAILED',
  ]),
  isDeleted: z.boolean().nullish(),
})

export const zUser = z.object({
  id: z.number(),
  loginName: z.string(),
  roleType: z.string(),
  preferences: z.object({
    /** 'USD' */ currency: z.string(),
    /** 'PST' */ timeZone: z.string(),
    /** 'MM/dd/yyyy' */ dateFormat: z.string(),
  }),
  email: z.string(),
})

export const zAccessToken = z.object({
  accessToken: z.string(),
  issuedAt: z.string(),
  expiresIn: z.number(), // seconds
})

// Params

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
