declare namespace Plaid {
  export type Country = import('plaid-link').Plaid.Country
  export type EnvName = 'sandbox' | 'development' | 'production'
  export type ItemResponse = import('plaid').ItemResponse & {
    item: import('plaid').ItemResponse['item'] & {
      error?: ErrorShape
    }
  }
  export type Item = import('plaid').Item
  export type Account = import('@ledger-sync/util').OneOfTwo<
    import('plaid').Account,
    LinkMetadataAccount
  >
  export type Institution = import('plaid').InstitutionWithInstitutionData
  export type Security = import('plaid').Security
  export type Holding = import('plaid').Holding
  export type NonInvestmentTransaction = import('plaid').Transaction
  export type NonInvestmentTransactionsResponse =
    import('plaid').TransactionsResponse
  export type InvestmentTransaction = import('plaid').InvestmentTransaction & {
    subtype: InvestmentTransactionSubtype | null
  }
  export type InvestmentTransactionsResponse =
    import('plaid').InvestmentTransactionsResponse
  export type Transaction = NonInvestmentTransaction | InvestmentTransaction
  export type TransactionsResponse = import('@ledger-sync/util').OneOfTwo<
    InvestmentTransactionsResponse,
    NonInvestmentTransactionsResponse
  >

  /** https://plaid.com/docs/link/web/#link-web-onsuccess-metadata */
  export interface LinkMetadata {
    link_session_id: string
    institution: {
      name: string
      institution_id: string
    }
    accounts: LinkMetadataAccount[]
  }

  /** https://plaid.com/docs/link/web/#link-web-onsuccess-accounts_metadata */
  export interface LinkMetadataAccount {
    id: string
    name: string
    mask: string | null
    type: string | null
    subtype: string | null
    verification_status:
      | 'pending_automatic_verification'
      | 'pending_manual_verification'
      | 'automatically_verified'
      | 'manually_verified'
      | 'verification_expired'
      | 'verification_failed'
      | null
  }

  /**
   * https://plaid.com/docs/#investment-security-types
   * TODO: Use this everywhere
   */
  export type SecurityType =
    | 'cash' //	Cash & Cash Equivalent: Cash, currency, and money market funds.
    | 'derivative' //	Derivatives: Options, warrants, and other derivative instruments.
    | 'equity' //	Equities: Domestic and foreign equities.
    | 'etf' //	Exchange-Traded Funds: Multi-asset investment funds traded on exchanges.
    | 'fixed income' // 	Fixed Income: Bonds and CDs.
    | 'loan' //	Loans: Loans and loan receivables.
    | 'mutual fund' // 	Mutual Funds: Open- and closed-end vehicles pooling funds of multiple investors.
    | 'balance_sheet/equity' //	Other/Alternative: Any unknown or unclassified investment vehicle.

  /**
   * https://plaid.com/docs/#investment-transaction-types
   * TODO: Use this in actual response
   */
  export type InvestmentTransactionType =
    | 'buy' // Activity that increases the quantity of a holding.
    | 'cancel' // Transaction cancels a previous transaction.
    | 'cash' // Activity which modifies the cash position.
    | 'fee' // Fees on the account, e.g. commission, bookkeeping, options-related.
    | 'sell' // Activity that decreases the quantity of a holding.
    | 'transfer' // Activity which modifies a position, not through buy/sell activity e.g. options exercise, portfolio transfer

