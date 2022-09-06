/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CobrandLoginRequest } from '../models/CobrandLoginRequest';
import type { CobrandLoginResponse } from '../models/CobrandLoginResponse';
import type { CobrandNotificationResponse } from '../models/CobrandNotificationResponse';
import type { CobrandPublicKeyResponse } from '../models/CobrandPublicKeyResponse';
import type { CreateCobrandNotificationEventRequest } from '../models/CreateCobrandNotificationEventRequest';
import type { UpdateCobrandNotificationEventRequest } from '../models/UpdateCobrandNotificationEventRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class CobrandService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Cobrand Login
   * The cobrand login service authenticates a cobrand.<br>Cobrand session in the response includes the cobrand session token (cobSession) <br>which is used in subsequent API calls like registering or signing in the user. <br>The idle timeout for a cobrand session is 2 hours and the absolute timeout is 24 hours. This service can be <br>invoked to create a new cobrand session token. <br><b>Note:</b> This endpoint is deprecated for customers using the API Key-based authentication and is applicable only to customers who use the SAML-based authentication.<br>The content type has to be passed as application/json for the body parameter. <br>
   * @returns CobrandLoginResponse OK
   * @throws ApiError
   */
  public cobrandLogin({
    cobrandLoginRequest,
  }: {
    /**
     * cobrandLoginRequest
     */
    cobrandLoginRequest: CobrandLoginRequest,
  }): CancelablePromise<CobrandLoginResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/cobrand/login',
      body: cobrandLoginRequest,
      errors: {
        400: `Y800 : Invalid value for cobrandParam`,
        401: `Y003 : Account is locked, contact Yodlee customer care<br>Y001 : User name and password required`,
        404: `Not Found`,
      },
    });
  }

  /**
   * @deprecated
   * Subscribe Event
   * <b>Refer POST /configs/notifications/events/{eventName}.</b><br>The subscribe events service is used to subscribe to an event for receiving notifications.<br>The callback URL, where the notification will be posted should be provided to this service.<br>If the callback URL is invalid or inaccessible, the subscription will be unsuccessful, and an error will be thrown.<br>Customers can subscribe to REFRESH,DATA_UPDATES and AUTO_REFRESH_UPDATES event.<br><br><b>Notes</b>:<br>This service is not available in developer sandbox/test environment and will be made available for testing in your dedicated environment, once the contract is signed.<br>The content type has to be passed as application/json for the body parameter.<br>
   * @returns any OK
   * @throws ApiError
   */
  public createSubscriptionEvent({
    eventName,
    eventRequest,
  }: {
    /**
     * eventName
     */
    eventName: 'REFRESH' | 'DATA_UPDATES' | 'AUTO_REFRESH_UPDATES',
    /**
     * eventRequest
     */
    eventRequest: CreateCobrandNotificationEventRequest,
  }): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/cobrand/config/notifications/events/{eventName}',
      path: {
        'eventName': eventName,
      },
      body: eventRequest,
      errors: {
        400: `Y803 : eventName required<br>Y803 : callbackUrl required<br>Y800 : Invalid value for callbackUrl`,
        401: `Unauthorized`,
        404: `Not Found`,
      },
    });
  }

  /**
   * @deprecated
   * Delete Subscription
   * <b>Refer DELETE /configs/notifications/events/{eventName}.</b><br>The delete events service is used to unsubscribe from an events service.<br>
   * @returns void
   * @throws ApiError
   */
  public deleteSubscribedEvent({
    eventName,
  }: {
    /**
     * eventName
     */
    eventName: 'REFRESH' | 'DATA_UPDATES' | 'AUTO_REFRESH_UPDATES',
  }): CancelablePromise<void> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/cobrand/config/notifications/events/{eventName}',
      path: {
        'eventName': eventName,
      },
      errors: {
        400: `Y803 : eventName required`,
        401: `Unauthorized`,
        404: `Not Found`,
      },
    });
  }

  /**
   * @deprecated
   * Update Subscription
   * <b>Refer PUT /configs/notifications/events/{eventName}.</b><br>The update events service is used to update the callback URL.<br>If the callback URL is invalid or inaccessible, the subscription will be unsuccessful, and an error will be thrown.<br><b>Note:</b> The content type has to be passed as application/json for the body parameter. <br>
   * @returns void
   * @throws ApiError
   */
  public updateSubscribedEvent({
    eventName,
    eventRequest,
  }: {
    /**
     * eventName
     */
    eventName: 'REFRESH' | 'DATA_UPDATES' | 'AUTO_REFRESH_UPDATES',
    /**
     * eventRequest
     */
    eventRequest: UpdateCobrandNotificationEventRequest,
  }): CancelablePromise<void> {
    return this.httpRequest.request({
      method: 'PUT',
      url: '/cobrand/config/notifications/events/{eventName}',
      path: {
        'eventName': eventName,
      },
      body: eventRequest,
      errors: {
        400: `Y803 : eventName required<br>Y803 : callbackUrl required<br>Y800 : Invalid value for callbackUrl`,
        401: `Unauthorized`,
        404: `Not Found`,
      },
    });
  }

  /**
   * Cobrand Logout
   * The cobrand logout service is used to log out the cobrand.<br>This service does not return a response. The HTTP response code is 204 (Success with no content).<br><b>Note:</b> This endpoint is deprecated for customers using the API Key-based authentication and is applicable only to customers who use the SAML-based authentication.<br>
   * @returns void
   * @throws ApiError
   */
  public cobrandLogout(): CancelablePromise<void> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/cobrand/logout',
      errors: {
        401: `Unauthorized`,
        404: `Not Found`,
      },
    });
  }

  /**
   * @deprecated
   * Get Subscribed Events
   * <b>Refer GET /configs/notifications/events.</b><br>The get events service provides the list of events for which consumers subscribed <br>to receive notifications. <br>
   * @returns CobrandNotificationResponse OK
   * @throws ApiError
   */
  public getSubscribedEvents({
    eventName,
  }: {
    /**
     * eventName
     */
    eventName?: 'REFRESH' | 'DATA_UPDATES' | 'AUTO_REFRESH_UPDATES',
  }): CancelablePromise<CobrandNotificationResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/cobrand/config/notifications/events',
      query: {
        'eventName': eventName,
      },
      errors: {
        401: `Unauthorized`,
        404: `Not Found`,
      },
    });
  }

  /**
   * @deprecated
   * Get Public Key
   * <b>Refer GET /configs/publicKey.</b><br>The get public key service provides the customer the public key that should be used to encrypt the user credentials before sending it to Yodlee.<br>This endpoint is useful only for PKI enabled.<br>
   * @returns CobrandPublicKeyResponse OK
   * @throws ApiError
   */
  public getPublicKey(): CancelablePromise<CobrandPublicKeyResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/cobrand/publicKey',
      errors: {
        401: `Unauthorized`,
        404: `Not Found`,
      },
    });
  }

}
