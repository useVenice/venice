/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type {Description} from './Description'
import type {Money} from './Money'

export type EnrichDataTransaction = {
  /**
   * The account's container.<br><br><b>Applicable containers</b>: bank,creditCard<br><b>Applicable Values</b><br>
   */
  container?:
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
   * A unique ID that the provider site has assigned to the transaction. The source ID is only available for the pre-populated accounts.<br>Pre-populated accounts are the accounts that the FI customers shares with Yodlee, so that the user does not have to add or aggregate those accounts.
   */
  sourceId?: string
  /**
   * The amount of the transaction as it appears at the FI site. <br><br><b>Applicable containers</b>: bank,creditCard<br>
   */
  amount?: Money
  /**
   * Description details<br><br><b>Applicable containers</b>: bank,creditCard<br>
   */
  description?: Description
  /**
   * The date on which the transaction is posted to the account.<br><br><b>Applicable containers</b>: bank,creditCard<br>
   */
  postDate?: string
  /**
   * The loginName of the User.<br><br><b>Applicable containers</b>: bank,creditCard<br>
   */
  userLoginName?: string
  /**
   * The account number as it appears on the site. (The POST accounts service response return this field as number)<br><b>Additional Details</b>:<b> Bank/ Loan/ Insurance/ Investment/Bill</b>:<br> The account number for the bank account as it appears at the site.<br><b>Credit Card</b>: The account number of the card account as it appears at the site,<br>i.e., the card number.The account number can be full or partial based on how it is displayed in the account summary page of the site.In most cases, the site does not display the full account number in the account summary page and additional navigation is required to aggregate it.<br><b>Applicable containers</b>: All Containers<br><b>Aggregated / Manual</b>: Both <br><b>Endpoints</b>:<br><ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>POST accounts</li><li>POST dataExtracts/userData</li><li>POST dataEnrich/userData</li></ul>
   */
  accountNumber?: string
  /**
   * The date the transaction happens in the account. <br><br><b>Applicable containers</b>: bank,creditCard<br>
   */
  transactionDate?: string
  /**
   * Indicates if the transaction appears as a debit or a credit transaction in the account. <br><br><b>Applicable containers</b>: bank,creditCard<br><b>Applicable Values</b><br>
   */
  baseType?: 'CREDIT' | 'DEBIT'
  status?: 'POSTED' | 'PENDING' | 'SCHEDULED' | 'FAILED' | 'CLEARED'
}
