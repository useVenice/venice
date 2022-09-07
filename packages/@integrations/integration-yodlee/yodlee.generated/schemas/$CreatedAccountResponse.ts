/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $CreatedAccountResponse = {
  properties: {
    account: {
      type: 'array',
      contains: {
        type: 'CreatedAccountInfo',
      },
      isReadOnly: true,
    },
  },
} as const;
