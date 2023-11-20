/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $DerivedNetworth = {
  properties: {
    date: {
      type: 'string',
      description: `The date as of when the networth information is provided.<br><br><b>Applicable containers</b>: bank, creditcard, investment, insurance, realEstate, loan<br>`,
      isReadOnly: true,
    },
    liability: {
      type: 'Money',
      description: `The liability amount that the user owes.<br><br><b>Applicable containers</b>: bank, creditcard, investment, insurance, realEstate, loan<br>`,
      isReadOnly: true,
    },
    historicalBalances: {
      type: 'array',
      contains: {
        type: 'DerivedNetworthHistoricalBalance',
      },
      isReadOnly: true,
    },
    networth: {
      type: 'Money',
      description: `Networth of the user.<br><br><b>Applicable containers</b>: bank, creditcard, investment, insurance, realEstate, loan<br>`,
      isReadOnly: true,
    },
    asset: {
      type: 'Money',
      description: `The asset value that the user owns.<br><br><b>Applicable containers</b>: bank, creditcard, investment, insurance, realEstate, loan<br>`,
      isReadOnly: true,
    },
  },
} as const
