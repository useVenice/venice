/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type AccessTokens = {
  /**
   * The identifier of the application for which the access token is generated.<br><br><b>Endpoints</b>:<ul><li>GET user/accessTokens</li></ul>
   */
  appId?: string
  /**
   * Access token value used to invoke the widgets/apps.<br><br><b>Endpoints</b>:<ul><li>GET user/accessTokens</li></ul>
   */
  value?: string
  /**
   * Base URL using which the application is accessed.<br><br><b>Endpoints</b>:<ul><li>GET user/accessTokens</li></ul>
   */
  url?: string
}
