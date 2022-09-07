/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $AccountHistoricalBalancesResponse = {
  properties: {
    account: {
      type: 'array',
      contains: {
        type: 'AccountHistory',
      },
      isReadOnly: true,
    },
  },
} as const;
