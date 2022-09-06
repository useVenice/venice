/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DerivedCategorySummaryDetails } from './DerivedCategorySummaryDetails';
import type { DerivedTransactionsLinks } from './DerivedTransactionsLinks';
import type { Money } from './Money';

export type DerivedCategorySummary = {
  /**
   * The total of credit transactions for the category.<br><br><b>Applicable containers</b>: creditCard, bank, investment<br>
   */
  readonly creditTotal?: Money;
  /**
   * Credit and debit summary per date.<br><br><b>Applicable containers</b>: creditCard, bank, investment<br>
   */
  readonly details?: Array<DerivedCategorySummaryDetails>;
  /**
   * Link of the API services that corresponds to the value derivation.<br><br><b>Applicable containers</b>: creditCard, bank, investment<br>
   */
  readonly links?: DerivedTransactionsLinks;
  /**
   * The name of the category.<br><br><b>Applicable containers</b>: creditCard, bank, investment<br>
   */
  readonly categoryName?: string;
  /**
   * Id of the category. This information is provided by transactions/categories service.<br><br><b>Applicable containers</b>: creditCard, bank, investment<br>
   */
  readonly categoryId?: number;
  /**
   * The total of debit transactions for the category.<br><br><b>Applicable containers</b>: creditCard, bank, investment<br>
   */
  readonly debitTotal?: Money;
};

