/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type CobrandPublicKeyResponse = {
  /**
   * The key name used for encryption.<br><br><b>Endpoints</b>:<ul><li>GET cobrand/publicKey</li></ul>
   */
  readonly keyAlias?: string
  /**
   * Public key that the customer should be using to encrypt the credentials and answers before sending to the add & update providerAccounts APIs.<br><br><b>Endpoints</b>:<ul><li>GET cobrand/publicKey</li></ul>
   */
  readonly keyAsPemString?: string
}
