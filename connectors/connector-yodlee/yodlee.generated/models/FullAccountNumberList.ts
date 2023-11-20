/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type FullAccountNumberList = {
  /**
   * Payment Account Number of given account.<br><br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul>
   */
  readonly paymentAccountNumber?: string
  /**
   * Unmasked account number of given account.<br><br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul>
   */
  readonly unmaskedAccountNumber?: string
}
