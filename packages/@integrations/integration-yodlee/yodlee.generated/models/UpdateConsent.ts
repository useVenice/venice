/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type UpdateConsent = {
  /**
   * Unique identifier for consent. This is created during consent creation.
   */
  consentId?: number;
  /**
   * Authorization url generated for the request through PUT Consent to reach endsite.
   */
  authorizationUrl?: string;
  /**
   * Unique identifier for the provider account resource. This is created during account addition.
   */
  providerId?: number;
};

