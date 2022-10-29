/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type {Name} from './Name'
import type {UserResponsePreferences} from './UserResponsePreferences'
import type {UserSession} from './UserSession'

export type User = {
  /**
   * Preferences of the user to be respected in the data provided through various API services.<br><br><b>Endpoints</b>:<ul><li>POST user/samlLogin</li><li>POST user/register</li><li>GET user</li></ul>
   */
  readonly preferences?: UserResponsePreferences
  /**
   * Session token of the user using which other services are invoked in the system.<br><br><b>Endpoints</b>:<ul><li>POST user/samlLogin</li><li>POST user/register</li></ul>
   */
  readonly session?: UserSession
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
}
