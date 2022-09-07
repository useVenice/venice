/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $LoanPayoffDetails = {
  properties: {
    payByDate: {
      type: 'string',
      description: `The date by which the payoff amount should be paid.<br><br><b>Account Type</b>: Aggregated<br><b>Applicable containers</b>: loan<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul>`,
      isReadOnly: true,
    },
    payoffAmount: {
      type: 'Money',
      description: `The loan payoff amount.<br><br><b>Account Type</b>: Aggregated<br><b>Applicable containers</b>: loan<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul>`,
      isReadOnly: true,
    },
    outstandingBalance: {
      type: 'Money',
      description: `The outstanding balance on the loan account. The outstanding balance amount may differ from the payoff amount. It is usually the sum of outstanding principal, unpaid interest, and fees, if any.<br><br><b>Account Type</b>: Aggregated<br><b>Applicable containers</b>: loan<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul>`,
      isReadOnly: true,
    },
  },
} as const;
