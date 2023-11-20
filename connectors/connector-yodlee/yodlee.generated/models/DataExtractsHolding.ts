/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type {Money} from './Money'

export type DataExtractsHolding = {
  /**
   * The symbol of the security.<br><br><b>Applicable containers</b>: investment<br>
   */
  readonly symbol?: string
  /**
   * The quantity of the employee stock options that are already exercised or bought by the employee.<br><b>Note</b>: Once the employee stock options is exercised, they are either converted to cash value or equity positions depending on the FI. The exercised quantity field is only applicable to employee stock options.<br><br><b>Applicable containers</b>: investment<br>
   */
  readonly exercisedQuantity?: number
  /**
   * The CUSIP (Committee on Uniform Securities Identification Procedures) identifies most the financial instruments in the United States and Canada.<br><br><b>Applicable containers</b>: investment<br>
   */
  readonly cusipNumber?: string
  /**
   * The quantity of units or shares that are already vested on a vest date.<br><b>Note</b>: The vested quantity field is only applicable to employee stock options, restricted stock units/awards, performance units, etc.<br><br><b>Applicable containers</b>: investment<br>
   */
  readonly vestedQuantity?: number
  /**
   * The description (name) for the holding (E.g., Cisco Systems)<br>For insurance container, the field is only applicable for insurance annuity and variable life insurance types. <br><br><b>Applicable containers</b>: investment, insurance<br>
   */
  readonly description?: string
  /**
   * Indicates the estimated market value of the unvested units.<br><b>Note</b>: FIs usually calculates the unvested value as the market price unvested quantity. The unvested value field is only applicable to employee stock options, restricted stock units/awards, performance units, etc.<br><br><b>Applicable containers</b>: investment<br>
   */
  readonly unvestedValue?: Money
  /**
   * Indicates the security style of holding identified through the security service.<br><br><b>Applicable containers</b>: investment, insurance<br>
   */
  readonly securityStyle?: string
  /**
   * Indicates the estimated market value of the vested units.<br><b>Note</b>: FIs usually calculates the vested value as the market price vested quantity. The vested value field is only applicable to employee stock options, restricted stock units/awards, performance units, etc.<br><br><b>Applicable containers</b>: investment<br>
   */
  readonly vestedValue?: Money
  /**
   * The type of the option position (i.e., put or call).<br><b>Note</b>: The option type field is only applicable to options.<br><br><b>Applicable containers</b>: investment<br><b>Applicable Values</b><br>
   */
  readonly optionType?: 'put' | 'call' | 'unknown' | 'other'
  /**
   * The date when the information was last updated in the system.<br><br><b>Applicable containers</b>: investment, insurance<br>
   */
  readonly lastUpdated?: string
  /**
   * Indicates the security match status id of the investment option identified during security normalization.<br><br><b>Applicable containers</b>: investment<br>
   */
  readonly matchStatus?: string
  /**
   * Type of holding<br><br><b>Applicable containers</b>: investment, insurance<br>
   */
  readonly holdingType?:
    | 'stock'
    | 'mutualFund'
    | 'bond'
    | 'CD'
    | 'option'
    | 'moneyMarketFund'
    | 'other'
    | 'remic'
    | 'future'
    | 'commodity'
    | 'currency'
    | 'unitInvestmentTrust'
    | 'employeeStockOption'
    | 'insuranceAnnuity'
    | 'unknown'
    | 'preferredStock'
    | 'ETF'
    | 'warrants'
    | 'digitalAsset'
  /**
   * The stated maturity date of a bond or CD.<br><br><b>Applicable containers</b>: investment<br>
   */
  readonly maturityDate?: string
  /**
   * The current price of the security.<br><b>Note</b>: Only for bonds the price field indicates the normalized price and not the price aggregated from the site. For insurance container, the field is only applicable for insurance annuity and variable life insurance types.<br><br><b>Applicable containers</b>: investment, insurance<br>
   */
  readonly price?: Money
  /**
   * The fixed duration for which the bond or CD is issued.<br><b>Note</b>: The term field is only applicable to CD.<br><br><b>Applicable containers</b>: investment<br>
   */
  readonly term?: string
  /**
   * The quantity of tradeable units in a contract.<br><b>Note</b>: The contract quantity field is only applicable to commodity and currency.<br><br><b>Applicable containers</b>: investment<br>
   */
  readonly contractQuantity?: number
  /**
   * Unique identifier for the security added in the system. This is the primary key of the holding resource.<br><br><b>Applicable containers</b>: investment, insurance<br>
   */
  readonly id?: number
  /**
   * Indicates that the holding is a short trading.<br><br><b>Applicable containers</b>: investment<br>
   */
  readonly isShort?: boolean
  /**
   * The total market value of the security. For insurance container, the field is only applicable for insurance annuity and variable life insurance types.<br><br><b>Applicable containers</b>: investment, insurance<br>
   */
  readonly value?: Money
  /**
   * The date on which an option, right or warrant expires.<br><b>Note</b>: The expiration date field is only applicable to options and employee stock options.<br><br><b>Applicable containers</b>: investment<br>
   */
  readonly expirationDate?: string
  /**
   * The interest rate on a CD.<br><b>Note</b>: The interest rate field is only applicable to CD.<br><br><b>Applicable containers</b>: investment<br>
   */
  readonly interestRate?: number
  /**
   * The quantity held for the holding.<br><b>Note</b>: Only for bonds the quantity field indicates the normalized quantity and not the quantity aggregated from the site. The quantity field is only applicable to restricted stock units/awards, performance units, currency, and commodity.<br>For insurance container, the field is only applicable for insurance annuity and variable life insurance types.<br><br><b>Applicable containers</b>: investment, insurance<br>
   */
  readonly quantity?: number
  /**
   * The accruedInterest of the  holding.<br><br><b>Applicable containers</b>: investment<br>
   */
  readonly accruedInterest?: Money
  /**
   * The date on which equity awards like ESOP, RSU, etc., are issued or granted.<br><b>Note</b>: The grant date field is only applicable to employee stock options, restricted stock units/awards, performance units, etc.<br><br><b>Applicable containers</b>: investment<br>
   */
  readonly grantDate?: string
  /**
   * The SEDOL (Stock Exchange Daily Official List) is a set of security identifiers used in the United Kingdom and Ireland for clearing purposes.<br><b>Note</b>: The SEDOL field is only applicable to the trade related transactions<br><br><b>Applicable containers</b>: investment<br>
   */
  readonly sedol?: string
  /**
   * The number of vested shares that can be exercised by the employee. It is usually equal to the vested quantity.<br><b>Note</b>: The vested shares exercisable field is only applicable to employee stock options, restricted stock units/awards, performance units, etc.<br><br><b>Applicable containers</b>: investment<br>
   */
  readonly vestedSharesExercisable?: number
  /**
   * The difference between the current market value of a stock and the strike price of the employee stock option, when the market value of the shares are greater than the stock price.<br><b>Note</b>: The spread field is only applicable to employee stock options.<br><br><b>Applicable containers</b>: investment<br>
   */
  readonly spread?: Money
  /**
   * Unique identifier of the account to which the security is linked.<br><br><b>Applicable containers</b>: investment, insurance<br>
   */
  readonly accountId?: number
  /**
   * The enrichedDescription is the security description of the normalized holding<br><br><b>Applicable containers</b>: investment, insurance<br>
   */
  readonly enrichedDescription?: string
  /**
   * The stated interest rate for a bond.<br><br><b>Applicable containers</b>: investment<br>
   */
  readonly couponRate?: number
  /**
   * The date on which the holding is created in the Yodlee system.<br><br><b>Applicable containers</b>: investment, insurance<br>
   */
  readonly createdDate?: string
  /**
   * The accruedIncome of the  holding.<br><br><b>Applicable containers</b>: investment<br>
   */
  readonly accruedIncome?: Money
  /**
   * Indicates the security type of holding identified through the security service.<br><br><b>Applicable containers</b>: investment, insurance<br>
   */
  readonly securityType?: string
  /**
   * Unique identifier for the user's association with the provider.<br><br><b>Applicable containers</b>: investment, insurance<br>
   */
  readonly providerAccountId?: number
  /**
   * Indicates the number of unvested quantity or units.<br><b>Note</b>: The unvested quantity field is only applicable to employee stock options, restricted stock units/awards, performance units, etc.<br><br><b>Applicable containers</b>: investment<br>
   */
  readonly unvestedQuantity?: number
  /**
   * In a one-off security purchase, the cost basis is the quantity acquired multiplied by the price per unit paid plus any commission paid. In case, the same position is acquired in different lots on different days at different prices, the sum total of the cost incurred is divided by the total units acquired to arrive at the average cost basis.<br><br><b>Applicable containers</b>: investment<br>
   */
  readonly costBasis?: Money
  /**
   * The date on which a RSU, RSA, or an employee stock options become vested.<br><b>Note</b>: The vesting date field is only applicable to employee stock options, restricted stock units/awards, performance units, etc.<br><br><b>Applicable containers</b>: investment<br>
   */
  readonly vestingDate?: string
  /**
   * The ISIN (International Securities Identification Number) is used worldwide to identify specific securities. It is equivalent to CUSIP for international markets.<br><br><b>Note</b>: The ISIN field is only applicable to the trade related transactions<br><br><b>Applicable containers</b>: investment<br>
   */
  readonly isin?: string
  /**
   * The strike (exercise) price for the option position.<br><b>Note</b>: The strike price field is only applicable to options and employee stock options.<br><br><b>Applicable containers</b>: investment<br>
   */
  readonly strikePrice?: Money
}
