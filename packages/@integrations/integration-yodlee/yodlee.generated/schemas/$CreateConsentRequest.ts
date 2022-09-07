/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $CreateConsentRequest = {
  properties: {
    providerId: {
      type: 'number',
      description: `Unique identifier for the provider site.(e.g., financial institution sites, biller sites, lender sites, etc.).<br><br><b>Endpoints</b>:<ul><li>POST Consent</li></ul>`,
      format: 'int64',
    },
    dataset: {
      type: 'array',
      contains: {
        type: 'ProvidersDataset',
      },
    },
    applicationName: {
      type: 'string',
      description: `The name of the application.If no applicationName is provided in the input, the default applicationName will be considered<br><br><b>Endpoints</b>:<ul><li>POST Consent</li></ul>`,
    },
  },
} as const;
