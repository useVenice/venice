/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { AccountAddress } from './AccountAddress';
import type { Money } from './Money';

export type UpdateAccountInfo = {
  container?: 'bank' | 'creditCard' | 'investment' | 'insurance' | 'loan' | 'reward' | 'bill' | 'realEstate' | 'otherAssets' | 'otherLiabilities';
  includeInNetWorth?: string;
  address?: AccountAddress;
  accountName?: string;
  dueDate?: string;
  memo?: string;
  homeValue?: Money;
  accountNumber?: string;
  frequency?: 'DAILY' | 'ONE_TIME' | 'WEEKLY' | 'EVERY_2_WEEKS' | 'SEMI_MONTHLY' | 'MONTHLY' | 'QUARTERLY' | 'SEMI_ANNUALLY' | 'ANNUALLY' | 'EVERY_2_MONTHS' | 'EBILL' | 'FIRST_DAY_MONTHLY' | 'LAST_DAY_MONTHLY' | 'EVERY_4_WEEKS' | 'UNKNOWN' | 'OTHER';
  accountStatus?: 'ACTIVE' | 'INACTIVE' | 'TO_BE_CLOSED' | 'CLOSED' | 'DELETED';
  amountDue?: Money;
  /**
   * List of loan accounts to which a real-estate account is linked.
   */
  linkedAccountIds?: Array<number>;
  balance?: Money;
  isEbillEnrolled?: string;
  nickname?: string;
};

