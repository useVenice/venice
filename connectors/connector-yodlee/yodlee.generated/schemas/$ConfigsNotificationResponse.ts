/* istanbul ignore file */
/* tslint:disable */

export const $ConfigsNotificationResponse = {
  properties: {
    event: {
      type: 'array',
      contains: {
        type: 'ConfigsNotificationEvent',
      },
      isReadOnly: true,
    },
  },
} as const
