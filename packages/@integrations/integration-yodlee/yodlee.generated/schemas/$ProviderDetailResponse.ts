/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ProviderDetailResponse = {
  properties: {
    provider: {
      type: 'array',
      contains: {
        type: 'ProviderDetail',
      },
      isReadOnly: true,
    },
  },
} as const;
