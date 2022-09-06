/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type RuleClause = {
  /**
   * Field for which the clause is created.<br><br><br><b>Valid Values</b>:amount,description<b>Applicable containers</b>: creditCard, investment, insurance, loan<br>
   */
  readonly field?: 'amount' | 'description';
  /**
   * Unique identifier generated for every rule the user creates.<br><br><b>Applicable containers</b>: creditCard, investment, insurance, loan<br>
   */
  readonly userDefinedRuleId?: number;
  /**
   * The value would be the amount value in case of amount based rule clause or the string value in case of description based rule clause.<br><br><b>Applicable containers</b>: creditCard, investment, insurance, loan<br>
   */
  readonly fieldValue?: string;
  /**
   * Operation for which the clause is created.<br><br><b>Applicable containers</b>: creditCard, investment, insurance, loan<br>
   */
  readonly operation?: 'numberEquals' | 'numberLessThan' | 'numberLessThanEquals' | 'numberGreaterThan' | 'numberGreaterThanEquals' | 'stringEquals' | 'stringContains';
  /**
   * Unique identifier generated for the rule clause.<br><br><b>Applicable containers</b>: creditCard, investment, insurance, loan<br>
   */
  readonly ruleClauseId?: number;
};

