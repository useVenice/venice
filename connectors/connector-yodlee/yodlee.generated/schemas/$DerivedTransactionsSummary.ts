/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $DerivedTransactionsSummary = {
  properties: {
    categoryType: {
      type: 'Enum',
      isReadOnly: true,
    },
    categorySummary: {
      type: 'array',
      contains: {
        type: 'DerivedCategorySummary',
      },
      isReadOnly: true,
    },
    creditTotal: {
      type: 'Money',
      description: `The total of credit transactions for the category type.<br><br><b>Applicable containers</b>: creditCard, bank, investment<br>`,
      isReadOnly: true,
    },
    links: {
      type: 'DerivedTransactionsLinks',
      description: `Link of the API services that corresponds to the value derivation.<br><br><b>Applicable containers</b>: creditCard, bank, investment<br>`,
      isReadOnly: true,
    },
    debitTotal: {
      type: 'Money',
      description: `The total of debit transactions for the category type.<br><br><b>Applicable containers</b>: creditCard, bank, investment<br>`,
      isReadOnly: true,
    },
  },
} as const
