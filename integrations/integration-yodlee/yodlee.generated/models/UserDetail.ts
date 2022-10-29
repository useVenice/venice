/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type {Name} from './Name'
import type {UserAddress} from './UserAddress'
import type {UserResponsePreferences} from './UserResponsePreferences'

export type UserDetail = {
  /**
   * Preferences of the user to be respected in the data provided through various API services.<br><br><b>Endpoints</b>:<ul><li>POST user/samlLogin</li><li>POST user/register</li><li>GET user</li></ul>
   */
  readonly preferences?: UserResponsePreferences
  /**
   * The address of the user.<br><br><b>Endpoints</b>:<ul><li>GET user</li></ul>
   */
  readonly address?: UserAddress
  /**
   * The login name of the user used for authentication.<br><br><b>Endpoints</b>:<ul><li>POST user/register</li><li>GET user</li></ul>
   */
  readonly loginName?: string
  /**
   * First, middle and last names of the user.<br><br><b>Endpoints</b>:<ul><li>POST user/samlLogin</li><li>POST user/register</li><li>GET user</li></ul>
   */
  readonly name?: Name
  /**
   * The unique identifier of a consumer/user in Yodlee system for whom the API services would be accessed for.<br><br><b>Endpoints</b>:<ul><li>POST user/samlLogin</li><li>POST user/register</li><li>GET user</li></ul>
   */
  readonly id?: number
  roleType?: 'INDIVIDUAL'
  /**
   * The email address of the user.<br><br><b>Endpoints</b>:<ul><li>GET user</li></ul>
   */
  readonly email?: string
  segmentName?: string
}
