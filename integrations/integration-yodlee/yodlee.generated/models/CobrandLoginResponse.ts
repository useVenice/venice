/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type {CobrandSession} from './CobrandSession'

export type CobrandLoginResponse = {
  session?: CobrandSession
  /**
   * Unique identifier of the cobrand (customer) in the system.<br><br><b>Endpoints</b>:<ul><li>POST cobrand/login</li></ul>
   */
  readonly cobrandId?: number
  /**
   * The application identifier.<br><br><b>Endpoints</b>:<ul><li>POST cobrand/login</li></ul>
   */
  readonly applicationId?: string
  /**
   * The customer's locale that will be considered for the localization functionality.<br><br><b>Endpoints</b>:<ul><li>POST cobrand/login</li></ul>
   */
  readonly locale?: string
}
