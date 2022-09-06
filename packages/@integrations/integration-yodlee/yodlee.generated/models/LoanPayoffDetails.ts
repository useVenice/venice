/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Money } from './Money';

export type LoanPayoffDetails = {
  /**
   * The date by which the payoff amount should be paid.<br><br><b>Account Type</b>: Aggregated<br><b>Applicable containers</b>: loan<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul>
   */
  readonly payByDate?: string;
  /**
   * The loan payoff amount.<br><br><b>Account Type</b>: Aggregated<br><b>Applicable containers</b>: loan<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul>
   */
  readonly payoffAmount?: Money;
  /**
   * The outstanding balance on the loan account. The outstanding balance amount may differ from the payoff amount. It is usually the sum of outstanding principal, unpaid interest, and fees, if any.<br><br><b>Account Type</b>: Aggregated<br><b>Applicable containers</b>: loan<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul>
   */
  readonly outstandingBalance?: Money;
};

