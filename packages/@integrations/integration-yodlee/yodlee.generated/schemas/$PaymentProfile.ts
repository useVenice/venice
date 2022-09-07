/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $PaymentProfile = {
  properties: {
    identifier: {
      type: 'PaymentIdentifier',
      description: `The additional information such as platform code or payment reference number that is required to make payments.<br><b>Additional Details:</b>The identifier field applies only to the student loan account type.<br><br><b>Account Type</b>: Aggregated<br><b>Applicable containers</b>: loan<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul>`,
    },
    address: {
      type: 'array',
      contains: {
        type: 'AccountAddress',
      },
    },
    paymentBankTransferCode: {
      type: 'PaymentBankTransferCode',
      description: `The additional information for payment bank transfer code.<br><br><b>Applicable containers</b>: loan<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul>`,
    },
  },
} as const;
