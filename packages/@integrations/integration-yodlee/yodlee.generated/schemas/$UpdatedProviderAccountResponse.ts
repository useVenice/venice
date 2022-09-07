/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $UpdatedProviderAccountResponse = {
  properties: {
    providerAccount: {
      type: 'array',
      contains: {
        type: 'UpdatedProviderAccount',
      },
      isReadOnly: true,
    },
  },
} as const;
