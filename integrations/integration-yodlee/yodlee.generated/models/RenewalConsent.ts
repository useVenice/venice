/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type RenewalConsent = {
  /**
   * Consent default renewal duration.<br><br><b>Endpoints</b>:<ul><li>PUT consents/{consentId}/renewal</li></ul>
   */
  defaultRenewalDuration?: string
  /**
   * Consent eligibility for reauthorization.<br><br><b>Endpoints</b>:<ul><li>PUT consents/{consentId}/renewal</li></ul>
   */
  isReauthorizationRequired?: boolean
}
