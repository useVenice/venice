/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Coverage = {
  properties: {
    amount: {
      type: 'array',
      contains: {
        type: 'CoverageAmount',
      },
      isReadOnly: true,
    },
    planType: {
      type: 'Enum',
      isReadOnly: true,
    },
    endDate: {
      type: 'string',
      description: `The date on which the coverage for the account ends or expires.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: insurance,investment<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul>`,
      isReadOnly: true,
    },
    type: {
      type: 'Enum',
      isReadOnly: true,
    },
    startDate: {
      type: 'string',
      description: `The date on which the coverage for the account starts.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: insurance,investment<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul>`,
      isReadOnly: true,
    },
  },
} as const
