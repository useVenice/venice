/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ConfigsPublicKey = {
  properties: {
    alias: {
      type: 'string',
      description: `The key name used for encryption.<br><br><b>Endpoints</b>:<ul><li>GET configs/publicKey</li></ul>`,
      isReadOnly: true,
    },
    key: {
      type: 'string',
      description: `Public key that the customer should be using to encrypt the credentials and answers before sending to the add and update providerAccounts APIs.<br><br><b>Endpoints</b>:<ul><li>GET configs/publicKey</li></ul>`,
      isReadOnly: true,
    },
  },
} as const
