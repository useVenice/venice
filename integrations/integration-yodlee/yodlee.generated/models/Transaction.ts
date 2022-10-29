/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type {Description} from './Description'
import type {Merchant} from './Merchant'
import type {Money} from './Money'

export type Transaction = {
  /**
   * The value provided will be either postDate or transactionDate. postDate takes higher priority than transactionDate, except for the investment container as only transactionDate is available. The availability of postDate or transactionDate depends on the provider site.<br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>
   */
  readonly date?: string
  /**
   * A unique ID that the provider site has assigned to the transaction. The source ID is only available for the pre-populated accounts.<br>Pre-populated accounts are the accounts that the FI customers shares with Yodlee, so that the user does not have to add or aggregate those accounts.
   */
  readonly sourceId?: string
  /**
   * The symbol of the security being traded.<br><b>Note</b>: The settle date field applies only to trade-related transactions. <br><br><b>Applicable containers</b>: investment<br>
   */
  readonly symbol?: string
  /**
   * The CUSIP (Committee on Uniform Securities Identification Procedures) identifies the financial instruments in the United States and Canada.<br><b><br><b>Note</b></b>: The CUSIP number field applies only to trade related transactions.<br><br><b>Applicable containers</b>: investment<br>
   */
  readonly cusipNumber?: string
  /**
   * The high level category assigned to the transaction. The supported values are provided by the GET transactions/categories. <br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>
   */
  readonly highLevelCategoryId?: number
  /**
   * The id of the detail category that is assigned to the transaction. The supported values are provided by GET transactions/categories.<br><br><b>Applicable containers</b>: bank,creditCard<br>
   */
  readonly detailCategoryId?: number
  /**
   * Description details<br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>
   */
  readonly description?: Description
  /**
   * Additional notes provided by the user for a particular  transaction through application or API services. <br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>
   */
  readonly memo?: string
  /**
   * It is the date on which the transaction is finalized, that is, the date the ownership of the security is transferred to the buyer. The settlement date is usually few days after the transaction date.<br><br><b>Applicable containers</b>: investment<br>
   */
  readonly settleDate?: string
  /**
   * The nature of the transaction, i.e., deposit, refund, payment, etc.<br><b>Note</b>: The transaction type field is available only for the United States, Canada, United Kingdom, and India based provider sites. <br><br><b>Applicable containers</b>: bank,creditCard,investment<br>
   */
  readonly type?: string
  /**
   * The intermediary of the transaction.<br><br><b>Applicable containers</b>:  bank,creditCard,investment,loan<br>
   */
  readonly intermediary?: Array<string>
  /**
   * Indicates if the transaction appears as a debit or a credit transaction in the account. <br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br><b>Applicable Values</b><br>
   */
  readonly baseType?: 'CREDIT' | 'DEBIT'
  /**
   * Indicates the source of the category, i.e., categories derived by the system or assigned/provided by the consumer. This is the source field of the transaction category resource. The supported values are provided by the GET transactions/categories.<br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br><b>Applicable Values</b><br>
   */
  readonly categorySource?: 'SYSTEM' | 'USER'
  /**
   * The portion of the principal in the transaction amount. The transaction amount can be the amount due, payment amount, minimum amount, repayment, etc.<br><br><b>Applicable containers</b>: loan<br>
   */
  readonly principal?: Money
  readonly lastUpdated?: string
  /**
   * The portion of interest in the transaction amount. The transaction amount can be the amount due, payment amount, minimum amount, repayment, etc.<br><br><b>Applicable containers</b>: loan<br>
   */
  readonly interest?: Money
  /**
   * The price of the security for the transaction.<br><b>Note</b>: The price field applies only to the trade related transactions. <br><br><b>Applicable containers</b>: investment<br>
   */
  readonly price?: Money
  /**
   * A commission or brokerage associated with a transaction.<br><br><br><b>Additional Details</b>:The commission only applies to trade-related transactions.<b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>
   */
  readonly commission?: Money
  /**
   * An unique identifier for the transaction. The combination of the id and account container are unique in the system. <br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>
   */
  readonly id?: number
  /**
   * Indicates the merchantType of the transaction.e.g:-BILLERS,SUBSCRIPTION,OTHERS <br><br><b>Applicable containers</b>: bank,creditCard,investment,loan<br>
   */
  readonly merchantType?: string
  /**
   * The amount of the transaction as it appears at the FI site. <br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>
   */
  readonly amount?: Money
  /**
   * The checkNumber of the transaction.<br><br><b>Applicable containers</b>: bank<br>
   */
  readonly checkNumber?: string
  /**
   * Indicates if the transaction is happened online or in-store. <br><br><b>Applicable containers</b>: bank,creditCard,investment,loan<br>
   */
  readonly isPhysical?: boolean
  /**
   * The quantity associated with the transaction.<br><b>Note</b>: The quantity field applies only to trade-related transactions.<br><br><b>Applicable containers</b>: investment<br>
   */
  readonly quantity?: number
  /**
   * It is an identification number that is assigned to financial instruments such as stocks and bonds trading in Switzerland.<br><br><b>Applicable containers</b>: investment<br>
   */
  readonly valoren?: string
  /**
   * Indicates if the transaction is aggregated from the FI site or the consumer has manually created the transaction using the application or an API. <br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>
   */
  readonly isManual?: boolean
  /**
   * The name of the merchant associated with the transaction.<br><b>Note</b>: The merchant name field is available only in the United States, Canada, United Kingdom, and India.<br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>
   */
  readonly merchant?: Merchant
  /**
   * SEDOL stands for Stock Exchange Daily Official List, a list of security identifiers used in the United Kingdom and Ireland for clearing purposes.<br><br><b>Applicable containers</b>: investment<br>
   */
  readonly sedol?: string
  /**
   * The date the transaction happens in the account. <br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>
   */
  readonly transactionDate?: string
  /**
   * The categoryType of the category assigned to the transaction. This is the type field of the transaction category resource. The supported values are provided by the GET transactions/categories.<br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>
   */
  readonly categoryType?:
    | 'TRANSFER'
    | 'DEFERRED_COMPENSATION'
    | 'UNCATEGORIZE'
    | 'INCOME'
    | 'EXPENSE'
  /**
   * The account from which the transaction was made. This is basically the primary key of the account resource. <br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>
   */
  readonly accountId?: number
  readonly createdDate?: string
  /**
   * The source through which the transaction is added to the Yodlee system.<br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loann<br><b>Applicable Values:</b><br>
   */
  readonly sourceType?: 'AGGREGATED' | 'MANUAL'
  /**
   * The account's container.<br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br><b>Applicable Values</b><br>
   */
  readonly CONTAINER?:
    | 'bank'
    | 'creditCard'
    | 'investment'
    | 'insurance'
    | 'loan'
    | 'reward'
    | 'bill'
    | 'realEstate'
    | 'otherAssets'
    | 'otherLiabilities'
  /**
   * The date on which the transaction is posted to the account.<br><br><b>Applicable containers</b>: bank,creditCard,insurance,loan<br>
   */
  readonly postDate?: string
  /**
   * The parentCategoryId of the category assigned to the transaction.<br><b>Note</b>: This field will be provided in the response if the transaction is assigned to a user-created category. <br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>
   */
  readonly parentCategoryId?: number
  /**
   * The transaction subtype field provides a detailed transaction type. For example, purchase is a transaction type and the transaction subtype field indicates if the purchase was made using a debit or credit card.<br><b>Note</b>: The transaction subtype field is available only in the United States, Canada, United Kingdom, and India.<br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>
   */
  readonly subType?:
    | 'OVERDRAFT_CHARGE'
    | 'ONLINE_PURCHASE'
    | 'TAX_PAYMENT'
    | 'PAYMENT_BY_CHECK'
    | 'ATM_CASH_WITHDRAWAL'
    | 'SERVICE_CHARGE'
    | 'RETURNED_CHECK_CHARGE'
    | 'STOP_PAYMENT_CHARGE'
    | 'CONVENIENCE_FEE'
    | 'AUTO_LOAN'
    | 'HOME_LOAN_MORTGAGE'
    | 'RECURRING_SUBSCRIPTION_PAYMENT'
    | 'INTEREST'
    | 'PAYMENT'
    | 'PURCHASE'
    | 'REFUND'
    | 'TRANSFER'
    | 'FINANCE_CHARGE'
    | 'OTHER_CHARGES_FEES'
    | 'ANNUAL_FEE'
    | 'DEPOSIT'
    | 'DIRECT_DEPOSIT_SALARY'
    | 'INVESTMENT_INCOME_CASH'
    | 'SSA'
    | 'REWARDS'
    | 'TAX_REFUND'
    | 'CREDIT_CARD_PAYMENT'
    | 'INSURANCE_PAYMENT'
    | 'UTILITIES_PAYMENT'
    | 'CHILD_SUPPORT'
    | 'LOAN'
    | 'PERSONAL_LOAN'
    | 'STUDENT_LOAN'
    | 'REIMBURSEMENT'
    | 'BALANCE_TRANSFER'
    | 'OVERDRAFT_PROTECTION'
    | 'CREDIT'
    | 'NSF_FEES'
  /**
   * The name of the category assigned to the transaction. This is the category field of the transaction category resource. The supported values are provided by the GET transactions/categories.<br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>
   */
  readonly category?: string
  /**
   * The running balance in an account indicates the balance of the account after every transaction.<br><br><b>Applicable containers</b>: bank,creditCard,investment<br>
   */
  readonly runningBalance?: Money
  /**
   * The id of the category assigned to the transaction. This is the id field of the transaction category resource. The supported values are provided by the GET transactions/categories.<br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>
   */
  readonly categoryId?: number
  /**
   * For transactions involving securities, this captures the securities description.<br><br><b>Applicable containers</b>: investment<br>
   */
  readonly holdingDescription?: string
  /**
   * International Securities Identification Number (ISIN) standard is used worldwide to identify specific securities.<br><br><b>Applicable containers</b>: investment<br>
   */
  readonly isin?: string
  /**
   * The status of the transaction: pending or posted.<br><b>Note</b>: Most FI sites only display posted transactions. If the FI site displays transaction status, same will be aggregated.  <br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br><b>Applicable Values</b><br>
   */
  readonly status?: 'POSTED' | 'PENDING' | 'SCHEDULED' | 'FAILED' | 'CLEARED'
}
