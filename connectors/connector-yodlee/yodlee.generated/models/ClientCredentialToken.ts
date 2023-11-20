/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type ClientCredentialToken = {
  /**
   * Time in seconds after which the issued accessToken expires.<br><br><b>Endpoints</b>:<ul><li>POST /auth/token</li></ul>
   */
  readonly expiresIn?: number
  /**
   * The date and time on which accessToken was created for the customer.<br><br><b>Endpoints</b>:<ul><li>POST /auth/token</li></ul>
   */
  readonly issuedAt?: string
  /**
   * Access Token to access YSL 1.1 services.<br><br><b>Endpoints</b>:<ul><li>POST /auth/token</li></ul>
   */
  readonly accessToken?: string
}
