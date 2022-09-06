/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ConsentResponse } from '../models/ConsentResponse';
import type { CreateConsentRequest } from '../models/CreateConsentRequest';
import type { CreatedConsentResponse } from '../models/CreatedConsentResponse';
import type { RenewConsentRequest } from '../models/RenewConsentRequest';
import type { RenewConsentResponse } from '../models/RenewConsentResponse';
import type { UpdateConsentRequest } from '../models/UpdateConsentRequest';
import type { UpdatedConsentResponse } from '../models/UpdatedConsentResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class ConsentsService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Get Authorization Details
   * The get authorization URL for consent service provides the authorization URL for the renew consent flow, within the consent dashboard.<b>Note:</b>This service supports the localization feature and accepts locale as a header parameter.<br>
   * @returns UpdatedConsentResponse OK
   * @throws ApiError
   */
  public getConsentDetails({
    consentId,
  }: {
    /**
     * Consent Id generated through POST Consent.
     */
    consentId: number,
  }): CancelablePromise<UpdatedConsentResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/consents/{consentId}',
      path: {
        'consentId': consentId,
      },
      errors: {
        400: `Y800 : Invalid value for consentId <br/>`,
        401: `Unauthorized`,
        404: `Not Found`,
      },
    });
  }

  /**
   * Put Consent
   * The update consent service is used to capture the user acceptance of the consent presented to him or her. <br/>This service returns the authorization-redirect URL that should be used to display to the user, the bank's authentication interface.<b>Note:</b>This service supports the localization feature and accepts locale as a header parameter.<br>
   * @returns UpdatedConsentResponse OK
   * @throws ApiError
   */
  public updateConsent({
    consentId,
    consentRequest,
  }: {
    /**
     * Consent Id generated through POST Consent.
     */
    consentId: number,
    /**
     * Applicable Open Banking data cluster values.
     */
    consentRequest: UpdateConsentRequest,
  }): CancelablePromise<UpdatedConsentResponse> {
    return this.httpRequest.request({
      method: 'PUT',
      url: '/consents/{consentId}',
      path: {
        'consentId': consentId,
      },
      body: consentRequest,
      errors: {
        400: `Y800 : Invalid value for consentId <br/>Y800 : Invalid value for consentParam <br/>Y812 : Required field/value - scopeId missing in the consentParam <br/>`,
        401: `Unauthorized`,
        404: `Not Found`,
      },
    });
  }

  /**
   * Renew Consent
   * The consent renewal service is used to renew the consent by validating the consent state. This API supports both UK and AU Open Banking. </br><b>Renewing an UK Open Banking consent:</b><br><li>Before the grace period of 90 days: The consent will be renewed using the third-party provider (TPP) renewal process that Yodlee does, and no consent reauthorisation is required.The API response will contain the complete renewed consent object.</li><li>After the grace period of 90 days: The API will provide an authorisation URL to redirect the user to the financial institution site to complete the consent reauthorization process.<br><b>Renewing an AU Open Banking consent:</b><br><li>Invoke this API, and in the API response, an authorisation URL will be provided to redirect the user to the financial institution site to complete the consent reauthorisation process.</li><br>
   * @returns RenewConsentResponse OK
   * @throws ApiError
   */
  public renewConsent({
    consentId,
    renewConsentRequest,
  }: {
    /**
     * Consent Id to be renewed.
     */
    consentId: number,
    /**
     * renewal entity from consent details service.
     */
    renewConsentRequest?: RenewConsentRequest,
  }): CancelablePromise<RenewConsentResponse> {
    return this.httpRequest.request({
      method: 'PUT',
      url: '/consents/{consentId}/renewal',
      path: {
        'consentId': consentId,
      },
      body: renewConsentRequest,
      errors: {
        400: `Y800 : Invalid value for consentId <br/>Y800 : Invalid value for requestbody <br/>`,
        401: `Unauthorized`,
        404: `Not Found`,
      },
    });
  }

  /**
   * Post Consent
   * The generate consent service is used to generate all the consent information and permissions associated to a provider. <br/>The scope provided in the response is based on the providerId and the datasets provided in the input. <br/>If no dataset value is provided, the datasets that are configured for the customer will be considered. <br/>The configured dataset can be overridden by providing the dataset as an input. <br/>If no applicationName is provided in the input, the default applicationName will be considered. <b>Note:</b>This service supports the localization feature and accepts locale as a header parameter.<br>
   * @returns CreatedConsentResponse OK
   * @throws ApiError
   */
  public createConsent({
    consentRequest,
  }: {
    /**
     * Unique identifier for the provider site(mandatory), the name of the application,  <br/>the flag responsible to include html content in the response, <br/>when passed as true and the name of the dataset attribute supported by the provider.
     */
    consentRequest: CreateConsentRequest,
  }): CancelablePromise<CreatedConsentResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/consents',
      body: consentRequest,
      errors: {
        400: `Y800 : Invalid value for providerId <br/>Y807 : Resource not found <br/>Y800 : Invalid value for consentParam <br/>Y901 : Service not supported <br/>Y800 : Invalid value for applicationName <br/>`,
        401: `Unauthorized`,
        404: `Not Found`,
      },
    });
  }

  /**
   * Get Consents
   * The get consent service is used to retrieve all the consents submitted to Yodlee. <br>The service can be used to build a manage consent interface or a consent dashboard to implement the renew and revoke consent flows.<br><b>Note:</b>This service supports the localization feature and accepts locale as a header parameter.<br>
   * @returns ConsentResponse OK
   * @throws ApiError
   */
  public getConsents({
    consentIds,
    include,
    providerAccountIds,
  }: {
    /**
     * Consent Id generated through POST Consent.
     */
    consentIds?: string,
    /**
     * The flag responsible to include renew details like sharing duration and reauthorization required
     */
    include?: string,
    /**
     * Unique identifier for the provider account resource. This is created during account addition.
     */
    providerAccountIds?: string,
  }): CancelablePromise<ConsentResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/consents',
      query: {
        'consentIds': consentIds,
        'include': include,
        'providerAccountIds': providerAccountIds,
      },
      errors: {
        401: `Unauthorized`,
        404: `Not Found`,
      },
    });
  }

}
