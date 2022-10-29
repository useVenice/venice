/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type {Profile} from './Profile'

export type ProviderAccountProfile = {
  /**
   * PII related data like address, name, phoneNumber, identifier and email.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/profile</li></ul>
   */
  readonly profile?: Array<Profile>
  /**
   * Unique identifier for profile<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/profile</li></ul>
   */
  readonly id?: number
}
