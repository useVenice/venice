/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type {VerificationAccount} from './VerificationAccount'

export type Verification = {
  /**
   * Unique identifier for the account.<br><br><b>Endpoints</b>:<ul><li>POST verification</li><li>GET verification</li><li>PUT verification</li></ul>
   */
  accountId?: number
  /**
   * The reason the account verification failed.<br><br><b>Endpoints</b>:<ul><li>POST verification</li><li>GET verification</li><li>PUT verification</li></ul>
   */
  readonly reason?:
    | 'DATA_NOT_AVAILABLE'
    | 'ACCOUNT_HOLDER_MISMATCH'
    | 'FULL_ACCOUNT_NUMBER_AND_BANK_TRANSFER_CODE_NOT_AVAILABLE'
    | 'FULL_ACCOUNT_NUMBER_NOT_AVAILABLE'
    | 'BANK_TRANSFER_CODE_NOT_AVAILABLE'
    | 'EXPIRED'
    | 'DATA_MISMATCH'
    | 'INSTRUCTION_GENERATION_ERROR'
  /**
   * The status of the account verification.<br><br><b>Endpoints</b>:<ul><li>POST verification</li><li>GET verification</li><li>PUT verification</li></ul><br><b>Applicable Values</b>
   */
  readonly verificationStatus?: 'INITIATED' | 'DEPOSITED' | 'SUCCESS' | 'FAILED'
  /**
   * Unique identifier for the provider account.<br><br><b>Endpoints</b>:<ul><li>POST verification</li><li>GET verification</li><li>PUT verification</li></ul>
   */
  providerAccountId?: number
  /**
   * The account verification type.<br><br><b>Endpoints</b>:<ul><li>POST verification</li><li>GET verification</li><li>PUT verification</li></ul><br><b>Applicable Values</b>
   */
  verificationType?: 'MATCHING' | 'CHALLENGE_DEPOSIT'
  account?: VerificationAccount
  /**
   * The date of the account verification.<br><br><b>Endpoints</b>:<ul><li>POST verification</li><li>GET verification</li><li>PUT verification</li></ul>
   */
  readonly verificationDate?: string
  /**
   * Unique identifier for the verification request.<br><br><b>Endpoints</b>:<ul><li>POST verification</li><li>GET verification</li><li>PUT verification</li></ul>
   */
  readonly verificationId?: number
}
