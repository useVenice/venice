/* istanbul ignore file */
/* tslint:disable */

export const $TransactionCategoryResponse = {
  properties: {
    transactionCategory: {
      type: 'array',
      contains: {
        type: 'TransactionCategory',
      },
      isReadOnly: true,
    },
  },
} as const
