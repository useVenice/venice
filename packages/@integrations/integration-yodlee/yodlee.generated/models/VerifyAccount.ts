/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { VerifiedAccount } from './VerifiedAccount';
import type { VerifyTransactionCriteria } from './VerifyTransactionCriteria';

export type VerifyAccount = {
  transactionCriteria?: Array<VerifyTransactionCriteria>;
  account?: Array<VerifiedAccount>;
};

