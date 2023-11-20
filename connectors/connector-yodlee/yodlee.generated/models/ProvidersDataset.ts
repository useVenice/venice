/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type {Attribute} from './Attribute'

export type ProvidersDataset = {
  /**
   * The name of the dataset requested from the provider site<br><br><b>Account Type</b>: Manual<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET providerAccounts</li><li>POST providerAccounts</li><li>PUT providerAccounts/{providerAccountId}</li><li>GET providerAccounts/{providerAccountId}</li><li>GET providers/{providerId}</li><li>GET providers</li></ul><b>Applicable Values</b><br>
   */
  name?: 'BASIC_AGG_DATA' | 'ADVANCE_AGG_DATA' | 'ACCT_PROFILE' | 'DOCUMENT'
  /**
   * The name of the dataset attribute suported by the provider.<br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul>
   */
  attribute?: Array<Attribute>
}
