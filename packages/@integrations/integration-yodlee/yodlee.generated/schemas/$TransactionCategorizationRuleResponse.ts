/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
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
} as const;
