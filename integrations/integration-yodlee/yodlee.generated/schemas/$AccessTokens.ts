/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $AccessTokens = {
  properties: {
    appId: {
      type: 'string',
      description: `The identifier of the application for which the access token is generated.<br><br><b>Endpoints</b>:<ul><li>GET user/accessTokens</li></ul>`,
    },
    value: {
      type: 'string',
      description: `Access token value used to invoke the widgets/apps.<br><br><b>Endpoints</b>:<ul><li>GET user/accessTokens</li></ul>`,
    },
    url: {
      type: 'string',
      description: `Base URL using which the application is accessed.<br><br><b>Endpoints</b>:<ul><li>GET user/accessTokens</li></ul>`,
    },
  },
} as const
