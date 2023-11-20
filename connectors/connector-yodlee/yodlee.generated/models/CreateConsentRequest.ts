/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type {ProvidersDataset} from './ProvidersDataset'

export type CreateConsentRequest = {
  /**
   * Unique identifier for the provider site.(e.g., financial institution sites, biller sites, lender sites, etc.).<br><br><b>Endpoints</b>:<ul><li>POST Consent</li></ul>
   */
  providerId?: number
  /**
   * The name of the dataset attribute supported by the provider.If no dataset value is provided, the datasets that are configured for the customer will be considered.The configured dataset can be overridden by providing the dataset as an input.<br><br><b>Endpoints</b>:<ul><li>POST Consent</li></ul>
   */
  dataset?: Array<ProvidersDataset>
  /**
   * The name of the application.If no applicationName is provided in the input, the default applicationName will be considered<br><br><b>Endpoints</b>:<ul><li>POST Consent</li></ul>
   */
  applicationName?: string
}
