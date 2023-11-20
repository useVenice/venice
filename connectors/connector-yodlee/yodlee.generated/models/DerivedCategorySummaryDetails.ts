/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type {Money} from './Money'

export type DerivedCategorySummaryDetails = {
  /**
   * Date on which the credit and debit transactions had occured.<br><br><b>Applicable containers</b>: creditCard, bank, investment<br>
   */
  readonly date?: string
  /**
   * Total of credit transaction amounts that had occured on the date.<br><br><b>Applicable containers</b>: creditCard, bank, investment<br>
   */
  readonly creditTotal?: Money
  /**
   * Total of debit transaction amounts that had occured on the date.<br><br><b>Applicable containers</b>: creditCard, bank, investment<br>
   */
  readonly debitTotal?: Money
}
