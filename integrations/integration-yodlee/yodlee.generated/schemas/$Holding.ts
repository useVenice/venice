/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Holding = {
  properties: {
    symbol: {
      type: 'string',
      description: `The symbol of the security.<br><br><b>Applicable containers</b>: investment<br>`,
      isReadOnly: true,
    },
    exercisedQuantity: {
      type: 'number',
      description: `The quantity of the employee stock options that are already exercised or bought by the employee.<br><b>Note</b>: Once the employee stock options is exercised, they are either converted to cash value or equity positions depending on the FI. The exercised quantity field is only applicable to employee stock options.<br><br><b>Applicable containers</b>: investment<br>`,
      isReadOnly: true,
      format: 'double',
    },
    cusipNumber: {
      type: 'string',
      description: `The CUSIP (Committee on Uniform Securities Identification Procedures) identifies most the financial instruments in the United States and Canada.<br><br><b>Applicable containers</b>: investment<br>`,
      isReadOnly: true,
    },
    assetClassification: {
      type: 'array',
      contains: {
        type: 'AssetClassification',
      },
      isReadOnly: true,
    },
    vestedQuantity: {
      type: 'number',
      description: `The quantity of units or shares that are already vested on a vest date.<br><b>Note</b>: The vested quantity field is only applicable to employee stock options, restricted stock units/awards, performance units, etc.<br><br><b>Applicable containers</b>: investment<br>`,
      isReadOnly: true,
      format: 'double',
    },
    description: {
      type: 'string',
      description: `The description (name) for the holding (E.g., Cisco Systems)<br>For insurance container, the field is only applicable for insurance annuity and variable life insurance types. <br><br><b>Applicable containers</b>: investment, insurance<br>`,
      isReadOnly: true,
    },
    unvestedValue: {
      type: 'Money',
      description: `Indicates the estimated market value of the unvested units.<br><b>Note</b>: FIs usually calculates the unvested value as the market price unvested quantity. The unvested value field is only applicable to employee stock options, restricted stock units/awards, performance units, etc.<br><br><b>Applicable containers</b>: investment<br>`,
      isReadOnly: true,
    },
    securityStyle: {
      type: 'string',
      description: `Indicates the security style of holding identified through the security service.<br><br><b>Applicable containers</b>: investment, insurance<br>`,
      isReadOnly: true,
    },
    vestedValue: {
      type: 'Money',
      description: `Indicates the estimated market value of the vested units.<br><b>Note</b>: FIs usually calculates the vested value as the market price vested quantity. The vested value field is only applicable to employee stock options, restricted stock units/awards, performance units, etc.<br><br><b>Applicable containers</b>: investment<br>`,
      isReadOnly: true,
    },
    optionType: {
      type: 'Enum',
      isReadOnly: true,
    },
    lastUpdated: {
      type: 'string',
      description: `The date when the information was last updated in the system.<br><br><b>Applicable containers</b>: investment, insurance<br>`,
      isReadOnly: true,
    },
    matchStatus: {
      type: 'string',
      description: `Indicates the security match status id of the investment option identified during security normalization.<br><br><b>Applicable containers</b>: investment<br>`,
      isReadOnly: true,
    },
    holdingType: {
      type: 'Enum',
      isReadOnly: true,
    },
    maturityDate: {
      type: 'string',
      description: `The stated maturity date of a bond or CD.<br><br><b>Applicable containers</b>: investment<br>`,
      isReadOnly: true,
    },
    price: {
      type: 'Money',
      description: `The current price of the security.<br><b>Note</b>: Only for bonds the price field indicates the normalized price and not the price aggregated from the site. For insurance container, the field is only applicable for insurance annuity and variable life insurance types.<br><br><b>Applicable containers</b>: investment, insurance<br>`,
      isReadOnly: true,
    },
    term: {
      type: 'string',
      description: `The fixed duration for which the bond or CD is issued.<br><b>Note</b>: The term field is only applicable to CD.<br><br><b>Applicable containers</b>: investment<br>`,
      isReadOnly: true,
    },
    contractQuantity: {
      type: 'number',
      description: `The quantity of tradeable units in a contract.<br><b>Note</b>: The contract quantity field is only applicable to commodity and currency.<br><br><b>Applicable containers</b>: investment<br>`,
      isReadOnly: true,
      format: 'double',
    },
    id: {
      type: 'number',
      description: `Unique identifier for the security added in the system. This is the primary key of the holding resource.<br><br><b>Applicable containers</b>: investment, insurance<br>`,
      isReadOnly: true,
      format: 'int64',
    },
    isShort: {
      type: 'boolean',
      description: `Indicates that the holding is a short trading.<br><br><b>Applicable containers</b>: investment<br>`,
      isReadOnly: true,
    },
    value: {
      type: 'Money',
      description: `The total market value of the security. For insurance container, the field is only applicable for insurance annuity and variable life insurance types.<br><br><b>Applicable containers</b>: investment, insurance<br>`,
      isReadOnly: true,
    },
    expirationDate: {
      type: 'string',
      description: `The date on which an option, right or warrant expires.<br><b>Note</b>: The expiration date field is only applicable to options and employee stock options.<br><br><b>Applicable containers</b>: investment<br>`,
      isReadOnly: true,
    },
    interestRate: {
      type: 'number',
      description: `The interest rate on a CD.<br><b>Note</b>: The interest rate field is only applicable to CD.<br><br><b>Applicable containers</b>: investment<br>`,
      isReadOnly: true,
      format: 'double',
    },
    quantity: {
      type: 'number',
      description: `The quantity held for the holding.<br><b>Note</b>: Only for bonds the quantity field indicates the normalized quantity and not the quantity aggregated from the site. The quantity field is only applicable to restricted stock units/awards, performance units, currency, and commodity.<br>For insurance container, the field is only applicable for insurance annuity and variable life insurance types.<br><br><b>Applicable containers</b>: investment, insurance<br>`,
      isReadOnly: true,
      format: 'double',
    },
    accruedInterest: {
      type: 'Money',
      description: `The accruedInterest of the  holding.<br><br><b>Applicable containers</b>: investment<br>`,
      isReadOnly: true,
    },
    grantDate: {
      type: 'string',
      description: `The date on which equity awards like ESOP, RSU, etc., are issued or granted.<br><b>Note</b>: The grant date field is only applicable to employee stock options, restricted stock units/awards, performance units, etc.<br><br><b>Applicable containers</b>: investment<br>`,
      isReadOnly: true,
    },
    sedol: {
      type: 'string',
      description: `The SEDOL (Stock Exchange Daily Official List) is a set of security identifiers used in the United Kingdom and Ireland for clearing purposes.<br><b>Note</b>: The SEDOL field is only applicable to the trade related transactions<br><br><b>Applicable containers</b>: investment<br>`,
      isReadOnly: true,
    },
    vestedSharesExercisable: {
      type: 'number',
      description: `The number of vested shares that can be exercised by the employee. It is usually equal to the vested quantity.<br><b>Note</b>: The vested shares exercisable field is only applicable to employee stock options, restricted stock units/awards, performance units, etc.<br><br><b>Applicable containers</b>: investment<br>`,
      isReadOnly: true,
      format: 'double',
    },
    spread: {
      type: 'Money',
      description: `The difference between the current market value of a stock and the strike price of the employee stock option, when the market value of the shares are greater than the stock price.<br><b>Note</b>: The spread field is only applicable to employee stock options.<br><br><b>Applicable containers</b>: investment<br>`,
      isReadOnly: true,
    },
    accountId: {
      type: 'number',
      description: `Unique identifier of the account to which the security is linked.<br><br><b>Applicable containers</b>: investment, insurance<br>`,
      isReadOnly: true,
      format: 'int64',
    },
    enrichedDescription: {
      type: 'string',
      description: `The enrichedDescription is the security description of the normalized holding<br><br><b>Applicable containers</b>: investment, insurance<br>`,
      isReadOnly: true,
    },
    couponRate: {
      type: 'number',
      description: `The stated interest rate for a bond.<br><br><b>Applicable containers</b>: investment<br>`,
      isReadOnly: true,
      format: 'double',
    },
    createdDate: {
      type: 'string',
      description: `The date on which the holding is created in the Yodlee system.<br><br><b>Applicable containers</b>: investment, insurance<br>`,
      isReadOnly: true,
    },
    accruedIncome: {
      type: 'Money',
      description: `The accruedIncome of the  holding.<br><br><b>Applicable containers</b>: investment<br>`,
      isReadOnly: true,
    },
    securityType: {
      type: 'string',
      description: `Indicates the security type of holding identified through the security service.<br><br><b>Applicable containers</b>: investment, insurance<br>`,
      isReadOnly: true,
    },
    providerAccountId: {
      type: 'number',
      description: `Unique identifier for the user's association with the provider.<br><br><b>Applicable containers</b>: investment, insurance<br>`,
      isReadOnly: true,
      format: 'int64',
    },
    unvestedQuantity: {
      type: 'number',
      description: `Indicates the number of unvested quantity or units.<br><b>Note</b>: The unvested quantity field is only applicable to employee stock options, restricted stock units/awards, performance units, etc.<br><br><b>Applicable containers</b>: investment<br>`,
      isReadOnly: true,
      format: 'double',
    },
    costBasis: {
      type: 'Money',
      description: `In a one-off security purchase, the cost basis is the quantity acquired multiplied by the price per unit paid plus any commission paid. In case, the same position is acquired in different lots on different days at different prices, the sum total of the cost incurred is divided by the total units acquired to arrive at the average cost basis.<br><br><b>Applicable containers</b>: investment<br>`,
      isReadOnly: true,
    },
    vestingDate: {
      type: 'string',
      description: `The date on which a RSU, RSA, or an employee stock options become vested.<br><b>Note</b>: The vesting date field is only applicable to employee stock options, restricted stock units/awards, performance units, etc.<br><br><b>Applicable containers</b>: investment<br>`,
      isReadOnly: true,
    },
    isin: {
      type: 'string',
      description: `The ISIN (International Securities Identification Number) is used worldwide to identify specific securities. It is equivalent to CUSIP for international markets.<br><br><b>Note</b>: The ISIN field is only applicable to the trade related transactions<br><br><b>Applicable containers</b>: investment<br>`,
      isReadOnly: true,
    },
    strikePrice: {
      type: 'Money',
      description: `The strike (exercise) price for the option position.<br><b>Note</b>: The strike price field is only applicable to options and employee stock options.<br><br><b>Applicable containers</b>: investment<br>`,
      isReadOnly: true,
    },
  },
} as const
