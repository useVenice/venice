/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DerivedHolding } from './DerivedHolding';
import type { DerivedHoldingsAccount } from './DerivedHoldingsAccount';
import type { Money } from './Money';

export type DerivedHoldingsSummary = {
  /**
   * Securities that belong to the asset classification type and contributed to the summary value.<br><b>Required Feature Enablement</b>: Asset classification feature.<br><br><b>Applicable containers</b>: investment, insurance<br>
   */
  readonly holding?: Array<DerivedHolding>;
  /**
   * The classification type of the security. The supported asset classification type and the values are provided in the /holdings/assetClassificationList.<br><b>Required Feature Enablement</b>: Asset classification feature.<br><br><b>Applicable containers</b>: investment, insurance<br>
   */
  readonly classificationType?: string;
  /**
   * The classification value that corresponds to the classification type of the holding. The supported asset classification type and the values are provided in the /holdings/assetClassificationList.<br><b>Required Feature Enablement</b>: Asset classification feature.<br><br><b>Applicable containers</b>: investment, insurance<br>
   */
  readonly classificationValue?: string;
  /**
   * Summary value of the securities.<br><b>Required Feature Enablement</b>: Asset classification feature.<br><br><b>Applicable containers</b>: investment, insurance<br>
   */
  readonly value?: Money;
  /**
   * Accounts that contribute to the classification. <br><b>Required Feature Enablement</b>: Asset classification feature.<br><br><b>Applicable containers</b>: investment, insurance<br>
   */
  readonly account?: Array<DerivedHoldingsAccount>;
};

