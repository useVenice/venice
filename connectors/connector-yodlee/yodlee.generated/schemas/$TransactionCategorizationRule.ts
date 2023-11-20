/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $TransactionCategorizationRule = {
  properties: {
    ruleClauses: {
      type: 'array',
      contains: {
        type: 'RuleClause',
      },
      isReadOnly: true,
    },
    userDefinedRuleId: {
      type: 'number',
      description: `Unique identifier generated for every rule the user creates.<br><br><b>Applicable containers</b>: creditCard, investment, insurance, loan<br>`,
      isReadOnly: true,
      format: 'int64',
    },
    categoryLevelId: {
      type: 'number',
      description: `The level of the category for which the rule is created.<br><br><b>Applicable containers</b>: creditCard, insurance, loan<br>`,
      isReadOnly: true,
      format: 'int32',
    },
    transactionCategorisationId: {
      type: 'number',
      description: `Category id that is assigned to the transaction when the transaction matches the rule clause. This is the id field of the transaction category resource.<br><br><b>Applicable containers</b>: creditCard, investment, insurance, loan<br>`,
      isReadOnly: true,
      format: 'int64',
    },
    memId: {
      type: 'number',
      description: `Unique identifier of the user.<br><br><b>Applicable containers</b>: creditCard, investment, insurance, loan<br>`,
      isReadOnly: true,
      format: 'int64',
    },
    rulePriority: {
      type: 'number',
      description: `The order in which the rules get executed on transactions.<br><br><b>Applicable containers</b>: creditCard, investment, insurance, loan<br>`,
      isReadOnly: true,
      format: 'int32',
    },
  },
} as const
