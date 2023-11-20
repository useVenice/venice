/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type {AccountAddress} from './AccountAddress'
import type {Email} from './Email'
import type {Identifier} from './Identifier'
import type {PhoneNumber} from './PhoneNumber'

export type AccountProfile = {
  /**
   * Identifiers available in the profile page of the account.<br><br><b>Account Type</b>: Aggregated<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul>
   */
  readonly identifier?: Array<Identifier>
  /**
   * Address available in the profile page of the account.<br><br><b>Account Type</b>: Aggregated<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul>
   */
  readonly address?: Array<AccountAddress>
  /**
   * Phone number available in the profile page of the account.<br><br><b>Account Type</b>: Aggregated<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul>
   */
  readonly phoneNumber?: Array<PhoneNumber>
  /**
   * Email Id available in the profile page of the account.<br><br><b>Account Type</b>: Aggregated<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul>
   */
  readonly email?: Array<Email>
}
