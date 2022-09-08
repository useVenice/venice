/* istanbul ignore file */
/* tslint:disable */
 
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
} as const
