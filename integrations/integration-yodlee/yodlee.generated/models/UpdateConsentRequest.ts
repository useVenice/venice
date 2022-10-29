/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type UpdateConsentRequest = {
  /**
   * Applicable Open Banking data cluster values.<br><br><b>Endpoints</b>:<ul><li>PUT Consent</li></ul>
   */
  scopeId?: Array<
    | 'ACCOUNT_DETAILS'
    | 'TRANSACTION_DETAILS'
    | 'STATEMENT_DETAILS'
    | 'CONTACT_DETAILS'
  >
}
