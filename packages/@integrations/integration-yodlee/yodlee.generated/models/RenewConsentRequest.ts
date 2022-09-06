/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { RenewalConsent } from './RenewalConsent';

export type RenewConsentRequest = {
  /**
   * renewal entity from consent details service, containing default consent duration and reauthorization eligibility.<br><br><b>Endpoints</b>:<ul><li>PUT consents/{consentId}/renewal</li></ul>
   */
  renewal?: RenewalConsent;
};

