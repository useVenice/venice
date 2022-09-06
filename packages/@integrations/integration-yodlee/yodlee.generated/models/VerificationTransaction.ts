/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Money } from './Money';

export type VerificationTransaction = {
  amount: Money;
  baseType: 'CREDIT' | 'DEBIT';
};

