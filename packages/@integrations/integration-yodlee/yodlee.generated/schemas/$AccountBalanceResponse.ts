/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $AccountBalanceResponse = {
  properties: {
    accountBalance: {
      type: 'array',
      contains: {
        type: 'AccountLatestBalance',
      },
      isReadOnly: true,
    },
  },
} as const;
