/* istanbul ignore file */
/* tslint:disable */

export const $ProviderResponse = {
  properties: {
    provider: {
      type: 'array',
      contains: {
        type: 'Providers',
      },
      isReadOnly: true,
    },
  },
} as const
