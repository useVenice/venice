/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $TransactionResponse = {
  properties: {
    transaction: {
      type: 'array',
      contains: {
        type: 'Transaction',
      },
      isReadOnly: true,
    },
  },
} as const;
