/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { VerifyTransactionCriteria } from './VerifyTransactionCriteria';

export type VerifyAccountRequest = {
  container?: 'bank' | 'creditCard' | 'investment' | 'insurance' | 'loan' | 'reward' | 'bill' | 'realEstate' | 'otherAssets' | 'otherLiabilities';
  accountId?: number;
  transactionCriteria: Array<VerifyTransactionCriteria>;
};

