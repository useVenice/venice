/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { StockExchangeDetail } from './StockExchangeDetail';

export type Security = {
  /**
   * Securities exchange provide the securities information at the corresponding exchanges. <br><br><b>Applicable containers</b>: investment, insurance<br>
   */
  readonly stockExchangeDetails?: Array<StockExchangeDetail>;
  /**
   * Price units corresponding to the security style. This is used to derive actual price of the security from market value.<br><br><b>Applicable containers</b>: investment, insurance<br>
   */
  readonly issueTypeMultiplier?: number;
  /**
   * The state in which the security is taxed.<br><br><b>Applicable containers</b>: investment, insurance<br>
   */
  readonly stateTaxable?: boolean;
  /**
   * Next call date of the security.<br><br><b>Applicable containers</b>: investment, insurance<br>
   */
  readonly callDate?: string;
  /**
   * cdsc fund flag of the security.<br><br><b>Applicable containers</b>: investment, insurance<br>
   */
  readonly cdscFundFlag?: boolean;
  /**
   * A CUSIP is a nine-character alphanumeric code that identifies a North American financial security for the purposes of facilitating clearing and settlement of trades.<br><br><b>Applicable containers</b>: investment, insurance<br>
   */
  readonly cusip?: string;
  /**
   * Flag indicating federal taxable.<br><br><b>Applicable containers</b>: investment, insurance<br>
   */
  readonly federalTaxable?: boolean;
  /**
   * Unique identifier for S&P rating on Envestnet platform.<br><br><b>Applicable containers</b>: investment, insurance<br>
   */
  readonly sAndPRating?: string;
  /**
   * Share class of the security.<br><br><b>Applicable containers</b>: investment, insurance<br>
   */
  readonly shareClass?: string;
  /**
   * Flag indicating a dummy security.<br><br><b>Applicable containers</b>: investment, insurance<br>
   */
  readonly isEnvestnetDummySecurity?: boolean;
  /**
   * The description (name) of the security. For example, Cisco Systems.<br><br><b>Applicable containers</b>: investment, insurance<br>
   */
  readonly description?: string;
  /**
   * Minimum purchase of security.<br><br><b>Applicable containers</b>: investment, insurance<br>
   */
  readonly minimumPurchase?: number;
  /**
   * Indicates the type of security like stocks, mutual fund, etc. <br><br><b>Applicable containers</b>: investment, insurance<br>
   */
  readonly type?: string;
  /**
   * First coupon date of security.<br><br><b>Applicable containers</b>: investment, insurance<br>
   */
  readonly firstCouponDate?: string;
  /**
   * Coupon Frequency.<br><br><b>Applicable containers</b>: investment, insurance<br>
   */
  readonly frequency?: number;
  /**
   * The method in which interest is accrued or earned.<br><br><b>Applicable containers</b>: investment, insurance<br>
   */
  readonly accrualMethod?: string;
  /**
   * ISO 4217 currency code indicating income currency of the security.<br><br><b>Applicable containers</b>: investment, insurance<br>
   */
  readonly incomeCurrency?: string;
  /**
   * Maturity date of the security.<br><br><b>Applicable containers</b>: investment, insurance<br>
   */
  readonly maturityDate?: string;
  /**
   * Next call price of the security.<br><br><b>Applicable containers</b>: investment, insurance<br>
   */
  readonly callPrice?: number;
  /**
   * The unique identifier of the security.<br><br><b>Applicable containers</b>: investment, insurance<br>
   */
  readonly id?: number;
  /**
   * Issue date of the security.<br><br><b>Applicable containers</b>: investment, insurance<br>
   */
  readonly issueDate?: string;
  /**
   * Identifier of the sector to which the security belongs to.<br><br><b>Applicable containers</b>: investment, insurance<br>
   */
  readonly sector?: string;
  /**
   * Agency factor of the security.<br><br><b>Applicable containers</b>: investment, insurance<br>
   */
  readonly agencyFactor?: number;
  /**
   * The rate of interest paid annually, expressed as a percentage of the bond's par or face value.<br><br><b>Applicable containers</b>: investment, insurance<br>
   */
  readonly interestRate?: number;
  /**
   * The last updated date of the security.<br><br><b>Applicable containers</b>: investment, insurance<br>
   */
  readonly lastModifiedDate?: string;
  /**
   * GICS Sector is a categorization the S&P assigns to all publically traded companies. <br><br><b>Applicable containers</b>: investment, insurance<br>
   */
  readonly gicsSector?: string;
  /**
   * <b>true</b>:Closed for all investors , <b>false</b>: Open to all investors.<br><br><b>Applicable containers</b>: investment, insurance<br>
   */
  readonly closedFlag?: boolean;
  /**
   * The Stock Exchange Daily Official List (SEDOL) is a set of security identifiers used in the United Kingdom and Ireland for clearing purposes.<br><b>Note</b>: The SEDOL field is only applicable to the trade related transactions.<br><br><b>Applicable containers</b>: investment, insurance<br>
   */
  readonly sedol?: string;
  /**
   * GICS sector ID to which the security belongs to.<br><br><b>Applicable containers</b>: investment, insurance<br>
   */
  readonly subSector?: string;
  /**
   * Last coupon date of security.<br><br><b>Applicable containers</b>: investment, insurance<br>
   */
  readonly lastCouponDate?: string;
  /**
   * Indicates whether the security is a simulated security.<br><br><b>Applicable containers</b>: investment, insurance<br>
   */
  readonly isSyntheticSecurity?: boolean;
  /**
   * ISO 4217 currency code indicating trading currency of the security.<br><br><b>Applicable containers</b>: investment, insurance<br>
   */
  readonly tradeCurrencyCode?: string;
  /**
   * Indicates whether the security is a dummy security.<br><br><b>Applicable containers</b>: investment, insurance<br>
   */
  readonly isDummySecurity?: boolean;
  /**
   * Unique identifier for Moody rating on Envestnet platform.<br><br><b>Applicable containers</b>: investment, insurance<br>
   */
  readonly moodyRating?: string;
  /**
   * Classification of the style for the security.<br><br><b>Applicable containers</b>: investment, insurance<br>
   */
  readonly style?: string;
  /**
   * <b>1</b>- indicates Eligible,<b>0</b>- indicates firm is not eligible.<br><br><b>Applicable containers</b>: investment, insurance<br>
   */
  readonly firmEligible?: string;
  /**
   * Mutual Fund Family Name.<br><br><b>Applicable containers</b>: investment, insurance<br>
   */
  readonly fundFamily?: string;
  /**
   * The International Securities Identification Number (ISIN) is used worldwide to identify specific securities. It is equivalent to CUSIP for international markets.<br><br><b>Applicable containers</b>: investment, insurance<br>
   */
  readonly isin?: string;
};

