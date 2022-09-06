/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AddedProviderAccountResponse } from '../models/AddedProviderAccountResponse';
import type { ProviderAccountDetailResponse } from '../models/ProviderAccountDetailResponse';
import type { ProviderAccountPreferencesRequest } from '../models/ProviderAccountPreferencesRequest';
import type { ProviderAccountRequest } from '../models/ProviderAccountRequest';
import type { ProviderAccountResponse } from '../models/ProviderAccountResponse';
import type { ProviderAccountUserProfileResponse } from '../models/ProviderAccountUserProfileResponse';
import type { UpdatedProviderAccountResponse } from '../models/UpdatedProviderAccountResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class ProviderAccountsService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Update Preferences
   * This endpoint is used to update preferences like data extracts and auto refreshes without triggering refresh for the providerAccount.<br>Setting isDataExtractsEnabled to false will not trigger data extracts notification and dataExtracts/events will not reflect any data change that is happening for the providerAccount.<br>Modified data will not be provided in the dataExtracts/userData endpoint.<br>Setting isAutoRefreshEnabled to false will not trigger auto refreshes for the provider account.<br>
   * @returns void
   * @throws ApiError
   */
  public updatePreferences({
    preferences,
    providerAccountId,
  }: {
    /**
     * preferences
     */
    preferences: ProviderAccountPreferencesRequest,
    /**
     * providerAccountId
     */
    providerAccountId: number,
  }): CancelablePromise<void> {
    return this.httpRequest.request({
      method: 'PUT',
      url: '/providerAccounts/{providerAccountId}/preferences',
      path: {
        'providerAccountId': providerAccountId,
      },
      body: preferences,
      errors: {
        400: `Y800 : Invalid value for preferences<br>Y800 : Invalid value for preferences.isDataExtractsEnabled<br>Y800 : Invalid value for preferences.isAutoRefreshEnabled<br>Y807 : Resource not found<br>Y830 : Data extracts feature has to be enabled to set preferences.isDataExtractsEnabled as true<br>Y830 : Auto refresh feature has to be enabled to set preferences.isAutoRefreshEnabled as true<br>Y868 : No action is allowed, as the data is being migrated to the Open Banking provider<br>`,
        401: `Unauthorized`,
        404: `Not Found`,
      },
    });
  }

  /**
   * Get Provider Account Details
   * The get provider account details service is used to learn the status of adding accounts and updating accounts.<br>This service has to be called continuously to know the progress level of the triggered process. This service also provides the MFA information requested by the provider site.<br>When <i>include = credentials</i>, questions is passed as input, the service returns the credentials (non-password values) and questions stored in the Yodlee system for that provider account. <br><br><b>Note:</b> <li>The password and answer fields are not returned in the response.</li>
   * @returns ProviderAccountDetailResponse OK
   * @throws ApiError
   */
  public getProviderAccount({
    providerAccountId,
    include,
    requestId,
  }: {
    /**
     * providerAccountId
     */
    providerAccountId: number,
    /**
     * include credentials,questions
     */
    include?: string,
    /**
     * The unique identifier for the request that returns contextual data
     */
    requestId?: string,
  }): CancelablePromise<ProviderAccountDetailResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/providerAccounts/{providerAccountId}',
      path: {
        'providerAccountId': providerAccountId,
      },
      query: {
        'include': include,
        'requestId': requestId,
      },
      errors: {
        400: `Y800 : Invalid value for providerAccountId<br>Y816 : questions can only be requested for questionAndAnswer Supported Sites`,
        401: `Unauthorized`,
        404: `Not Found`,
      },
    });
  }

  /**
   * Delete Provider Account
   * The delete provider account service is used to delete a provider account from the Yodlee system. This service also deletes the accounts that are created in the Yodlee system for that provider account. <br>This service does not return a response. The HTTP response code is 204 (Success with no content).<br>
   * @returns any OK
   * @throws ApiError
   */
  public deleteProviderAccount({
    providerAccountId,
  }: {
    /**
     * providerAccountId
     */
    providerAccountId: number,
  }): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/providerAccounts/{providerAccountId}',
      path: {
        'providerAccountId': providerAccountId,
      },
      errors: {
        400: `Y800 : Invalid value for providerAccountId<br>Y868 : No action is allowed, as the data is being migrated to the Open Banking provider<br>`,
        401: `Unauthorized`,
        404: `Not Found`,
      },
    });
  }

  /**
   * Add Account
   * The add account service is used to link the user's account with the provider site in the Yodlee system. Providers that require multifactor authentication or open banking are also supported by this service. The response includes the Yodlee generated ID (providerAccountId) of the account along with the refresh information.<br><br>Open Banking Implementation Notes: <br>To link the user's account of the Open Banking provider site in the Yodlee system, pass the field entity that contains:<br>1. id - From the authParameters provided in the get provider details service<br>2. value - From the redirect URL of the Open Banking site<br><br>Credential-based Implementation Notes: <br>1. The loginForm or the field array are the objects under the provider object, obtained from the <a href="https://developer.yodlee.com/apidocs/index.php#!/providers/getSiteDetail">get provider details</a> service response.<br>2. The credentials provided by the user should be embedded in the loginForm or field array object.<br>3. While testing the <a href="https://developer.yodlee.com/KnowledgeBase/How_to_use_PKI">PKI feature</a>, encrypt the credentials using the <a href="https://developer.yodlee.com/apidocs/utility/encrypt.html">encryption utility</a>.<br>4. The data to be retrieved from the provider site can be passed using datasetName or dataset. If datasetName is passed, all the attributes that are implicitly configured for the dataset will be retrieved.<br>5. If the customer has not subscribed to the REFRESH event webhooks notification for accounts that require multifactor authentication (MFA), the get providerAccount service has to be called continuously till the login form (supported types are token, question & answer, and captcha) is returned in the response.<br>6. The <a href="https://developer.yodlee.com/apidocs/index.php#!/providerAccounts/updateAccount">update account</a> service should be called to post the MFA information to continue adding the account.<br><br>Generic Implementation Notes:<br>1. Refer to the <a href="https://developer.yodlee.com/Yodlee_API/docs/v1_1/API_Flow">add account</a> flow chart for implementation.<br>2. The get provider account details has <a href="https://developer.yodlee.com/Yodlee_API/docs/v1_1/Webhooks">webhooks support</a>. If the customer has subscribed to the REFRESH event notification and has invoked this service to add an account, relevant notifications will be sent to the callback URL.<br>3. If you had not subscribed for notifications, the <a href="https://developer.yodlee.com/apidocs/index.php#!/providerAccounts/getRefreshForProviderAccount">get provider account </a> details service has to be polled continuously till the account addition status is FAILED or PARTIAL_SUCCESS or SUCCESS. <br>4. A dataset may depend on another dataset for retrieval, so the response will include the requested datasets and the dependent datasets.<br>   It is necessary to check all the dataset additional statuses returned in the response, as the provider account status is drawn from the dataset additional statuses.<br>5. Pass linkedProviderAccountId in the input to link a user's credential-based providerAccount with the open banking providerAccount. Ensure that the credential-based providerAccount belongs to the same institution. <br>6. The content type has to be passed as application/json in the body parameter.
   * @returns AddedProviderAccountResponse OK
   * @throws ApiError
   */
  public linkProviderAccount({
    providerAccountRequest,
    providerId,
  }: {
    /**
     * loginForm or field entity
     */
    providerAccountRequest: ProviderAccountRequest,
    /**
     * providerId
     */
    providerId: number,
  }): CancelablePromise<AddedProviderAccountResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/providerAccounts',
      query: {
        'providerId': providerId,
      },
      body: providerAccountRequest,
      errors: {
        400: `Y803 : providerId is mandatory<br>Y803 : Invalid value for credentialsParam<br>Y400 : id and value in credentialsParam are mandatory<br>Y901 : Service not supported`,
        401: `Unauthorized`,
        404: `Not Found`,
      },
    });
  }

  /**
   * Get Provider Accounts
   * The get provider accounts service is used to return all the provider accounts added by the user. <br>This includes the failed and successfully added provider accounts.<br>
   * @returns ProviderAccountResponse OK
   * @throws ApiError
   */
  public getAllProviderAccounts({
    include,
    providerIds,
  }: {
    /**
     * include
     */
    include?: string,
    /**
     * Comma separated providerIds.
     */
    providerIds?: string,
  }): CancelablePromise<ProviderAccountResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/providerAccounts',
      query: {
        'include': include,
        'providerIds': providerIds,
      },
      errors: {
        401: `Unauthorized`,
        404: `Not Found`,
      },
    });
  }

  /**
   * Update Account
   * <b>Credential-based Implementation Notes:</b> <br>The update account API is used to:  &bull; Retrieve the latest information for accounts that belong to one providerAccount from the provider site. You must allow at least 15 min between requests. <br> &bull; Update account credentials when the user has changed the authentication information at the provider site. <br> &bull; Post MFA information for the MFA-enabled provider accounts during add and update accounts. <br> &bull; Retrieve the latest information of all the eligible accounts that belong to the user. <br><br><b>Edit Credentials - Notes: </b> <br> &bull; If credentials have to be updated in the Yodlee system, one of the following should be provided: <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#9702; LoginForm <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#9702; Field array <br> &bull; LoginForm or the field array, can be obtained from the GET providerAccounts/{providerAccountId}?include=credentials API response. <br> &bull; The credentials provided by the user should be embedded in the loginForm or field array object before you pass to this API. <br><b>Posting MFA Info - Notes: </b> <br>1. You might receive the MFA request details to be presented to the end user in the GET providerAccounts/{providerAccount} API during polling or through REFRESH webhooks notificaiton. <br>2. After receiving the inputs from your user: <br>&nbsp;&nbsp;&nbsp;&nbsp;a.Embed the MFA information provided by the user in the loginForm or field array object.<br>&nbsp;&nbsp;&nbsp;&nbsp;b.Pass one of the following objects as input to this API:<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&bull; LoginForm<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&bull; Field array<br/><br><b>Points to consider:</b><br>&bull; Data to be retrieved from the provider site can be overridden using datasetName or dataset. If you do pass datasetName, all the datasets that are implicitly configured for <br>the dataset will be retrieved. This action is allowed for edit credentials and single provider account refresh flows only. <br>&bull; Encrypt the credentials and MFA information using the public key.<br>&bull; While testing the PKI feature in sandbox environment, encrypt the password credentials and answers to the MFA questions using the encryption tool.<br/><br><b>--------------------------------------------------------------------------------------------------------------------------------</b><br><b>Open Banking (OB)-based Authentication - Notes:</b><br>The update account API is used to:<br>&bull; Retrieve the latest information for accounts from the provider site.<br>&bull; Update the renewed consent for an existing provider account.<br>&bull; Retrieve the latest information for all the eligible accounts that belong to the user.<br/><br>Yodlee recommendations: <br/>&bull; Create the field entity with the authParameters provided in the get provider details API.<br>&bull; Populate the field entity with the values received from the OB site and pass it to this API.<br/><br><b>--------------------------------------------------------------------------------------------------------------------------------</b><br><b>Update All Eligible Accounts - Notes: </b><br>&bull; This API will trigger a refresh for all the eligible provider accounts(both OB and credential-based accounts).<br>&bull; This API will not refresh closed, inactive, or UAR accounts, or accounts with refreshes in-progress or recently refreshed non-OB accounts.<br>&bull; No parameters should be passed to this API to trigger this action.<br>&bull; Do not call this API often. Our recommendation is to call this only at the time the user logs in to your app because it can hamper other API calls performance. <br>&bull; The response only contains information for accounts that were refreshed. If no accounts are eligible for refresh, no response is returned.<br/><br><b>--------------------------------------------------------------------------------------------------------------------------------</b><br><b>What follows are common to both OB and credential-based authentication implementations:  </b><br>&bull; Check the status of the providerAccount before invoking this API. Do not call this API to trigger any action on a providerAccount when an action is already in progress for the providerAccount. <br>&bull; If the customer has subscribed to the REFRESH event notification and invoked this API, relevant notifications will be sent to the customer.<br>&bull; A dataset may depend on another dataset for retrieval, so the response will include the requested and dependent datasets.<br>&bull; Check all the dataset additional statuses returned in the response because the provider account status is drawn from the dataset additional statuses.<br>&bull; Updating preferences using this API will trigger refreshes.<br>&bull; Pass linkedProviderAccountId in the input to link a user's credential-based providerAccount with the OB providerAccount or viceversa. Ensure that the both the providerAccounts belong to the same institution. <br>&bull; The content type has to be passed as application/json for the body parameter.<br>
   * @returns UpdatedProviderAccountResponse OK
   * @throws ApiError
   */
  public editCredentialsOrRefreshProviderAccount({
    providerAccountIds,
    providerAccountRequest,
  }: {
    /**
     * comma separated providerAccountIds
     */
    providerAccountIds: string,
    /**
     * loginForm or field entity
     */
    providerAccountRequest?: ProviderAccountRequest,
  }): CancelablePromise<UpdatedProviderAccountResponse> {
    return this.httpRequest.request({
      method: 'PUT',
      url: '/providerAccounts',
      query: {
        'providerAccountIds': providerAccountIds,
      },
      body: providerAccountRequest,
      errors: {
        400: `Y805 : Multiple providerAccountId not supported for updating credentials<br>Y800 : Invalid value for credentialsParam<br>Y400 : id and value in credentialsParam are mandatory<br>Y806 : Invalid input<br>Y823 : Credentials are not applicable for real estate aggregated / manual accounts<br>Y868 : No action is allowed, as the data is being migrated to the Open Banking provider<br>`,
        401: `Unauthorized`,
        404: `Not Found`,
      },
    });
  }

  /**
   * @deprecated
   * Get User Profile Details
   * <b>Refer GET /verification/holderProfile</b><br>The get provider accounts profile service is used to return the user profile details that are associated to the provider account. <br>
   * @returns ProviderAccountUserProfileResponse OK
   * @throws ApiError
   */
  public getProviderAccountProfiles({
    providerAccountId,
  }: {
    /**
     * Comma separated providerAccountIds.
     */
    providerAccountId?: string,
  }): CancelablePromise<ProviderAccountUserProfileResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/providerAccounts/profile',
      query: {
        'providerAccountId': providerAccountId,
      },
      errors: {
        401: `Unauthorized`,
        404: `Not Found`,
      },
    });
  }

}
