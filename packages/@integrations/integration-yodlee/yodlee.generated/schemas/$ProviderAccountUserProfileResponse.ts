/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
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
} as const;
