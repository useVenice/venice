/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ClientCredentialToken = {
  properties: {
    expiresIn: {
      type: 'number',
      description: `Time in seconds after which the issued accessToken expires.<br><br><b>Endpoints</b>:<ul><li>POST /auth/token</li></ul>`,
      isReadOnly: true,
      format: 'int32',
    },
    issuedAt: {
      type: 'string',
      description: `The date and time on which accessToken was created for the customer.<br><br><b>Endpoints</b>:<ul><li>POST /auth/token</li></ul>`,
      isReadOnly: true,
    },
    accessToken: {
      type: 'string',
      description: `Access Token to access YSL 1.1 services.<br><br><b>Endpoints</b>:<ul><li>POST /auth/token</li></ul>`,
      isReadOnly: true,
    },
  },
} as const;
