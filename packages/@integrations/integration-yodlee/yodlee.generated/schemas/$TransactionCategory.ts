/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $TransactionCategory = {
  properties: {
    highLevelCategoryName: {
      type: 'string',
      description: `The name of the high level category. A group of similar transaction categories are clubbed together to form a high-level category.<br><br><b>Applicable containers</b>: creditCard, investment, insurance, loan<br>`,
      isReadOnly: true,
    },
    defaultHighLevelCategoryName: {
      type: 'string',
      description: `A attribute which will always hold the first value(initial name) of Yodlee defined highLevelCategoryName attribute.<br><br><b>Applicable containers</b>: creditCard, investment, insurance, loan<br>`,
      isReadOnly: true,
    },
    highLevelCategoryId: {
      type: 'number',
      description: `The unique identifier of the high level category.<br><br><b>Applicable containers</b>: creditCard, investment, insurance, loan<br>`,
      isReadOnly: true,
      format: 'int64',
    },
    detailCategory: {
      type: 'array',
      contains: {
        type: 'DetailCategory',
      },
      isReadOnly: true,
    },
    id: {
      type: 'number',
      description: `Unique identifier of the category.<br><br><b>Applicable containers</b>: creditCard, investment, insurance, loan<br>`,
      isReadOnly: true,
      format: 'int64',
    },
    source: {
      type: 'Enum',
      isReadOnly: true,
    },
    category: {
      type: 'string',
      description: `The name of the category.<br><b>Note</b>: Transaction categorization is one of the core features offered by Yodlee and the categories are assigned to the transactions by the system. Transactions can be clubbed together by the category that is assigned to them.  <br><br><b>Applicable containers</b>: creditCard, investment, insurance, loan<br>`,
      isReadOnly: true,
    },
    classification: {
      type: 'Enum',
      isReadOnly: true,
    },
    type: {
      type: 'Enum',
      isReadOnly: true,
    },
    defaultCategoryName: {
      type: 'string',
      description: `A attribute which will always hold the first value(initial name) of Yodlee defined category attribute.<br><br><b>Applicable containers</b>: creditCard, investment, insurance, loan<br>`,
      isReadOnly: true,
    },
  },
} as const;
