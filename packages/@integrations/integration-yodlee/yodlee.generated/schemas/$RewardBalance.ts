/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $RewardBalance = {
  properties: {
    expiryDate: {
      type: 'string',
      description: `The date on which the balance expires.<br><br><b>Account Type</b>: Aggregated<br><b>Applicable containers</b>: reward<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>`,
      isReadOnly: true,
    },
    balanceToReward: {
      type: 'string',
      description: `The balance required to qualify for a reward such as retaining membership, business reward, etc.<br><br><b>Account Type</b>: Aggregated<br><b>Applicable containers</b>: reward<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>`,
      isReadOnly: true,
    },
    balanceType: {
      type: 'Enum',
      isReadOnly: true,
    },
    balance: {
      type: 'number',
      description: `The actual reward balance.<br><br><b>Account Type</b>: Aggregated<br><b>Applicable containers</b>: reward<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>`,
      isReadOnly: true,
      format: 'double',
    },
    description: {
      type: 'string',
      description: `The description for the reward balance as available at provider source.<br><br><b>Account Type</b>: Aggregated<br><b>Applicable containers</b>: reward<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>`,
      isReadOnly: true,
    },
    balanceToLevel: {
      type: 'string',
      description: `The balance required to reach a reward level.<br><br><b>Account Type</b>: Aggregated<br><b>Applicable containers</b>: reward<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>`,
      isReadOnly: true,
    },
    units: {
      type: 'string',
      description: `Unit of reward balance - miles, points, segments, dollars, credits.<br><br><b>Account Type</b>: Aggregated<br><b>Applicable containers</b>: reward<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>`,
      isReadOnly: true,
    },
  },
} as const;
