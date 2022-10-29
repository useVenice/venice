/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $CoverageAmount = {
  properties: {
    cover: {
      type: 'Money',
      description: `The maximum amount that will be paid to an individual or an entity for a covered loss<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: insurance,investment<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul>`,
      isReadOnly: true,
    },
    unitType: {
      type: 'Enum',
      isReadOnly: true,
    },
    type: {
      type: 'Enum',
      isReadOnly: true,
    },
    limitType: {
      type: 'Enum',
      isReadOnly: true,
    },
    met: {
      type: 'Money',
      description: `The amount the insurance company paid for the incurred medical expenses.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: insurance,investment<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul>`,
      isReadOnly: true,
    },
  },
} as const
