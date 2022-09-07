/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $AccountDataset = {
  properties: {
    lastUpdated: {
      type: 'string',
      description: `Indicate when the dataset is last updated successfully for the given provider account.<br><br><b>Account Type</b>: Aggregated<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET providerAccounts</li><li>POST providerAccounts</li><li>PUT providerAccounts/{providerAccountId}</li><li>GET providerAccounts/{providerAccountId}</li></ul>`,
      isReadOnly: true,
    },
    updateEligibility: {
      type: 'Enum',
      isReadOnly: true,
    },
    additionalStatus: {
      type: 'Enum',
      isReadOnly: true,
    },
    nextUpdateScheduled: {
      type: 'string',
      description: `Indicates when the next attempt to update the dataset is scheduled.<br><br><b>Account Type</b>: Aggregated<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET providerAccounts</li><li>POST providerAccounts</li><li>PUT providerAccounts/{providerAccountId}</li><li>GET providerAccounts/{providerAccountId}</li></ul>`,
      isReadOnly: true,
    },
    name: {
      type: 'Enum',
    },
    lastUpdateAttempt: {
      type: 'string',
      description: `Indicate when the last attempt was performed to update the dataset for the given provider account<br><br><b>Account Type</b>: Aggregated<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET providerAccounts</li><li>POST providerAccounts</li><li>PUT providerAccounts/{providerAccountId}</li><li>GET providerAccounts/{providerAccountId}</li></ul>`,
      isReadOnly: true,
    },
  },
} as const;
