/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type {DetailCategory} from './DetailCategory'

export type TransactionCategory = {
  /**
   * The name of the high level category. A group of similar transaction categories are clubbed together to form a high-level category.<br><br><b>Applicable containers</b>: creditCard, investment, insurance, loan<br>
   */
  readonly highLevelCategoryName?: string
  /**
   * A attribute which will always hold the first value(initial name) of Yodlee defined highLevelCategoryName attribute.<br><br><b>Applicable containers</b>: creditCard, investment, insurance, loan<br>
   */
  readonly defaultHighLevelCategoryName?: string
  /**
   * The unique identifier of the high level category.<br><br><b>Applicable containers</b>: creditCard, investment, insurance, loan<br>
   */
  readonly highLevelCategoryId?: number
  /**
   * Entity that provides detail category attributes<br><br><b>Applicable containers</b>: creditCard, investment, insurance, loan<br>
   */
  readonly detailCategory?: Array<DetailCategory>
  /**
   * Unique identifier of the category.<br><br><b>Applicable containers</b>: creditCard, investment, insurance, loan<br>
   */
  readonly id?: number
  /**
   * Source used to identify whether the transaction category is user defined category or system created category.<br><br><b>Applicable containers</b>: creditCard, investment, insurance, loan<br><b>Applicable Values</b><br>
   */
  readonly source?: 'SYSTEM' | 'USER'
  /**
   * The name of the category.<br><b>Note</b>: Transaction categorization is one of the core features offered by Yodlee and the categories are assigned to the transactions by the system. Transactions can be clubbed together by the category that is assigned to them.  <br><br><b>Applicable containers</b>: creditCard, investment, insurance, loan<br>
   */
  readonly category?: string
  /**
   * Category Classification.<br><br><b>Applicable containers</b>: creditCard, investment, insurance, loan<br><b>Applicable Values</b><br>
   */
  readonly classification?: 'PERSONAL' | 'BUSINESS'
  /**
   * Transaction categories and high-level categories are further mapped to five transaction category types. Customers, based on their needs can either use the transaction categories, the high-level categories, or the transaction category types. <br><br><b>Applicable containers</b>: creditCard, investment, insurance, loan<br><b>Applicable Values</b><br>
   */
  readonly type?:
    | 'TRANSFER'
    | 'DEFERRED_COMPENSATION'
    | 'UNCATEGORIZE'
    | 'INCOME'
    | 'EXPENSE'
  /**
   * A attribute which will always hold the first value(initial name) of Yodlee defined category attribute.<br><br><b>Applicable containers</b>: creditCard, investment, insurance, loan<br>
   */
  readonly defaultCategoryName?: string
}
