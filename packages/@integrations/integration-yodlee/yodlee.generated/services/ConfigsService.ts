/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ConfigsNotificationResponse } from '../models/ConfigsNotificationResponse';
import type { ConfigsPublicKeyResponse } from '../models/ConfigsPublicKeyResponse';
import type { CreateConfigsNotificationEventRequest } from '../models/CreateConfigsNotificationEventRequest';
import type { UpdateConfigsNotificationEventRequest } from '../models/UpdateConfigsNotificationEventRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class ConfigsService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Get Subscribed Notification Events
   * The get events service provides the list of events for which consumers subscribed to receive notifications. <br>
   * @returns ConfigsNotificationResponse OK
   * @throws ApiError
   */
  public getSubscribedNotificationEvents({
    eventName,
  }: {
    /**
     * eventName
     */
    eventName?: 'REFRESH' | 'DATA_UPDATES' | 'AUTO_REFRESH_UPDATES' | 'LATEST_BALANCE_UPDATES',
  }): CancelablePromise<ConfigsNotificationResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/configs/notifications/events',
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
   * Get Public Key
   * The get public key service provides the public key that should be used to encrypt user credentials while invoking POST /providerAccounts and PUT /providerAccounts endpoints.<br>This service will only work if the PKI (public key infrastructure) feature is enabled for the customer.<br><br><b>Note:</b><li> The key in the response is a string in PEM format.</li><li>This endpoint is not available in the Sandbox environment and it is useful only if the PKI feature is enabled.</li>
   * @returns ConfigsPublicKeyResponse OK
   * @throws ApiError
   */
  public getPublicEncryptionKey(): CancelablePromise<ConfigsPublicKeyResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/configs/publicKey',
      errors: {
        401: `Unauthorized`,
        404: `Not Found`,
      },
    });
  }

  /**
   * Subscribe For Notification Event
   * The subscribe events service is used to subscribe to an event for receiving notifications.<br>The callback URL, where the notification will be posted should be provided to this service.<br>If the callback URL is invalid or inaccessible, the subscription will be unsuccessful, and an error will be thrown.<br>Customers can subscribe to REFRESH,DATA_UPDATES,AUTO_REFRESH_UPDATES and LATEST_BALANCE_UPDATES event.<br><br><b>Notes:</b><li>This service is not available in developer sandbox/test environment and will be made available for testing in your dedicated environment, once the contract is signed.<li>The content type has to be passed as application/json for the body parameter.</li>
   * @returns any OK
   * @throws ApiError
   */
  public createSubscriptionNotificationEvent({
    eventName,
    eventRequest,
  }: {
    /**
     * eventName
     */
    eventName: 'REFRESH' | 'DATA_UPDATES' | 'AUTO_REFRESH_UPDATES' | 'LATEST_BALANCE_UPDATES',
    /**
     * eventRequest
     */
    eventRequest: CreateConfigsNotificationEventRequest,
  }): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/configs/notifications/events/{eventName}',
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
   * Delete Notification Subscription
   * The delete events service is used to unsubscribe from an events service.<br>
   * @returns void
   * @throws ApiError
   */
  public deleteSubscribedNotificationEvent({
    eventName,
  }: {
    /**
     * eventName
     */
    eventName: 'REFRESH' | 'DATA_UPDATES' | 'AUTO_REFRESH_UPDATES' | 'LATEST_BALANCE_UPDATES',
  }): CancelablePromise<void> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/configs/notifications/events/{eventName}',
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
   * Update Notification Subscription
   * The update events service is used to update the callback URL.<br>If the callback URL is invalid or inaccessible, the subscription will be unsuccessful, and an error will be thrown.<br><br><b>Note:</b> <li>The content type has to be passed as application/json for the body parameter. <br>
   * @returns void
   * @throws ApiError
   */
  public updateSubscribedNotificationEvent({
    eventName,
    eventRequest,
  }: {
    /**
     * eventName
     */
    eventName: 'REFRESH' | 'DATA_UPDATES' | 'AUTO_REFRESH_UPDATES' | 'LATEST_BALANCE_UPDATES',
    /**
     * eventRequest
     */
    eventRequest: UpdateConfigsNotificationEventRequest,
  }): CancelablePromise<void> {
    return this.httpRequest.request({
      method: 'PUT',
      url: '/configs/notifications/events/{eventName}',
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

}
