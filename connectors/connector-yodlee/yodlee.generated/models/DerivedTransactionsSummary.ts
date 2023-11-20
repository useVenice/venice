/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type {DerivedCategorySummary} from './DerivedCategorySummary'
import type {DerivedTransactionsLinks} from './DerivedTransactionsLinks'
import type {Money} from './Money'

export type DerivedTransactionsSummary = {
  /**
   * Type of categories provided by transactions/categories service.<br><br><b>Applicable containers</b>: creditCard, bank, investment<br><b>Applicable Values</b><br>
   */
  readonly categoryType?:
    | 'TRANSFER'
    | 'DEFERRED_COMPENSATION'
    | 'UNCATEGORIZE'
    | 'INCOME'
    | 'EXPENSE'
  /**
   * Summary of transaction amouts at category level.<br><br><b>Applicable containers</b>: creditCard, bank, investment<br>
   */
  readonly categorySummary?: Array<DerivedCategorySummary>
  /**
   * The total of credit transactions for the category type.<br><br><b>Applicable containers</b>: creditCard, bank, investment<br>
   */
  readonly creditTotal?: Money
  /**
   * Link of the API services that corresponds to the value derivation.<br><br><b>Applicable containers</b>: creditCard, bank, investment<br>
   */
  readonly links?: DerivedTransactionsLinks
  /**
   * The total of debit transactions for the category type.<br><br><b>Applicable containers</b>: creditCard, bank, investment<br>
   */
  readonly debitTotal?: Money
}
