/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $VerificationBankTransferCode = {
  properties: {
    id: {
      type: 'string',
      description: `The FI's branch identification number.Additional Details: The routing number of the bank account in the United States. For non-United States accounts, it is the IFSC code (India), BSB number (Australia), and sort code (United Kingdom). <br><b>Account Type</b>: Aggregated<br><b>Applicable containers</b>: bank, investment<br><b>Endpoints</b>:<br><ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>POST verification</li></ul>`,
    },
    type: {
      type: 'Enum',
    },
  },
} as const;
