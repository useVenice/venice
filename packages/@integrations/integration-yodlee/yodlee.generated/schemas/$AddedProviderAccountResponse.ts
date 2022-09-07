/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $AddedProviderAccountResponse = {
  properties: {
    providerAccount: {
      type: 'array',
      contains: {
        type: 'AddedProviderAccount',
      },
      isReadOnly: true,
    },
  },
} as const;
