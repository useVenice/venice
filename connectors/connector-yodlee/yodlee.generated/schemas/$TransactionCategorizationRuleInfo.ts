/* istanbul ignore file */
/* tslint:disable */

export const $TransactionCategorizationRuleInfo = {
  properties: {
    ruleClause: {
      type: 'array',
      contains: {
        type: 'FieldOperation',
      },
      isRequired: true,
    },
    source: {
      type: 'Enum',
    },
    priority: {
      type: 'number',
      format: 'int32',
    },
    categoryId: {
      type: 'number',
      isRequired: true,
      format: 'int32',
    },
  },
} as const
