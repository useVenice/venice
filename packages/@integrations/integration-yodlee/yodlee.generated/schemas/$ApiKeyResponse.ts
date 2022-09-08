/* istanbul ignore file */
/* tslint:disable */
 
export const $ApiKeyResponse = {
  properties: {
    apiKey: {
      type: 'array',
      contains: {
        type: 'ApiKeyOutput',
      },
    },
  },
} as const
