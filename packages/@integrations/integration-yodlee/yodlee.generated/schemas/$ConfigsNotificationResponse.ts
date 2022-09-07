/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
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
} as const;
