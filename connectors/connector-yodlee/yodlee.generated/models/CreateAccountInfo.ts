/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type {AccountAddress} from './AccountAddress'
import type {Money} from './Money'

export type CreateAccountInfo = {
  includeInNetWorth?: string
  address?: AccountAddress
  accountName: string
  accountType: string
  dueDate?: string
  memo?: string
  homeValue?: Money
  accountNumber?: string
  frequency?:
    | 'DAILY'
    | 'ONE_TIME'
    | 'WEEKLY'
    | 'EVERY_2_WEEKS'
    | 'SEMI_MONTHLY'
    | 'MONTHLY'
    | 'QUARTERLY'
    | 'SEMI_ANNUALLY'
    | 'ANNUALLY'
    | 'EVERY_2_MONTHS'
    | 'EBILL'
    | 'FIRST_DAY_MONTHLY'
    | 'LAST_DAY_MONTHLY'
    | 'EVERY_4_WEEKS'
    | 'UNKNOWN'
    | 'OTHER'
  amountDue?: Money
  balance?: Money
  nickname?: string
  valuationType?: 'SYSTEM' | 'MANUAL'
}
