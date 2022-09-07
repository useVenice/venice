/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
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
} as const;
