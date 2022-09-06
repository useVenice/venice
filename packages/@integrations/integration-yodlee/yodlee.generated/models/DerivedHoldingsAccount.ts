/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Money } from './Money';

export type DerivedHoldingsAccount = {
  /**
   * The primary key of the account resource and the unique identifier for the account.<br>Required Feature Enablement: Asset classification feature.<br><br><b>Applicable containers</b>: investment, insurance<br>
   */
  readonly id?: number;
  /**
   * The investment accounts cash balance.<br>Required Feature Enablement: Asset classification feature.<br><br><b>Applicable containers</b>: investment, insurance<br>
   */
  readonly value?: Money;
};

