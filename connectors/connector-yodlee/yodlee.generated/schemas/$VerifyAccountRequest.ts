/* istanbul ignore file */
/* tslint:disable */

export const $VerifyAccountRequest = {
  properties: {
    container: {
      type: 'Enum',
    },
    accountId: {
      type: 'number',
      format: 'int64',
    },
    transactionCriteria: {
      type: 'array',
      contains: {
        type: 'VerifyTransactionCriteria',
      },
      isRequired: true,
    },
  },
} as const
