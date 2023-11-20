/* istanbul ignore file */
/* tslint:disable */

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
} as const
