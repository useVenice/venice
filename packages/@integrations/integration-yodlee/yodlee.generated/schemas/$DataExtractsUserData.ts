/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $DataExtractsUserData = {
  properties: {
    holding: {
      type: 'array',
      contains: {
        type: 'DataExtractsHolding',
      },
      isReadOnly: true,
    },
    totalTransactionsCount: {
      type: 'number',
      isReadOnly: true,
      format: 'int64',
    },
    user: {
      type: 'DataExtractsUser',
      isReadOnly: true,
    },
    account: {
      type: 'array',
      contains: {
        type: 'DataExtractsAccount',
      },
      isReadOnly: true,
    },
    transaction: {
      type: 'array',
      contains: {
        type: 'DataExtractsTransaction',
      },
      isReadOnly: true,
    },
    providerAccount: {
      type: 'array',
      contains: {
        type: 'DataExtractsProviderAccount',
      },
      isReadOnly: true,
    },
  },
} as const;
