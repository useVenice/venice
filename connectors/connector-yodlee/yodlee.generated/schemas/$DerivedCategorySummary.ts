/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $DerivedCategorySummary = {
  properties: {
    creditTotal: {
      type: 'Money',
      description: `The total of credit transactions for the category.<br><br><b>Applicable containers</b>: creditCard, bank, investment<br>`,
      isReadOnly: true,
    },
    details: {
      type: 'array',
      contains: {
        type: 'DerivedCategorySummaryDetails',
      },
      isReadOnly: true,
    },
    links: {
      type: 'DerivedTransactionsLinks',
      description: `Link of the API services that corresponds to the value derivation.<br><br><b>Applicable containers</b>: creditCard, bank, investment<br>`,
      isReadOnly: true,
    },
    categoryName: {
      type: 'string',
      description: `The name of the category.<br><br><b>Applicable containers</b>: creditCard, bank, investment<br>`,
      isReadOnly: true,
    },
    categoryId: {
      type: 'number',
      description: `Id of the category. This information is provided by transactions/categories service.<br><br><b>Applicable containers</b>: creditCard, bank, investment<br>`,
      isReadOnly: true,
      format: 'int64',
    },
    debitTotal: {
      type: 'Money',
      description: `The total of debit transactions for the category.<br><br><b>Applicable containers</b>: creditCard, bank, investment<br>`,
      isReadOnly: true,
    },
  },
} as const
