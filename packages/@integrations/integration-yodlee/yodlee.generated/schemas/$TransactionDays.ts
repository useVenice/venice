/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $TransactionDays = {
  properties: {
    fullAccountNumberFields: {
      type: 'array',
      contains: {
        type: 'Enum',
      },
    },
    numberOfTransactionDays: {
      type: 'number',
      format: 'int32',
    },
  },
} as const;
