/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type ConfigsPublicKey = {
  /**
   * The key name used for encryption.<br><br><b>Endpoints</b>:<ul><li>GET configs/publicKey</li></ul>
   */
  readonly alias?: string;
  /**
   * Public key that the customer should be using to encrypt the credentials and answers before sending to the add and update providerAccounts APIs.<br><br><b>Endpoints</b>:<ul><li>GET configs/publicKey</li></ul>
   */
  readonly key?: string;
};

