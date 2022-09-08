/* istanbul ignore file */
/* tslint:disable */
 
export const $AccountHistory = {
  properties: {
    historicalBalances: {
      type: 'array',
      contains: {
        type: 'HistoricalBalance',
      },
      isReadOnly: true,
    },
    id: {
      type: 'number',
      isReadOnly: true,
      format: 'int64',
    },
  },
} as const
