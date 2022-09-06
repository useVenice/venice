/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { DerivedTransactionsLinks } from './DerivedTransactionsLinks';
import type { DerivedTransactionsSummary } from './DerivedTransactionsSummary';

export type DerivedTransactionSummaryResponse = {
  readonly links?: DerivedTransactionsLinks;
  readonly transactionSummary?: Array<DerivedTransactionsSummary>;
};

