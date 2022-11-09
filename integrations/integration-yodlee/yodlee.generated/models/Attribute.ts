/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type {ContainerAttributes} from './ContainerAttributes'

export type Attribute = {
  /**
   * Containers for which the attributes are supported.<br><br><b>Endpoints</b>:<ul><li>GET providers</li><li>GET providers/{providerId}</li></ul>
   */
  container?: Array<
    | 'bank'
    | 'creditCard'
    | 'investment'
    | 'insurance'
    | 'loan'
    | 'reward'
    | 'bill'
    | 'realEstate'
    | 'otherAssets'
    | 'otherLiabilities'
  >
  /**
   * Applicable only to EBILLS and STATEMENTS attributes of DOCUMENT dataset.<br><br><b>Endpoints</b>:<ul><li>POST providerAccounts</li><li>PUT providerAccounts</li></ul>
   */
  readonly fromDate?: string
  /**
   * Applicable only to TAX attribute of DOCUMENT dataset.<br><br><b>Endpoints</b>:<ul><li>POST providerAccounts</li><li>PUT providerAccounts</li></ul>
   */
  readonly toFinYear?: string
  /**
   * Applicable only to TAX attribute of DOCUMENT dataset.<br><br><b>Endpoints</b>:<ul><li>POST providerAccounts</li><li>PUT providerAccounts</li></ul>
   */
  readonly fromFinYear?: string
  /**
   * Applicable only to TRANSACTIONS attributes of BASIC_AGG_DATA dataset.<br><br><b>Endpoints</b>:<ul><li>GET providers</li><li>GET providers/{providerId}</li><li>POST providerAccounts</li><li>PUT providerAccounts</li></ul>
   */
  readonly containerAttributes?: ContainerAttributes
  /**
   * Applicable only to EBILLS and STATEMENTS attributes of DOCUMENT dataset.<br><br><b>Endpoints</b>:<ul><li>POST providerAccounts</li><li>PUT providerAccounts</li></ul>
   */
  readonly toDate?: string
  /**
   * Attributes that are supported for a dataset.<br><br><b>Endpoints</b>:<ul><li>GET providers</li><li>GET providers/{providerId}</li></ul>
   */
  name?:
    | 'BASIC_ACCOUNT_INFO'
    | 'TRANSACTIONS'
    | 'STATEMENTS'
    | 'HOLDINGS'
    | 'ACCOUNT_DETAILS'
    | 'TAX'
    | 'EBILLS'
    | 'FULL_ACCT_NUMBER'
    | 'BANK_TRANSFER_CODE'
    | 'HOLDER_NAME'
    | 'HOLDER_DETAILS'
    | 'PAYMENT_PROFILE'
    | 'PAYMENT_DETAILS'
    | 'INTEREST_DETAILS'
    | 'COVERAGE'
}
