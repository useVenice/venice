/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Capability } from './Capability';
import type { LoginForm } from './LoginForm';
import type { ProvidersDataset } from './ProvidersDataset';

export type ProviderDetail = {
  /**
   * The language in which the provider details are provided. For example, a site supports two languages English and French. English being the primary language, the provider response will be provided in French depending on the user's locale. The language follows the two letter ISO code.<br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul>
   */
  readonly languageISOCode?: string;
  /**
   * Favicon link of the provider.<br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul>
   */
  readonly favicon?: string;
  /**
   * AccountType supported by the provider, eg: Brokerage Cash, Current<br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul>
   */
  readonly accountType?: Array<'CURRENT' | 'BROKERAGE_CASH'>;
  /**
   * Country to which the provider belongs.<br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul>
   */
  readonly countryISOCode?: string;
  /**
   * Indicates that the site has been added by the user at least once.<br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul>
   */
  readonly isAddedByUser?: string;
  /**
   * Indicates the priority for which the service is invoked.<br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul><b>Applicable Values</b><br>
   */
  readonly PRIORITY?: 'POPULAR' | 'SUGGESTED' | 'COBRAND' | 'SEARCH' | 'ALL';
  /**
   * The screen-scraping providers that are associated to the Open Banking provider ID.<br><br><b>Applicable containers</b>: All Containers<br><b>Endpoints</b>:<ul><li>GET providers</li><li>GET providers/{providerId}</li></ul>
   */
  readonly associatedProviderIds?: Array<number>;
  /**
   * The primary language of the site.<br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul>
   */
  readonly primaryLanguageISOCode?: string;
  /**
   * Text to guide user through linking an account that belongs to the site<br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul>
   */
  readonly help?: string;
  /**
   * The base URL of the provider's site.<br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul>
   */
  readonly baseUrl?: string;
  /**
   * Capability of the site<br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul><br><b>Note : </b> capability has been deprecated
   */
  readonly capability?: Array<Capability>;
  /**
   * This entity represents the structure of the login or MFA form that is displayed to the user at the provider site. For performance reasons, this field is returned only when a single provider is requested in the request.<br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li></ul>
   */
  readonly loginForm?: Array<LoginForm>;
  /**
   * Indicates if a provider site requires consent.<br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul>
   */
  readonly isConsentRequired?: boolean;
  /**
   * The login URL of the provider's site.<br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul>
   */
  readonly loginUrl?: string;
  /**
   * Indicates if a provider site is auto-refreshed.<br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul>
   */
  readonly isAutoRefreshEnabled?: boolean;
  /**
   * The name of a provider site.<br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul>
   */
  readonly name?: string;
  /**
   * The logo link of the provider institution. The link will return the logo in the PNG format.<br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul>
   */
  readonly logo?: string;
  /**
   * Unique identifier for the provider site(e.g., financial institution sites, biller sites, lender sites, etc.).<br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul>
   */
  readonly id?: number;
  /**
   * Determines when the provider information was updated by Yodlee. If the customer caches the data, the cache is recommended to be refreshed based on this field.<br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul>
   */
  readonly lastModified?: string;
  /**
   * AuthParameter appears in the response only in case of token-based aggregation sites.<br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul>
   */
  readonly authParameter?: Array<'authorizationCode' | 'idToken' | 'authResponse'>;
  /**
   * The authentication type enabled at the provider site. <br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul><b>Applicable Values</b><br>
   */
  readonly authType?: 'OAUTH' | 'CREDENTIALS' | 'MFA_CREDENTIALS';
  /**
   * Logical grouping of dataset attributes into datasets such as Basic Aggregation Data, Account Profile and Documents<br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul>
   */
  readonly dataset?: Array<ProvidersDataset>;
  /**
   * Determines if the provider is supported for the cobrand (customer), is in the beta stage, etc. <br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul>
   */
  readonly status?: 'Supported' | 'Beta' | 'Unsupported';
};

