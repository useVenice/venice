/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type {VerifiedAccounts} from './VerifiedAccounts'

export type VerifiedAccountResponse = {
  /**
   * The unique identifier for the verification request that returns contextual data
   */
  readonly requestId?: string
  /**
   * The date of the verification request
   */
  readonly requestDate?: string
  /**
   * The overall status of the verification request
   */
  readonly state?: 'COMPLETED' | 'FAILED'
  readonly verifiedAccount?: Array<VerifiedAccounts>
  /**
   * The reason for the failure of the verification request
   */
  readonly failedReason?:
    | 'ACCOUNT_LOCKED'
    | 'ADDL_AUTHENTICATION_REQUIRED'
    | 'CREDENTIALS_UPDATE_NEEDED'
    | 'INCORRECT_CREDENTIALS'
    | 'INVALID_ADDL_INFO_PROVIDED'
    | 'REQUEST_TIME_OUT'
    | 'SITE_BLOCKING_ERROR'
    | 'UNEXPECTED_SITE_ERROR'
    | 'SITE_NOT_SUPPORTED'
    | 'SITE_UNAVAILABLE'
    | 'TECH_ERROR'
    | 'USER_ACTION_NEEDED_AT_SITE'
    | 'SITE_SESSION_INVALIDATED'
    | 'NEW_AUTHENTICATION_REQUIRED'
    | 'CONSENT_REQUIRED'
    | 'CONSENT_EXPIRED'
    | 'CONSENT_REVOKED'
    | 'INCORRECT_OAUTH_TOKEN'
    | 'REQUIRED_DATA_NOT_AVAILABLE'
    | 'MATCHING_FAILED'
    | 'NO_ELIGIBLE_ACCOUNTS'
    | 'USER_INPUT_REQUIRED'
}
