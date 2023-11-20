/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type StockExchangeDetail = {
  /**
   * Ticker symbol representing particular securities listed on an exchange.<br><br><b>Applicable containers</b>: investment, insurance<br>
   */
  readonly symbol?: string
  /**
   * Country codes are geocodes developed to represent countries and dependent areas.<br><br><b>Applicable containers</b>: investment, insurance<br>
   */
  readonly countryCode?: string
  /**
   * ISO codes of currency.<br><br><b>Applicable containers</b>: investment, insurance<br>
   */
  readonly currencyCode?: string
  /**
   * An Exchange code is a four-character code used to identify stock markets and other trading exchanges within global trading.<br><br><b>Applicable containers</b>: investment, insurance<br>
   */
  readonly exchangeCode?: string
}
