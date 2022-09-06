/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type ApiKeyOutput = {
  /**
   * Time in seconds after which the JWT token created for users expires.<br><br><b>Endpoints</b>:<ul><li>GET /auth/apiKey</li><li>POST /auth/apiKey</li></ul>
   */
  expiresIn?: number;
  /**
   * The date on which the apiKey was created for the customer.<br><br><b>Endpoints</b>:<ul><li>GET /auth/apiKey</li><li>POST /auth/apiKey</li></ul>
   */
  createdDate?: string;
  /**
   * Public key uploaded by the customer while generating ApiKey.<br><br><b>Endpoints</b>:<ul><li>GET /auth/apiKey</li><li>POST /auth/apiKey</li></ul>
   */
  publicKey?: string;
  /**
   * ApiKey or the issuer key used to generate the JWT token for authentication.<br><br><b>Endpoints</b>:<ul><li>GET /auth/apiKey</li><li>POST /auth/apiKey</li></ul>
   */
  key?: string;
};

