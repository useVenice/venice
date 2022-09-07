/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $DerivedCategorySummaryDetails = {
  properties: {
    date: {
      type: 'string',
      description: `Date on which the credit and debit transactions had occured.<br><br><b>Applicable containers</b>: creditCard, bank, investment<br>`,
      isReadOnly: true,
    },
    creditTotal: {
      type: 'Money',
      description: `Total of credit transaction amounts that had occured on the date.<br><br><b>Applicable containers</b>: creditCard, bank, investment<br>`,
      isReadOnly: true,
    },
    debitTotal: {
      type: 'Money',
      description: `Total of debit transaction amounts that had occured on the date.<br><br><b>Applicable containers</b>: creditCard, bank, investment<br>`,
      isReadOnly: true,
    },
  },
} as const;
