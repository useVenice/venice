/* istanbul ignore file */
/* tslint:disable */
 
export const $VerifyAccount = {
  properties: {
    transactionCriteria: {
      type: 'array',
      contains: {
        type: 'VerifyTransactionCriteria',
      },
    },
    account: {
      type: 'array',
      contains: {
        type: 'VerifiedAccount',
      },
    },
  },
} as const
