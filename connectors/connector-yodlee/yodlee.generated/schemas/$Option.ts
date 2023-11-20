/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Option = {
  properties: {
    displayText: {
      type: 'string',
      description: `The text that is displayed to the user for that option in the provider site.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li><li>GET providers/{providerId}</li></ul>`,
    },
    optionValue: {
      type: 'string',
      description: `The value that is associated with the option.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li><li>GET providers/{providerId}</li></ul>`,
    },
    isSelected: {
      type: 'boolean',
      description: `The option that is selected by default in the provider site.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li><li>GET providers/{providerId}</li></ul>`,
    },
  },
} as const
