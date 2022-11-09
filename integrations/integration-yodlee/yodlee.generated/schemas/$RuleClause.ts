/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $RuleClause = {
  properties: {
    field: {
      type: 'Enum',
      isReadOnly: true,
    },
    userDefinedRuleId: {
      type: 'number',
      description: `Unique identifier generated for every rule the user creates.<br><br><b>Applicable containers</b>: creditCard, investment, insurance, loan<br>`,
      isReadOnly: true,
      format: 'int64',
    },
    fieldValue: {
      type: 'string',
      description: `The value would be the amount value in case of amount based rule clause or the string value in case of description based rule clause.<br><br><b>Applicable containers</b>: creditCard, investment, insurance, loan<br>`,
      isReadOnly: true,
    },
    operation: {
      type: 'Enum',
      isReadOnly: true,
    },
    ruleClauseId: {
      type: 'number',
      description: `Unique identifier generated for the rule clause.<br><br><b>Applicable containers</b>: creditCard, investment, insurance, loan<br>`,
      isReadOnly: true,
      format: 'int64',
    },
  },
} as const
