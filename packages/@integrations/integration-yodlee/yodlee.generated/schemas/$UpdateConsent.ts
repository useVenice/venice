/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $UpdateConsent = {
  properties: {
    consentId: {
      type: 'number',
      description: `Unique identifier for consent. This is created during consent creation.`,
      format: 'int64',
    },
    authorizationUrl: {
      type: 'string',
      description: `Authorization url generated for the request through PUT Consent to reach endsite.`,
    },
    providerId: {
      type: 'number',
      description: `Unique identifier for the provider account resource. This is created during account addition.`,
      format: 'int64',
    },
  },
} as const;
