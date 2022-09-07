/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Profile = {
  properties: {
    identifier: {
      type: 'array',
      contains: {
        type: 'Identifier',
      },
      isReadOnly: true,
    },
    address: {
      type: 'array',
      contains: {
        type: 'AccountAddress',
      },
      isReadOnly: true,
    },
    phoneNumber: {
      type: 'array',
      contains: {
        type: 'PhoneNumber',
      },
      isReadOnly: true,
    },
    gender: {
      type: 'string',
      description: `Gender of the provider account holder.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Endpoints</b>:<ul><li>GET providerAccounts/profile</li></ul>`,
      isReadOnly: true,
    },
    name: {
      type: 'Name',
      description: `Name of the provider account holder.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Endpoints</b>:<ul><li>GET providerAccounts/profile</li></ul>`,
      isReadOnly: true,
    },
    email: {
      type: 'array',
      contains: {
        type: 'Email',
      },
      isReadOnly: true,
    },
  },
} as const;
