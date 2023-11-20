/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Institution = {
  /**
   * The language in which the provider details are provided. For example, a site supports two languages English and French. English being the primary language, the provider response will be provided in French depending on the user's locale. The language follows the two letter ISO code.<br><br><b>Endpoints</b>:<ul><li>GET institutions</li></ul>
   */
  readonly languageISOCode?: string
  /**
   * Favicon link of the provider.<br><br><b>Endpoints</b>:<ul><li>GET institutions</li></ul>
   */
  readonly favicon?: string
  /**
   * Country to which the provider belongs.<br><br><b>Endpoints</b>:<ul><li>GET institutions</li></ul>
   */
  readonly countryISOCode?: string
  /**
   * Indicates that the site has been added by the user at least once.<br><br><b>Endpoints</b>:<ul><li>GET institutions</li></ul>
   */
  readonly isAddedByUser?: string
  /**
   * Indicates the priority for which the service is invoked.<br><br><b>Endpoints</b>:<ul><li>GET institutions</li></ul><b>Applicable Values</b><br>
   */
  readonly PRIORITY?: 'POPULAR' | 'SUGGESTED' | 'COBRAND' | 'SEARCH' | 'ALL'
  /**
   * The primary language of the site.<br><br><b>Endpoints</b>:<ul><li>GET institutions</li></ul>
   */
  readonly primaryLanguageISOCode?: string
  /**
   * The base URL of the provider's site.<br><br><b>Endpoints</b>:<ul><li>GET institutions</li></ul>
   */
  readonly baseUrl?: string
  /**
   * The login URL of the provider's site.<br><br><b>Endpoints</b>:<ul><li>GET institutions</li></ul>
   */
  readonly loginUrl?: string
  /**
   * providerId<br><br><b>Endpoints</b>:<ul><li>GET institutions</li></ul>
   */
  readonly providerId?: Array<number>
  /**
   * The name of a provider site.<br><br><b>Endpoints</b>:<ul><li>GET institutions</li></ul>
   */
  readonly name?: string
  /**
   * The logo link of the provider institution. The link will return the logo in the PNG format.<br><br><b>Endpoints</b>:<ul><li>GET institutions</li></ul>
   */
  readonly logo?: string
  /**
   * Unique identifier for the provider site.(e.g., financial institution sites, biller sites, lender sites, etc.).<br><br><b>Endpoints</b>:<ul><li>GET institutions</li></ul>
   */
  readonly id?: number
  /**
   * Determines when the provider information was updated by Yodlee. If the customer caches the data, the cache is recommended to be refreshed based on this field.<br><br><b>Endpoints</b>:<ul><li>GET institutions</li></ul>
   */
  readonly lastModified?: string
}
