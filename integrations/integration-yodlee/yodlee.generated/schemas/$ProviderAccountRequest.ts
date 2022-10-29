/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $ProviderAccountRequest = {
  properties: {
    consentId: {
      type: 'number',
      description: `Consent Id generated for the request through POST Consent.<br><br><b>Endpoints</b>:<ul><li>POST Provider Account</li><li>PUT Provider Account</li></ul>`,
      format: 'int64',
    },
    preferences: {
      type: 'ProviderAccountPreferences',
    },
    aggregationSource: {
      type: 'Enum',
    },
    field: {
      type: 'array',
      contains: {
        type: 'Field',
      },
      isRequired: true,
    },
    datasetName: {
      type: 'array',
      contains: {
        type: 'Enum',
      },
    },
    dataset: {
      type: 'array',
      contains: {
        type: 'ProvidersDataset',
      },
    },
  },
} as const
