/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $CreateAccountInfo = {
  properties: {
    includeInNetWorth: {
      type: 'string',
    },
    address: {
      type: 'AccountAddress',
    },
    accountName: {
      type: 'string',
      isRequired: true,
      maxLength: 100,
      minLength: 1,
    },
    accountType: {
      type: 'string',
      isRequired: true,
      maxLength: 2147483647,
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
    amountDue: {
      type: 'Money',
    },
    balance: {
      type: 'Money',
    },
    nickname: {
      type: 'string',
      maxLength: 50,
    },
    valuationType: {
      type: 'Enum',
    },
  },
} as const;
