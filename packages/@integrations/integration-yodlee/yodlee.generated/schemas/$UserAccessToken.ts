/* istanbul ignore file */
/* tslint:disable */
 
export const $UserAccessToken = {
  properties: {
    accessTokens: {
      type: 'array',
      contains: {
        type: 'AccessTokens',
      },
    },
  },
} as const
