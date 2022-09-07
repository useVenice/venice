/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ApiKeyRequest = {
  properties: {
    publicKey: {
      type: 'string',
      description: `Public key uploaded by the customer while generating ApiKey.<br><br><b>Endpoints</b>:<ul><li>GET /auth/apiKey</li><li>POST /auth/apiKey</li></ul>`,
      maxLength: 2147483647,
      minLength: 1,
    },
  },
} as const;
