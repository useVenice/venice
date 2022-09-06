/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AccountAddress } from './AccountAddress';
import type { PaymentBankTransferCode } from './PaymentBankTransferCode';
import type { PaymentIdentifier } from './PaymentIdentifier';

export type PaymentProfile = {
  /**
   * The additional information such as platform code or payment reference number that is required to make payments.<br><b>Additional Details:</b>The identifier field applies only to the student loan account type.<br><br><b>Account Type</b>: Aggregated<br><b>Applicable containers</b>: loan<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul>
   */
  identifier?: PaymentIdentifier;
  /**
   * The address of the lender to which the monthly payments or the loan payoff amount should be paid. <br><b>Additional Details:</b>The address field applies only to the student loan account type.<br><b>Account Type</b>: Aggregated<br><b>Applicable containers</b>: loan<br><b>Endpoints</b>:<br><ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul>
   */
  address?: Array<AccountAddress>;
  /**
   * The additional information for payment bank transfer code.<br><br><b>Applicable containers</b>: loan<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul>
   */
  paymentBankTransferCode?: PaymentBankTransferCode;
};

