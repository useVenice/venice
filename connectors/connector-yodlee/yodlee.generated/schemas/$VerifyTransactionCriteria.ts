/* istanbul ignore file */
/* tslint:disable */

export const $VerifyTransactionCriteria = {
  properties: {
    date: {
      type: 'string',
      isRequired: true,
    },
    amount: {
      type: 'number',
      isRequired: true,
      format: 'double',
    },
    verifiedTransaction: {
      type: 'array',
      contains: {
        type: 'Transaction',
      },
      isReadOnly: true,
    },
    matched: {
      type: 'Enum',
      isReadOnly: true,
    },
    keyword: {
      type: 'string',
    },
    dateVariance: {
      type: 'string',
    },
    baseType: {
      type: 'Enum',
    },
  },
} as const
