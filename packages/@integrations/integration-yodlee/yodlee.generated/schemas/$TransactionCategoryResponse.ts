/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
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
} as const;