  /**
   * https://plaid.com/docs/#investment-transaction-subtypes
   * TODO: Use this in actual responses
   */
  export type InvestmentTransactionSubtype =
    | 'account fee' // Fees paid for account maintenance.
    | 'assignment' // Assignment of short option holding.
    | 'buy' // Purchase to open or increase a position.
    | 'buy to cover' // Purchase to close a short position.
    | 'contribution' // Inflow of assets into a tax-advantaged account.
    | 'deposit' // Inflow of cash into an account.
    | 'distribution' // Outflow of assets from a tax-advantaged account.
    | 'dividend' // Inflow of cash from a dividend.
    | 'dividend reinvestment' // Purchase using proceeds from a cash dividend.
    | 'exercise' // Exercise of an option or warrant contract.
    | 'expire' // Expiration of an option or warrant contract.
    | 'fund fee' // Fees paid for administration of a mutual fund or other pooled investment vehicle.
    | 'interest' // Inflow of cash from interest.
    | 'interest receivable' // Inflow of cash from interest receivable.
    | 'interest reinvestment' // Purchase using proceeds from a cash interest payment.
    | 'legal fee' // Fees paid for legal charges or services.
    | 'loan payment' // Inflow of cash related to payment on a loan.
    | 'long-term capital gain' // Long-term capital gain received as cash.
    | 'long-term capital gain reinvestment' // Purchase using long-term capital gain cash proceeds.
    | 'management fee' // Fees paid for investment management of a mutual fund or other pooled investment vehicle.
    | 'margin expense' // Fees paid for maintaining margin debt.
    | 'merger' // Stock exchanged at a pre-defined ratio as part of a merger between companies.
    | 'miscellaneous fee' // Fees associated with various account or holding actions.
    | 'non-qualified dividend' // Inflow of cash from a non-qualified dividend.
    | 'non-resident tax' // Taxes paid on behalf of the investor for non-residency in investment jurisdiction.
    | 'pending credit' // Pending inflow of cash.
    | 'pending debit' // Pending outflow of cash.
    | 'qualified dividend' // Inflow of cash from a qualified dividend.
    | 'rebalance' // Rebalancing transaction (buy or sell) with no net impact to value in the account.
    | 'return of principal' // Repayment of loan principal.
    | 'sell' // Sell to close or decrease an existing holding.
    | 'sell short' // Sell to open a short position.
    | 'short-term capital gain' // Short-term capital gain received as cash.
    | 'short-term capital gain reinvestment' // Purchase using short-term capital gain cash proceeds.
    | 'spin off' // Inflow of stock from spin-off transaction of an existing holding.
    | 'split' // Inflow of stock from a forward split of an existing holding.
    | 'stock distribution' // Inflow of stock from a distribution.
    | 'tax' // Taxes paid on behalf of the investor.
    | 'tax withheld' // Taxes withheld on behalf of the customer.
    | 'transfer' // Movement of assets into or out of an account.
    | 'transfer fee' // Fees incurred for transfer of a holding or account.
    | 'trust fee' // Fees related to adminstration of a trust account.
    | 'unqualified gain' // Unqualified capital gain received as cash.
    | 'withdrawal' // Outflow of cash from an account.

  /** plaid.com/docs/#account-types */
  export interface AccountTypes {
    investment:
      | '401a'
      | '401k'
      | '403B'
      | '457b'
      | '529'
      | 'brokerage'
      | 'cash isa'
      | 'education savings account'
      | 'gic'
      | 'health reimbursement arrangement'
      | 'hsa'
      | 'isa'
      | 'ira'
      | 'lif'
      | 'lira'
      | 'lrif'
      | 'lrsp'
      | 'non-taxable brokerage account'
      | 'balance_sheet/equity'
      | 'prif'
      | 'rdsp'
      | 'resp'
      | 'rlif'
      | 'rrif'
      | 'pension'
      | 'profit sharing plan'
      | 'retirement'
      | 'roth'
      | 'roth 401k'
      | 'rrsp'
      | 'sep ira'
      | 'simple ira'
      | 'sipp'
      | 'stock plan'
      | 'thrift savings plan'
      | 'tfsa'
      | 'ugma'
      | 'utma'
      | 'variable annuity'
    credit: 'credit card' | 'paypal'
    depository:
      | 'cd'
      | 'checking'
      | 'savings'
      | 'money market'
      | 'paypal'
      | 'prepaid'
    loan:
      | 'auto'
      | 'commercial'
      | 'construction'
      | 'consumer'
      | 'home'
      | 'home equity'
      | 'loan'
      | 'mortgage'
      | 'overdraft'
      | 'line of credit'
      | 'student'
    other:
      | 'cash management'
      | 'keogh'
      | 'mutual fund'
      | 'prepaid'
      | 'recurring'
      | 'rewards'
      | 'safe deposit'
      | 'sarsep'
      | 'balance_sheet/equity'
  }

  /** plaid.com/docs/#errors-overview */
  export type ErrorShape = ErrorTypeAndCode & {
    /**
     * A developer-friendly representation of the error code.
     * This may change over time and is not safe for programmatic use.
     */
    error_message: string
    /**
     * A user-friendly representation of the error code. null if the error is not related to user action.
     * This may change over time and is not safe for programmatic use.
     */
    display_message?: string
    /** Applies to most errors */
    request_id?: string
  }

