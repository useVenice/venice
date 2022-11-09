/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type {RuleClause} from './RuleClause'

export type TransactionCategorizationRule = {
  /**
   * Details of rules. <br><br><b>Applicable containers</b>: creditCard, investment, insurance, loan<br>
   */
  readonly ruleClauses?: Array<RuleClause>
  /**
   * Unique identifier generated for every rule the user creates.<br><br><b>Applicable containers</b>: creditCard, investment, insurance, loan<br>
   */
  readonly userDefinedRuleId?: number
  /**
   * The level of the category for which the rule is created.<br><br><b>Applicable containers</b>: creditCard, insurance, loan<br>
   */
  readonly categoryLevelId?: number
  /**
   * Category id that is assigned to the transaction when the transaction matches the rule clause. This is the id field of the transaction category resource.<br><br><b>Applicable containers</b>: creditCard, investment, insurance, loan<br>
   */
  readonly transactionCategorisationId?: number
  /**
   * Unique identifier of the user.<br><br><b>Applicable containers</b>: creditCard, investment, insurance, loan<br>
   */
  readonly memId?: number
  /**
   * The order in which the rules get executed on transactions.<br><br><b>Applicable containers</b>: creditCard, investment, insurance, loan<br>
   */
  readonly rulePriority?: number
}
