/* istanbul ignore file */
/* tslint:disable */
 
export const $ProviderAccountUserProfileResponse = {
  properties: {
    providerAccount: {
      type: 'array',
      contains: {
        type: 'ProviderAccountProfile',
      },
      isReadOnly: true,
    },
  },
} as const
