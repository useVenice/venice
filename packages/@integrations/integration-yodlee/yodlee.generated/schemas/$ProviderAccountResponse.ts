/* istanbul ignore file */
/* tslint:disable */
 
export const $ProviderAccountResponse = {
  properties: {
    providerAccount: {
      type: 'array',
      contains: {
        type: 'ProviderAccount',
      },
      isReadOnly: true,
    },
  },
} as const
