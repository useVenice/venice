/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $AccountHolder = {
  properties: {
    identifier: {
      type: 'array',
      contains: {
        type: 'Identifier',
      },
      isReadOnly: true,
    },
    gender: {
      type: 'string',
      description: `Identifiers of the account holder.<br><br><b>Aggregated / Manual</b>: Aggregated <br><b>Applicable containers</b>: bank<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul>`,
      isReadOnly: true,
    },
    ownership: {
      type: 'Enum',
      isReadOnly: true,
    },
    name: {
      type: 'Name',
      description: `Name of the account holder.<br><br><b>Aggregated / Manual</b>: Aggregated <br><b>Applicable containers</b>: bank<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul>`,
      isReadOnly: true,
    },
  },
} as const
