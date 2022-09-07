/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ApiKeyResponse = {
  properties: {
    apiKey: {
      type: 'array',
      contains: {
        type: 'ApiKeyOutput',
      },
    },
  },
} as const;
