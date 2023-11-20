/* istanbul ignore file */
/* tslint:disable */

export const $CobrandNotificationResponse = {
  properties: {
    event: {
      type: 'array',
      contains: {
        type: 'CobrandNotificationEvent',
      },
      isReadOnly: true,
    },
  },
} as const
