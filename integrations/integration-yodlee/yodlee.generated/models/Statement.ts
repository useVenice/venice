/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type {Money} from './Money'

export type Statement = {
  /**
   * The APR applied to the balance on the credit card account, as available in the statement.<br><b>Note:</b> In case of variable APR, the APR available on the statement might differ from the APR available at the account-level.<br><br><b>Applicable containers</b>: creditCard, loan, insurance<br>
   */
  readonly apr?: number
  /**
   * The APR applicable to cash withdrawals on the credit card account.<br><br><b>Applicable containers</b>: creditCard, loan, insurance<br>
   */
  readonly cashApr?: number
  /**
   * The start date of the statement period.<br><br><b>Applicable containers</b>: creditCard, loan, insurance<br>
   */
  readonly billingPeriodStart?: string
  /**
   * The date by when the minimum payment is due to be paid.<br><b>Note:</b> The due date that appears in the statement may differ from the due date at the account-level.<br><br><b>Applicable containers</b>: creditCard, loan, insurance<br>
   */
  readonly dueDate?: string
  /**
   * The interest amount that is part of the amount due or the payment amount.<br><br><b>Applicable containers</b>: creditCard, loan, insurance<br>
   */
  readonly interestAmount?: Money
  /**
   * The date on which the statement is generated.<br><br><b>Applicable containers</b>: creditCard, loan, insurance<br>
   */
  readonly statementDate?: string
  /**
   * Cash Advance is the amount that is withdrawn from credit card over the counter or from an ATM up to the available credit/cash limit.<br><br><b>Applicable containers</b>: creditCard, loan, insurance<br>
   */
  readonly cashAdvance?: Money
  /**
   * The end date of the statement period.<br><br><b>Applicable containers</b>: creditCard, loan, insurance<br>
   */
  readonly billingPeriodEnd?: string
  /**
   * The principal amount that is part of the amount due or the payment amount.<br><br><b>Applicable containers</b>: creditCard, loan, insurance<br>
   */
  readonly principalAmount?: Money
  /**
   * The outstanding principal balance on the loan account.<br><br><b>Applicable containers</b>: creditCard, loan, insurance<br>
   */
  readonly loanBalance?: Money
  /**
   * The total amount owed at the end of the billing period.<br><br><b>Applicable containers</b>: creditCard, loan, insurance<br>
   */
  readonly amountDue?: Money
  /**
   * Account to which the statement belongs to.<br><br><b>Applicable containers</b>: creditCard, loan, insurance<br>
   */
  readonly accountId?: number
  /**
   * The date when the account was last updated by Yodlee.<br><br><b>Applicable containers</b>: creditCard, loan, insurance<br>
   */
  readonly lastUpdated?: string
  /**
   * The field is set to true if the statement is the latest generated statement.<br><br><b>Applicable containers</b>: creditCard, loan, insurance<br>
   */
  readonly isLatest?: boolean
  /**
   * <b>Credit Card:</b> The minimum amount that the consumer has to pay every month on the credit card account. Data provides an up-to-date information to the consumer.<br><br><b>Applicable containers</b>: creditCard, loan, insurance<br>
   */
  readonly minimumPayment?: Money
  /**
   * The date on which the last payment was done during the billing cycle.<br><br><b>Applicable containers</b>: creditCard, loan, insurance<br>
   */
  readonly lastPaymentDate?: string
  /**
   * The last payment done for the previous billing cycle in the current statement period.<br><br><b>Applicable containers</b>: creditCard, loan, insurance<br>
   */
  readonly lastPaymentAmount?: Money
  /**
   * Unique identifier for the statement.<br><br><b>Applicable containers</b>: creditCard, loan, insurance<br>
   */
  readonly id?: number
  /**
   * New charges on the statement (i.e., charges since last statement to end of the billing period). Applicable to line of credit loan type.<br><br><b>Applicable containers</b>: creditCard, loan, insurance<br>
   */
  readonly newCharges?: Money
}
