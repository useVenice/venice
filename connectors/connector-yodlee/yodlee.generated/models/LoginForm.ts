/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type {Row} from './Row'

export type LoginForm = {
  /**
   * The title for the MFA information demanded from the user.This is the title displayed in the provider site.This field is applicable for MFA form types only. <br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li></ul>
   */
  readonly mfaInfoTitle?: string
  /**
   * The help that can be displayed to the customer in the login form.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li><li>GET providers/{providerId}</li></ul>
   */
  readonly help?: string
  /**
   * The forget password URL of the provider site.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li><li>GET providers/{providerId}</li></ul>
   */
  forgetPasswordURL?: string
  /**
   * The type of the forms for which the user information is required.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li><li>GET providers/{providerId}</li></ul><b>Applicable Values</b><br>
   */
  formType?: 'login' | 'questionAndAnswer' | 'token' | 'image'
  /**
   * The text displayed in the provider site while requesting the user's MFA information. This field is applicable for MFA form types only. <br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li></ul>
   */
  readonly mfaInfoText?: string
  /**
   * The help that can be displayed to the customer in the login form.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li><li>GET providers/{providerId}</li></ul>
   */
  readonly loginHelp?: string
  /**
   * The amount of time before which the user is expected to provide MFA information. This field is applicable for MFA form types only. This would be an useful information that could be displayed to the users. <br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li><li>GET providers/{providerId}</li></ul>
   */
  readonly mfaTimeout?: number
  /**
   * The identifier of the login form.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li><li>GET providers/{providerId}</li></ul>
   */
  id?: number
  /**
   * This indicates one row in the form. The row will have one label. But it may have single or multiple fields.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li><li>GET providers/{providerId}</li></ul>
   */
  row?: Array<Row>
}
