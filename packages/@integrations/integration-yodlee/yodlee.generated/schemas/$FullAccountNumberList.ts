/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $FullAccountNumberList = {
  properties: {
    paymentAccountNumber: {
      type: 'string',
      description: `Payment Account Number of given account.<br><br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul>`,
      isReadOnly: true,
    },
    unmaskedAccountNumber: {
      type: 'string',
      description: `Unmasked account number of given account.<br><br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul>`,
      isReadOnly: true,
    },
  },
} as const;
