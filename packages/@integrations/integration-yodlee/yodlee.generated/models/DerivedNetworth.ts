/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DerivedNetworthHistoricalBalance } from './DerivedNetworthHistoricalBalance';
import type { Money } from './Money';

export type DerivedNetworth = {
  /**
   * The date as of when the networth information is provided.<br><br><b>Applicable containers</b>: bank, creditcard, investment, insurance, realEstate, loan<br>
   */
  readonly date?: string;
  /**
   * The liability amount that the user owes.<br><br><b>Applicable containers</b>: bank, creditcard, investment, insurance, realEstate, loan<br>
   */
  readonly liability?: Money;
  /**
   * Balances of the accounts over the period of time.<br><br><b>Applicable containers</b>: bank, creditcard, investment, insurance, realEstate, loan<br>
   */
  readonly historicalBalances?: Array<DerivedNetworthHistoricalBalance>;
  /**
   * Networth of the user.<br><br><b>Applicable containers</b>: bank, creditcard, investment, insurance, realEstate, loan<br>
   */
  readonly networth?: Money;
  /**
   * The asset value that the user owns.<br><br><b>Applicable containers</b>: bank, creditcard, investment, insurance, realEstate, loan<br>
   */
  readonly asset?: Money;
};

