/* istanbul ignore file */
/* tslint:disable */

export const $UpdateAccountInfo = {
  properties: {
    container: {
      type: 'Enum',
    },
    includeInNetWorth: {
      type: 'string',
    },
    address: {
      type: 'AccountAddress',
    },
    accountName: {
      type: 'string',
      maxLength: 100,
      minLength: 1,
    },
    dueDate: {
      type: 'string',
    },
    memo: {
      type: 'string',
      maxLength: 250,
    },
    homeValue: {
      type: 'Money',
    },
    accountNumber: {
      type: 'string',
      maxLength: 100,
      pattern: '^[a-zA-Z0-9]+$',
    },
    frequency: {
      type: 'Enum',
    },
    accountStatus: {
      type: 'Enum',
    },
    amountDue: {
      type: 'Money',
    },
    linkedAccountIds: {
      type: 'array',
      contains: {
        type: 'number',
        format: 'int64',
      },
    },
    balance: {
      type: 'Money',
    },
    isEbillEnrolled: {
      type: 'string',
    },
    nickname: {
      type: 'string',
      maxLength: 50,
    },
  },
} as const
