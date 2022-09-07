/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $EnrichedTransactionResponse = {
  properties: {
    enrichedTransaction: {
      type: 'array',
      contains: {
        type: 'EnrichedTransaction',
      },
      isReadOnly: true,
    },
  },
} as const;