  export type ErrorTypeAndCode =
    | {
        error_type: 'INVALID_REQUEST'
        error_code:
          | 'MISSING_FIELDS'
          | 'UNKNOWN_FIELDS'
          | 'INVALID_FIELD'
          | 'INVALID_BODY'
          | 'INVALID_HEADERS'
          | 'NOT_FOUND'
          | 'SANDBOX_ONLY'
      }
    | {
        error_type: 'INVALID_INPUT'
        error_code:
          | 'INVALID_API_KEYS'
          | 'UNAUTHORIZED_ENVIRONMENT'
          | 'INVALID_ACCESS_TOKEN'
          | 'INVALID_PUBLIC_TOKEN'
          | 'INVALID_PRODUCT'
          | 'INVALID_ACCOUNT_ID'
          | 'INVALID_INSTITUTION'
      }
    | {
        error_type: 'INSTITUTION_ERROR'
        error_code:
          | 'INSTITUTION_DOWN'
          | 'INSTITUTION_NOT_RESPONDING'
          | 'INSTITUTION_NOT_AVAILABLE'
          | 'INSTITUTION_NO_LONGER_SUPPORTED'
      }
    | {
        error_type: 'RATE_LIMIT_EXCEEDED'
        error_code:
          | 'ACCOUNTS_LIMIT'
          | 'ADDITION_LIMIT'
          | 'AUTH_LIMIT'
          | 'TRANSACTIONS_LIMIT'
          | 'IDENTITY_LIMIT'
          | 'INCOME_LIMIT'
          | 'ITEM_GET_LIMIT'
          | 'RATE_LIMIT'
      }
    | {
        error_type: 'API_ERROR'
        error_code: 'INTERNAL_SERVER_ERROR' | 'PLANNED_MAINTENANCE'
      }
    | {
        error_type: 'AUTH_ERROR'
        error_code: 'PRODUCT_NOT_READY' | 'VERIFICATION_EXPIRED'
      }
    | {
        error_type: 'ITEM_ERROR'
        error_code:
          | 'INVALID_CREDENTIALS'
          | 'INVALID_MFA'
          | 'INVALID_UPDATED_USERNAME'
          | 'ITEM_LOCKED'
          | 'ITEM_LOGIN_REQUIRED'
          | 'ITEM_NO_ERROR'
          | 'ITEM_NOT_SUPPORTED'
          | 'ITEM_NO_VERIFICATION'
          | 'INCORRECT_DEPOSIT_AMOUNTS'
          | 'TOO_MANY_VERIFICATION_ATTEMPTS'
          | 'USER_SETUP_REQUIRED'
          | 'MFA_NOT_SUPPORTED'
          | 'NO_ACCOUNTS'
          | 'NO_AUTH_ACCOUNTS'
          | 'PRODUCT_NOT_READY'
          | 'PRODUCTS_NOT_SUPPORTED'
      }
    | {
        error_type: 'ASSET_REPORT_ERROR'
        error_code:
          | 'PRODUCT_NOT_ENABLED'
          | 'DATA_UNAVAILABLE'
          | 'PRODUCT_NOT_READY'
          | 'ASSET_REPORT_GENERATION_FAILED'
          | 'INVALID_PARENT'
          | 'INSIGHTS_NOT_ENABLED'
          | 'INSIGHTS_PREVIOUSLY_NOT_ENABLED'
      }

  type Webhook<Type, Code, Props extends Record<string, unknown>> = {
    webhook_type: Type
    webhook_code: Code
    item_id: string
  } & Props

  /**
   * https://plaid.com/docs/#transactions-webhooks
   * Only includes Transaction and Item webhooks
   */
  export type WebhookShape =
    | ItemWebhook
    | TransactionsWebhook
    | Webhook<
        'HOLDINGS',
        'DEFAULT_UPDATE',
        {error: unknown; new_holdings: number; updated_holdings: number}
      >
    | Webhook<
        'INVESTMENTS_TRANSACTIONS',
        'DEFAULT_UPDATE',
        {
          error: unknown
          new_investments_transactions: number
          cancelled_investments_transactions: number
        }
      >
    // Not implemented by ledgersync today.
    | Webhook<'ASSETS', string, {}>
    | Webhook<'AUTH', string, {}>
    | Webhook<'INCOME', string, {}>
    | Webhook<'PAYMENT_INITIATION', string, {}>

  export type ItemWebhook =
    /** Fired when an Item’s webhook is updated. */
    | Webhook<'ITEM', 'WEBHOOK_UPDATE_ACKNOWLEDGED', {new_webhook_url: string}>
    /**
     * Fired when an error is encountered with an Item. The error can be resolved
     * by having the user go through Link’s update mode
     */
    | Webhook<
        'ITEM',
        'ERROR',
        {error: Extract<ErrorShape, {error_type: 'ITEM_ERROR'}>}
      >

  export type TransactionsWebhook =
    /**
     * Fired when an Item's initial transaction pull is completed.
     * Note: The default pull is 30 days.
     */
    | Webhook<'TRANSACTIONS', 'INITIAL_UPDATE', {new_transactions: string}>
    /**
     * Fired when an Item's historical transaction pull is completed.
     * Plaid fetches as much data as is available from the financial institution.
     */
    | Webhook<'TRANSACTIONS', 'HISTORICAL_UPDATE', {new_transactions: string}>
    /**
     * Fired when new transaction data is available as Plaid performs
     * its regular updates of the Item.
     */
    | Webhook<'TRANSACTIONS', 'DEFAULT_UPDATE', {new_transactions: string}>
    /**
     * Fired when posted transaction(s) for an Item are deleted. The deleted
     * transaction IDs are included in the webhook payload.
     */
    | Webhook<
        'TRANSACTIONS',
        'TRANSACTIONS_REMOVED',
        {removed_transactions: string[]}
      >
}
