/* istanbul ignore file */
/* tslint:disable */
 
export const $TransactionCategorizationRuleResponse = {
  properties: {
    txnRules: {
      type: 'array',
      contains: {
        type: 'TransactionCategorizationRule',
      },
      isReadOnly: true,
    },
  },
} as const
