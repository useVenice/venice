/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type AutoRefresh = {
  /**
   * Indicates the reason for the status.<br><br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul><b>Applicable Values</b><br>
   */
  readonly additionalStatus?:
    | 'SCHEDULED'
    | 'TEMP_ERROR'
    | 'SITE_BLOCKING'
    | 'SITE_NOT_SUPPORTED'
    | 'REAL_TIME_MFA_REQUIRED'
    | 'USER_ACTION_REQUIRED'
    | 'UNSUBSCRIBED'
    | 'MANUAL_ACCOUNT'
  /**
   * Date on which the auto refresh status is determined.<br><br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul>
   */
  readonly asOfDate?: string
  /**
   * Indicates whether auto refresh is enabled or disabled.<br><br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul><b>Applicable Values</b><br>
   */
  readonly status?: 'ENABLED' | 'DISABLED'
}
