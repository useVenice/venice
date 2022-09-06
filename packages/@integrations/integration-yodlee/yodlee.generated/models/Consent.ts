/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Renewal } from './Renewal';
import type { Scope } from './Scope';

export type Consent = {
  /**
   * Data Access Frequency explains the number of times that this consent can be used.<br> Otherwise called as consent frequency type.
   */
  dataAccessFrequency?: 'ONE_TIME' | 'RECURRING';
  /**
   * Description for the title.
   */
  titleBody: string;
  /**
   * Consent Id generated through POST Consent.
   */
  consentId: number;
  /**
   * Renewal describes the sharing duration and reauthorization required.
   */
  renewal?: Renewal;
  /**
   * Provider Id for which the consent needs to be generated.
   */
  providerId: number;
  /**
   * Status of the consent.
   */
  consentStatus: 'ACTIVE' | 'CONSENT_GENERATED' | 'CONSENT_ACCEPTED' | 'CONSENT_AUTHORIZED' | 'CONSENT_MISMATCH' | 'PENDING' | 'EXPIRED' | 'REVOKED';
  /**
   * Unique identifier for the provider account resource. <br>This is created during account addition.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts</li></ul>
   */
  readonly providerAccountId?: number;
  /**
   * Scope describes about the consent permissions and their purpose.
   */
  scope: Array<Scope>;
  /**
   * Title for the consent form.
   */
  title: string;
  /**
   * Application display name.
   */
  applicationDisplayName: string;
  /**
   * Consent start date.
   */
  startDate: string;
  /**
   * Consent expiry date.
   */
  expirationDate: string;
};

