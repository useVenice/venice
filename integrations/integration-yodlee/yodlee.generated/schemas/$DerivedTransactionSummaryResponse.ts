/* istanbul ignore file */
/* tslint:disable */

export const $DerivedTransactionSummaryResponse = {
  properties: {
    links: {
      type: 'DerivedTransactionsLinks',
      isReadOnly: true,
    },
    transactionSummary: {
      type: 'array',
      contains: {
        type: 'DerivedTransactionsSummary',
      },
      isReadOnly: true,
    },
  },
} as const
