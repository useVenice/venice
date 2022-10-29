/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ProviderDetail = {
  properties: {
    languageISOCode: {
      type: 'string',
      description: `The language in which the provider details are provided. For example, a site supports two languages English and French. English being the primary language, the provider response will be provided in French depending on the user's locale. The language follows the two letter ISO code.<br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul>`,
      isReadOnly: true,
    },
    favicon: {
      type: 'string',
      description: `Favicon link of the provider.<br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul>`,
      isReadOnly: true,
    },
    accountType: {
      type: 'array',
      contains: {
        type: 'Enum',
      },
      isReadOnly: true,
    },
    countryISOCode: {
      type: 'string',
      description: `Country to which the provider belongs.<br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul>`,
      isReadOnly: true,
    },
    isAddedByUser: {
      type: 'string',
      description: `Indicates that the site has been added by the user at least once.<br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul>`,
      isReadOnly: true,
    },
    PRIORITY: {
      type: 'Enum',
      isReadOnly: true,
    },
    associatedProviderIds: {
      type: 'array',
      contains: {
        type: 'number',
        format: 'int64',
      },
      isReadOnly: true,
    },
    primaryLanguageISOCode: {
      type: 'string',
      description: `The primary language of the site.<br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul>`,
      isReadOnly: true,
    },
    help: {
      type: 'string',
      description: `Text to guide user through linking an account that belongs to the site<br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul>`,
      isReadOnly: true,
    },
    baseUrl: {
      type: 'string',
      description: `The base URL of the provider's site.<br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul>`,
      isReadOnly: true,
    },
    capability: {
      type: 'array',
      contains: {
        type: 'Capability',
      },
      isReadOnly: true,
    },
    loginForm: {
      type: 'array',
      contains: {
        type: 'LoginForm',
      },
      isReadOnly: true,
    },
    isConsentRequired: {
      type: 'boolean',
      description: `Indicates if a provider site requires consent.<br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul>`,
      isReadOnly: true,
    },
    loginUrl: {
      type: 'string',
      description: `The login URL of the provider's site.<br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul>`,
      isReadOnly: true,
    },
    isAutoRefreshEnabled: {
      type: 'boolean',
      description: `Indicates if a provider site is auto-refreshed.<br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul>`,
      isReadOnly: true,
    },
    name: {
      type: 'string',
      description: `The name of a provider site.<br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul>`,
      isReadOnly: true,
    },
    logo: {
      type: 'string',
      description: `The logo link of the provider institution. The link will return the logo in the PNG format.<br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul>`,
      isReadOnly: true,
    },
    id: {
      type: 'number',
      description: `Unique identifier for the provider site(e.g., financial institution sites, biller sites, lender sites, etc.).<br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul>`,
      isReadOnly: true,
      format: 'int64',
    },
    lastModified: {
      type: 'string',
      description: `Determines when the provider information was updated by Yodlee. If the customer caches the data, the cache is recommended to be refreshed based on this field.<br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul>`,
      isReadOnly: true,
    },
    authParameter: {
      type: 'array',
      contains: {
        type: 'Enum',
      },
      isReadOnly: true,
    },
    authType: {
      type: 'Enum',
      isReadOnly: true,
    },
    dataset: {
      type: 'array',
      contains: {
        type: 'ProvidersDataset',
      },
      isReadOnly: true,
    },
    status: {
      type: 'Enum',
      isReadOnly: true,
    },
  },
} as const
