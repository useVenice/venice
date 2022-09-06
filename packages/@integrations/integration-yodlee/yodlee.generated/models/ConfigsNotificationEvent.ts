/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type ConfigsNotificationEvent = {
  /**
   * Name of the event for which the customers must subscribe to receive notifications.<br><b>Valid Value:</b> Notification Events Name<br><br><b>Endpoints</b>:<ul><li>GET configs/notifications/events</li></ul><b>Applicable Values</b><br>
   */
  name?: 'REFRESH' | 'DATA_UPDATES' | 'AUTO_REFRESH_UPDATES' | 'LATEST_BALANCE_UPDATES';
  /**
   * URL to which the notification should be posted.<br><br><b>Endpoints</b>:<ul><li>GET configs/notifications/events</li></ul>
   */
  callbackUrl?: string;
};

