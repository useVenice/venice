/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $RenewalConsent = {
  properties: {
    defaultRenewalDuration: {
      type: 'string',
      description: `Consent default renewal duration.<br><br><b>Endpoints</b>:<ul><li>PUT consents/{consentId}/renewal</li></ul>`,
    },
    isReauthorizationRequired: {
      type: 'boolean',
      description: `Consent eligibility for reauthorization.<br><br><b>Endpoints</b>:<ul><li>PUT consents/{consentId}/renewal</li></ul>`,
    },
  },
} as const
