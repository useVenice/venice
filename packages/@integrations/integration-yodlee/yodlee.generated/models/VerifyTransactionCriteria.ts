/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Transaction } from './Transaction';

export type VerifyTransactionCriteria = {
  date: string;
  amount: number;
  readonly verifiedTransaction?: Array<Transaction>;
  /**
   * Indicates if the criteria is matched or not. <br><b>Applicable Values</b><br>
   */
  readonly matched?: 'COMPLETE' | 'NONE';
  keyword?: string;
  dateVariance?: string;
  /**
   * Indicates if the transaction appears as a debit or a credit transaction in the account. <br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br><b>Applicable Values</b><br>
   */
  baseType?: 'CREDIT' | 'DEBIT';
};

