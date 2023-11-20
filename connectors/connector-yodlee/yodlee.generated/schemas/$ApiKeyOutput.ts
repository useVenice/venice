/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ApiKeyOutput = {
  properties: {
    expiresIn: {
      type: 'number',
      description: `Time in seconds after which the JWT token created for users expires.<br><br><b>Endpoints</b>:<ul><li>GET /auth/apiKey</li><li>POST /auth/apiKey</li></ul>`,
      format: 'int64',
    },
    createdDate: {
      type: 'string',
      description: `The date on which the apiKey was created for the customer.<br><br><b>Endpoints</b>:<ul><li>GET /auth/apiKey</li><li>POST /auth/apiKey</li></ul>`,
    },
    publicKey: {
      type: 'string',
      description: `Public key uploaded by the customer while generating ApiKey.<br><br><b>Endpoints</b>:<ul><li>GET /auth/apiKey</li><li>POST /auth/apiKey</li></ul>`,
      maxLength: 2147483647,
      minLength: 1,
    },
    key: {
      type: 'string',
      description: `ApiKey or the issuer key used to generate the JWT token for authentication.<br><br><b>Endpoints</b>:<ul><li>GET /auth/apiKey</li><li>POST /auth/apiKey</li></ul>`,
    },
  },
} as const
