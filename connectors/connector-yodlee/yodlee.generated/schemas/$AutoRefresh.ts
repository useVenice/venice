/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $AutoRefresh = {
  properties: {
    additionalStatus: {
      type: 'Enum',
      isReadOnly: true,
    },
    asOfDate: {
      type: 'string',
      description: `Date on which the auto refresh status is determined.<br><br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul>`,
      isReadOnly: true,
    },
    status: {
      type: 'Enum',
      isReadOnly: true,
    },
  },
} as const
