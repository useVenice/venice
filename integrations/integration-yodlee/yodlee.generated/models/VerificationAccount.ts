/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type {VerificationBankTransferCode} from './VerificationBankTransferCode'

export type VerificationAccount = {
  accountName?: string
  accountType: 'SAVINGS' | 'CHECKING'
  accountNumber: string
  bankTransferCode: VerificationBankTransferCode
}
