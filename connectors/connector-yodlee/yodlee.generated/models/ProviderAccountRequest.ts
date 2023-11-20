/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type {Field} from './Field'
import type {ProviderAccountPreferences} from './ProviderAccountPreferences'
import type {ProvidersDataset} from './ProvidersDataset'

export type ProviderAccountRequest = {
  /**
   * Consent Id generated for the request through POST Consent.<br><br><b>Endpoints</b>:<ul><li>POST Provider Account</li><li>PUT Provider Account</li></ul>
   */
  consentId?: number
  preferences?: ProviderAccountPreferences
  aggregationSource?: 'SYSTEM' | 'USER'
  field: Array<Field>
  datasetName?: Array<
    'BASIC_AGG_DATA' | 'ADVANCE_AGG_DATA' | 'ACCT_PROFILE' | 'DOCUMENT'
  >
  dataset?: Array<ProvidersDataset>
}
