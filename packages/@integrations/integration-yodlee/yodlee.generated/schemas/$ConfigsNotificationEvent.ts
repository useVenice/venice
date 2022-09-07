/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ConfigsNotificationEvent = {
  properties: {
    name: {
      type: 'Enum',
    },
    callbackUrl: {
      type: 'string',
      description: `URL to which the notification should be posted.<br><br><b>Endpoints</b>:<ul><li>GET configs/notifications/events</li></ul>`,
      maxLength: 2147483647,
      minLength: 1,
    },
  },
} as const;
