/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $StockExchangeDetail = {
  properties: {
    symbol: {
      type: 'string',
      description: `Ticker symbol representing particular securities listed on an exchange.<br><br><b>Applicable containers</b>: investment, insurance<br>`,
      isReadOnly: true,
    },
    countryCode: {
      type: 'string',
      description: `Country codes are geocodes developed to represent countries and dependent areas.<br><br><b>Applicable containers</b>: investment, insurance<br>`,
      isReadOnly: true,
    },
    currencyCode: {
      type: 'string',
      description: `ISO codes of currency.<br><br><b>Applicable containers</b>: investment, insurance<br>`,
      isReadOnly: true,
    },
    exchangeCode: {
      type: 'string',
      description: `An Exchange code is a four-character code used to identify stock markets and other trading exchanges within global trading.<br><br><b>Applicable containers</b>: investment, insurance<br>`,
      isReadOnly: true,
    },
  },
} as const;
