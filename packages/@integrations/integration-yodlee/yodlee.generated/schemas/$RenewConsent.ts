/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $RenewConsent = {
  properties: {
    dataAccessFrequency: {
      type: 'Enum',
    },
    renewal: {
      type: 'Renewal',
      description: `Renewal describes the sharing duration and reauthorization required.`,
    },
    title: {
      type: 'string',
      description: `Title for the consent form.`,
      isRequired: true,
    },
    applicationDisplayName: {
      type: 'string',
      description: `Application display name.`,
      isRequired: true,
    },
    titleBody: {
      type: 'string',
      description: `Description for the title.`,
      isRequired: true,
    },
    consentId: {
      type: 'number',
      description: `Consent Id generated through POST Consent.`,
      isRequired: true,
      format: 'int64',
    },
    authorizationUrl: {
      type: 'string',
      description: `Authorization url generated for the request through PUT Consent to reach endsite. <br>OR during get authorization url call. <br>This is created during account addition.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts</li></ul>`,
      isReadOnly: true,
    },
    providerId: {
      type: 'number',
      description: `Provider Id for which the consent needs to be generated.`,
      isRequired: true,
      format: 'int64',
    },
    consentStatus: {
      type: 'Enum',
      isRequired: true,
    },
    providerAccountId: {
      type: 'number',
      description: `Unique identifier for the provider account resource. <br>This is created during account addition.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts</li><li>GET accounts</li><li>GET consents</li></ul>`,
      isReadOnly: true,
      format: 'int64',
    },
    scope: {
      type: 'array',
      contains: {
        type: 'Scope',
      },
      isRequired: true,
    },
    startDate: {
      type: 'string',
      description: `Consent start date.`,
      isRequired: true,
    },
    expirationDate: {
      type: 'string',
      description: `Consent expiry date.`,
      isRequired: true,
    },
  },
} as const;
