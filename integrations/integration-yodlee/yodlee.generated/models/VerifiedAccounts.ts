/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type {AccountHolder} from './AccountHolder'
import type {BankTransferCode} from './BankTransferCode'
import type {FullAccountNumberList} from './FullAccountNumberList'
import type {Money} from './Money'

export type VerifiedAccounts = {
  /**
   * The account name as it appears at the site.<br>(The POST accounts service response return this field as name)<br><b>Applicable containers</b>: bank, investment<br><b>Aggregated / Manual</b>: Aggregated<br><b>Endpoints</b>:<br><ul><li>GET /verification/verifiedAccounts</li></ul>
   */
  readonly accountName?: string
  /**
   * The status of the account verification.
   */
  readonly verificationStatus?: 'SUCCESS' | 'FAILED'
  /**
   * The type of account that is aggregated, i.e., savings, checking, charge, HELOC, etc. The account type is derived based on the attributes of the account. <br><b>Valid Values:</b><br><b>Aggregated Account Type</b><br><b>bank</b><ul><li>CHECKING</li><li>SAVINGS</li><li>MONEY_MARKET</li></ul><b>investment (SN 1.0)</b><ul><li>BROKERAGE_MARGIN</li><li>BROKERAGE_CASH</li><li>BROKERAGE_LINK_ACCOUNT</li><li>INDIVIDUAL</li><li>CMA</li></ul><b>investment (SN 2.0)</b><ul><li>BROKERAGE_MARGIN</li><li>BROKERAGE_CASH</li><li>BROKERAGE_LINK_ACCOUNT</li><li>INDIVIDUAL</li><li>CMA</li></ul><ul><li>GET /verification/verifiedAccounts</li></ul>
   */
  readonly accountType?: string
  /**
   * The balance in the account that is available at the beginning of the business day; it is equal to the ledger balance of the account.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: bank<br><b>Endpoints</b>:<ul><li>GET /verification/verifiedAccounts</li></ul>
   */
  readonly currentBalance?: Money
  /**
   * The name or identification of the account owner, as it appears at the FI site. <br><b>Note:</b> The account holder name can be full or partial based on how it is displayed in the account summary page of the FI site. In most cases, the FI site does not display the full account holder name in the account summary page.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: bank, investment<br><b>Endpoints</b>:<ul><li>GET /verification/verifiedAccounts</li></ul>
   */
  readonly displayedName?: string
  /**
   * Holder details of the account.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: bank<br><b>Endpoints</b>:<ul><li>GET /verification/verifiedAccounts</li></ul>
   */
  readonly holder?: Array<AccountHolder>
  /**
   * The account number as it appears on the site. (The POST accounts service response return this field as number)<br><b>Additional Details</b>:<b> Bank / Investment</b>:<br> The account number for the bank account as it appears at the site.<br>In most cases, the site does not display the full account number in the account summary page and additional navigation is required to aggregate it.<br><b>Applicable containers</b>: bank, investment<br><b>Aggregated / Manual</b>: Aggregated<br><b>Endpoints</b>:<br><ul><li>GET /verification/verifiedAccounts</li></ul>
   */
  readonly accountNumber?: string
  /**
   * The classification of the account such as personal, corporate, etc.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: bank, investment<br><b>Endpoints</b>:<li>GET /verification/verifiedAccounts</li></ul><b>Applicable Values</b><br>
   */
  readonly classification?:
    | 'OTHER'
    | 'PERSONAL'
    | 'CORPORATE'
    | 'SMALL_BUSINESS'
    | 'TRUST'
    | 'ADD_ON_CARD'
    | 'VIRTUAL_CARD'
  /**
   * The balance in the account that is available for spending. For checking accounts with overdraft, available balance may include overdraft amount, if end site adds overdraft balance to available balance.<br><b>Applicable containers</b>: bank, investment<br><b>Aggregated / Manual</b>: Aggregated<br><b>Endpoints</b>:<br><ul><li>GET /verification/verifiedAccounts</li></ul>
   */
  readonly availableBalance?: Money
  /**
   * Full account number List of the account that contains paymentAccountNumber and unmaskedAccountNumber. <br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: bank, investment <br><b>Endpoints</b>:<ul><li>GET /verification/verifiedAccounts</li></ul>
   */
  readonly fullAccountNumberList?: FullAccountNumberList
  /**
   * The primary key of the provider account resource.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: bank, investment<br><b>Endpoints</b>:<ul><li>GET /verification/verifiedAccounts</li></ul>
   */
  readonly accountId?: number
  /**
   * The total account value. <br><b>Additional Details:</b><br><b>Bank:</b> available balance or current balance.<br><b>Investment:</b> The total balance of all the investment account, as it appears on the FI site.<b>Applicable containers</b>: bank, investment <br><b>Aggregated / Manual</b>: Aggregated<br><b>Endpoints</b>:<br><ul><li>GET /verification/verifiedAccounts</li></ul>
   */
  readonly balance?: Money
  /**
   * Identifier of the provider site. The primary key of provider resource. <br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: bank, investment<br><b>Endpoints</b>:<ul><li>GET /verification/verifiedAccounts</li></ul>
   */
  readonly providerId?: string
  /**
   * The primary key of the provider account resource.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: bank, investment<br><b>Endpoints</b>:<ul><li>GET /verification/verifiedAccounts</li></ul>
   */
  readonly providerAccountId?: number
  /**
   * The type of service. E.g., Bank, Investment <br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: bank, investment<br><b>Endpoints</b>:<ul><li>GET /verification/verifiedAccounts</ul><b>Applicable Values</b><br>
   */
  readonly CONTAINER?: 'bank' | 'investment'
  /**
   * Indicates if an account is selected by the user in the FastLink 4 application
   */
  readonly isSelected?: boolean
  /**
   * The amount that is available for immediate withdrawal or the total amount available to purchase securities in a brokerage or investment account.<br><b>Note:</b> The cash balance field is only applicable to brokerage related accounts.<br><br><b>Aggregated </b><br><b>Applicable containers</b>: investment<br><b>Endpoints</b>:<ul><li>GET /verification/verifiedAccounts</li></ul>
   */
  readonly cash?: Money
  /**
   * Bank and branch identification information.<br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: bank, investment<br><b>Endpoints</b>:<br><ul><li>GET /verification/verifiedAccounts</li></ul>
   */
  readonly bankTransferCode?: Array<BankTransferCode>
  /**
   * Service provider or institution name where the account originates. This belongs to the provider resource.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: bank, investment<br><b>Endpoints</b>:<ul><li>GET /verification/verifiedAccounts</li></ul>
   */
  readonly providerName?: string
  /**
   * The reason for the verification failure of the account.
   */
  readonly failedReason?: 'REQUIRED_DATA_NOT_AVAILABLE' | 'MATCHING_FAILED'
}
