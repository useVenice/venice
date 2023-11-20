/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $Security = {
  properties: {
    stockExchangeDetails: {
      type: 'array',
      contains: {
        type: 'StockExchangeDetail',
      },
      isReadOnly: true,
    },
    issueTypeMultiplier: {
      type: 'number',
      description: `Price units corresponding to the security style. This is used to derive actual price of the security from market value.<br><br><b>Applicable containers</b>: investment, insurance<br>`,
      isReadOnly: true,
      format: 'double',
    },
    stateTaxable: {
      type: 'boolean',
      description: `The state in which the security is taxed.<br><br><b>Applicable containers</b>: investment, insurance<br>`,
      isReadOnly: true,
    },
    callDate: {
      type: 'string',
      description: `Next call date of the security.<br><br><b>Applicable containers</b>: investment, insurance<br>`,
      isReadOnly: true,
    },
    cdscFundFlag: {
      type: 'boolean',
      description: `cdsc fund flag of the security.<br><br><b>Applicable containers</b>: investment, insurance<br>`,
      isReadOnly: true,
    },
    cusip: {
      type: 'string',
      description: `A CUSIP is a nine-character alphanumeric code that identifies a North American financial security for the purposes of facilitating clearing and settlement of trades.<br><br><b>Applicable containers</b>: investment, insurance<br>`,
      isReadOnly: true,
    },
    federalTaxable: {
      type: 'boolean',
      description: `Flag indicating federal taxable.<br><br><b>Applicable containers</b>: investment, insurance<br>`,
      isReadOnly: true,
    },
    sAndPRating: {
      type: 'string',
      description: `Unique identifier for S&P rating on Envestnet platform.<br><br><b>Applicable containers</b>: investment, insurance<br>`,
      isReadOnly: true,
    },
    shareClass: {
      type: 'string',
      description: `Share class of the security.<br><br><b>Applicable containers</b>: investment, insurance<br>`,
      isReadOnly: true,
    },
    isEnvestnetDummySecurity: {
      type: 'boolean',
      description: `Flag indicating a dummy security.<br><br><b>Applicable containers</b>: investment, insurance<br>`,
      isReadOnly: true,
    },
    description: {
      type: 'string',
      description: `The description (name) of the security. For example, Cisco Systems.<br><br><b>Applicable containers</b>: investment, insurance<br>`,
      isReadOnly: true,
    },
    minimumPurchase: {
      type: 'number',
      description: `Minimum purchase of security.<br><br><b>Applicable containers</b>: investment, insurance<br>`,
      isReadOnly: true,
      format: 'int32',
    },
    type: {
      type: 'string',
      description: `Indicates the type of security like stocks, mutual fund, etc. <br><br><b>Applicable containers</b>: investment, insurance<br>`,
      isReadOnly: true,
    },
    firstCouponDate: {
      type: 'string',
      description: `First coupon date of security.<br><br><b>Applicable containers</b>: investment, insurance<br>`,
      isReadOnly: true,
    },
    frequency: {
      type: 'number',
      description: `Coupon Frequency.<br><br><b>Applicable containers</b>: investment, insurance<br>`,
      isReadOnly: true,
      format: 'int32',
    },
    accrualMethod: {
      type: 'string',
      description: `The method in which interest is accrued or earned.<br><br><b>Applicable containers</b>: investment, insurance<br>`,
      isReadOnly: true,
    },
    incomeCurrency: {
      type: 'string',
      description: `ISO 4217 currency code indicating income currency of the security.<br><br><b>Applicable containers</b>: investment, insurance<br>`,
      isReadOnly: true,
    },
    maturityDate: {
      type: 'string',
      description: `Maturity date of the security.<br><br><b>Applicable containers</b>: investment, insurance<br>`,
      isReadOnly: true,
    },
    callPrice: {
      type: 'number',
      description: `Next call price of the security.<br><br><b>Applicable containers</b>: investment, insurance<br>`,
      isReadOnly: true,
      format: 'double',
    },
    id: {
      type: 'number',
      description: `The unique identifier of the security.<br><br><b>Applicable containers</b>: investment, insurance<br>`,
      isReadOnly: true,
      format: 'int64',
    },
    issueDate: {
      type: 'string',
      description: `Issue date of the security.<br><br><b>Applicable containers</b>: investment, insurance<br>`,
      isReadOnly: true,
    },
    sector: {
      type: 'string',
      description: `Identifier of the sector to which the security belongs to.<br><br><b>Applicable containers</b>: investment, insurance<br>`,
      isReadOnly: true,
    },
    agencyFactor: {
      type: 'number',
      description: `Agency factor of the security.<br><br><b>Applicable containers</b>: investment, insurance<br>`,
      isReadOnly: true,
      format: 'double',
    },
    interestRate: {
      type: 'number',
      description: `The rate of interest paid annually, expressed as a percentage of the bond's par or face value.<br><br><b>Applicable containers</b>: investment, insurance<br>`,
      isReadOnly: true,
      format: 'double',
    },
    lastModifiedDate: {
      type: 'string',
      description: `The last updated date of the security.<br><br><b>Applicable containers</b>: investment, insurance<br>`,
      isReadOnly: true,
    },
    gicsSector: {
      type: 'string',
      description: `GICS Sector is a categorization the S&P assigns to all publically traded companies. <br><br><b>Applicable containers</b>: investment, insurance<br>`,
      isReadOnly: true,
    },
    closedFlag: {
      type: 'boolean',
      description: `<b>true</b>:Closed for all investors , <b>false</b>: Open to all investors.<br><br><b>Applicable containers</b>: investment, insurance<br>`,
      isReadOnly: true,
    },
    sedol: {
      type: 'string',
      description: `The Stock Exchange Daily Official List (SEDOL) is a set of security identifiers used in the United Kingdom and Ireland for clearing purposes.<br><b>Note</b>: The SEDOL field is only applicable to the trade related transactions.<br><br><b>Applicable containers</b>: investment, insurance<br>`,
      isReadOnly: true,
    },
    subSector: {
      type: 'string',
      description: `GICS sector ID to which the security belongs to.<br><br><b>Applicable containers</b>: investment, insurance<br>`,
      isReadOnly: true,
    },
    lastCouponDate: {
      type: 'string',
      description: `Last coupon date of security.<br><br><b>Applicable containers</b>: investment, insurance<br>`,
      isReadOnly: true,
    },
    isSyntheticSecurity: {
      type: 'boolean',
      description: `Indicates whether the security is a simulated security.<br><br><b>Applicable containers</b>: investment, insurance<br>`,
      isReadOnly: true,
    },
    tradeCurrencyCode: {
      type: 'string',
      description: `ISO 4217 currency code indicating trading currency of the security.<br><br><b>Applicable containers</b>: investment, insurance<br>`,
      isReadOnly: true,
    },
    isDummySecurity: {
      type: 'boolean',
      description: `Indicates whether the security is a dummy security.<br><br><b>Applicable containers</b>: investment, insurance<br>`,
      isReadOnly: true,
    },
    moodyRating: {
      type: 'string',
      description: `Unique identifier for Moody rating on Envestnet platform.<br><br><b>Applicable containers</b>: investment, insurance<br>`,
      isReadOnly: true,
    },
    style: {
      type: 'string',
      description: `Classification of the style for the security.<br><br><b>Applicable containers</b>: investment, insurance<br>`,
      isReadOnly: true,
    },
    firmEligible: {
      type: 'string',
      description: `<b>1</b>- indicates Eligible,<b>0</b>- indicates firm is not eligible.<br><br><b>Applicable containers</b>: investment, insurance<br>`,
      isReadOnly: true,
    },
    fundFamily: {
      type: 'string',
      description: `Mutual Fund Family Name.<br><br><b>Applicable containers</b>: investment, insurance<br>`,
      isReadOnly: true,
    },
    isin: {
      type: 'string',
      description: `The International Securities Identification Number (ISIN) is used worldwide to identify specific securities. It is equivalent to CUSIP for international markets.<br><br><b>Applicable containers</b>: investment, insurance<br>`,
      isReadOnly: true,
    },
  },
} as const
