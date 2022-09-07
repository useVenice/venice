/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ProviderAccountDetailResponse = {
  properties: {
    providerAccount: {
      type: 'array',
      contains: {
        type: 'ProviderAccountDetail',
      },
      isReadOnly: true,
    },
  },
} as const;
