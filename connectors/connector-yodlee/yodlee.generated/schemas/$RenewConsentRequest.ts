/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $RenewConsentRequest = {
  properties: {
    renewal: {
      type: 'RenewalConsent',
      description: `renewal entity from consent details service, containing default consent duration and reauthorization eligibility.<br><br><b>Endpoints</b>:<ul><li>PUT consents/{consentId}/renewal</li></ul>`,
    },
  },
} as const
