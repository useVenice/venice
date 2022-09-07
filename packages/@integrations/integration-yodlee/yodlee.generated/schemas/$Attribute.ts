/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Attribute = {
  properties: {
    container: {
      type: 'array',
      contains: {
        type: 'Enum',
      },
    },
    fromDate: {
      type: 'string',
      description: `Applicable only to EBILLS and STATEMENTS attributes of DOCUMENT dataset.<br><br><b>Endpoints</b>:<ul><li>POST providerAccounts</li><li>PUT providerAccounts</li></ul>`,
      isReadOnly: true,
    },
    toFinYear: {
      type: 'string',
      description: `Applicable only to TAX attribute of DOCUMENT dataset.<br><br><b>Endpoints</b>:<ul><li>POST providerAccounts</li><li>PUT providerAccounts</li></ul>`,
      isReadOnly: true,
    },
    fromFinYear: {
      type: 'string',
      description: `Applicable only to TAX attribute of DOCUMENT dataset.<br><br><b>Endpoints</b>:<ul><li>POST providerAccounts</li><li>PUT providerAccounts</li></ul>`,
      isReadOnly: true,
    },
    containerAttributes: {
      type: 'ContainerAttributes',
      description: `Applicable only to TRANSACTIONS attributes of BASIC_AGG_DATA dataset.<br><br><b>Endpoints</b>:<ul><li>GET providers</li><li>GET providers/{providerId}</li><li>POST providerAccounts</li><li>PUT providerAccounts</li></ul>`,
      isReadOnly: true,
    },
    toDate: {
      type: 'string',
      description: `Applicable only to EBILLS and STATEMENTS attributes of DOCUMENT dataset.<br><br><b>Endpoints</b>:<ul><li>POST providerAccounts</li><li>PUT providerAccounts</li></ul>`,
      isReadOnly: true,
    },
    name: {
      type: 'Enum',
    },
  },
} as const;
