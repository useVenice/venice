/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UpdateUserRequest } from '../models/UpdateUserRequest';
import type { UserAccessTokensResponse } from '../models/UserAccessTokensResponse';
import type { UserDetailResponse } from '../models/UserDetailResponse';
import type { UserRequest } from '../models/UserRequest';
import type { UserResponse } from '../models/UserResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class UserService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Saml Login
   * The SAML login service is used to authenticate system users with a SAML response.<br>A new user will be created with the input provided if that user isn't already in the system.<br>For existing users, the system will make updates based on changes or new information.<br>When authentication is successful, a user session token is returned.<br><br><b>Note:</b> <li>The content type has to be passed as application/x-www-form-urlencoded. <li>issuer, source and samlResponse should be passed as body parameters.</li>
   * @returns UserResponse OK
   * @throws ApiError
   */
  public samlLogin({
    issuer,
    samlResponse,
    source,
  }: {
    /**
     * issuer
     */
    issuer: string,
    /**
     * samlResponse
     */
    samlResponse: string,
    /**
     * source
     */
    source?: string,
  }): CancelablePromise<UserResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/user/samlLogin',
      query: {
        'issuer': issuer,
        'samlResponse': samlResponse,
        'source': source,
      },
      errors: {
        400: `Y013 : Invalid value for samlResponse<br>Y013 : Invalid value for issuer`,
        401: `Unauthorized`,
        404: `Not Found`,
      },
    });
  }

  /**
   * Get Access Tokens
   * The Get Access Tokens service is used to retrieve the access tokens for the application id(s) provided.<br>URL in the response can be used to launch the application for which token is requested.<br><br><b>Note:</b> <li>This endpoint is deprecated for customers using the API Key-based authentication and is applicable only to customers who use the SAML-based authentication.<br>
   * @returns UserAccessTokensResponse OK
   * @throws ApiError
   */
  public getAccessTokens({
    appIds,
  }: {
    /**
     * appIds
     */
    appIds: string,
  }): CancelablePromise<UserAccessTokensResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/user/accessTokens',
      query: {
        'appIds': appIds,
      },
      errors: {
        401: `Unauthorized`,
        404: `Not Found`,
      },
    });
  }

  /**
   * Get User Details
   * The get user details service is used to get the user profile information and the application preferences set at the time of user registration.<br>
   * @returns UserDetailResponse OK
   * @throws ApiError
   */
  public getUser(): CancelablePromise<UserDetailResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/user',
      errors: {
        401: `Unauthorized`,
        404: `Not Found`,
      },
    });
  }

  /**
   * Update User Details
   * The update user details service is used to update user details like name, address, currency preference, etc.<br>Currency provided in the input will be respected in the <a href="https://developer.yodlee.com/api-reference#tag/Derived">derived</a> services and the amount fields in the response will be provided in the preferred currency.<br>The HTTP response code is 204 (Success without content). <br>
   * @returns void
   * @throws ApiError
   */
  public updateUser({
    userRequest,
  }: {
    /**
     * userRequest
     */
    userRequest: UpdateUserRequest,
  }): CancelablePromise<void> {
    return this.httpRequest.request({
      method: 'PUT',
      url: '/user',
      body: userRequest,
      errors: {
        401: `Unauthorized`,
        404: `Not Found`,
      },
    });
  }

  /**
   * Delete User
   * The delete user service is used to delete or unregister a user from Yodlee. <br>Once deleted, the information related to the users cannot be retrieved. <br>The HTTP response code is 204 (Success without content)<br>
   * @returns void
   * @throws ApiError
   */
  public unregister(): CancelablePromise<void> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/user/unregister',
      errors: {
        401: `Unauthorized`,
        404: `Not Found`,
      },
    });
  }

  /**
   * Register User
   * The register user service is used to register a user in Yodlee.<br>The loginName cannot include spaces and must be between 3 and 150 characters.<br>locale passed must be one of the supported locales for the customer. <br>Currency provided in the input will be respected in the derived services and the amount fields in the response will be provided in the preferred currency.<br>userParam is accepted as a body parameter. <br><br><b>Note:</b> <li>The content type has to be passed as application/json for the body parameter.</li>
   * @returns UserResponse Login Successful
   * @throws ApiError
   */
  public registerUser({
    userRequest,
  }: {
    /**
     * userRequest
     */
    userRequest: UserRequest,
  }): CancelablePromise<UserResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/user/register',
      body: userRequest,
      errors: {
        400: `Y800 : Invalid value for loginName<br>Y800 : Invalid value for email<br>Y801 : Invalid length for loginName<br>`,
        401: `Unauthorized`,
        404: `Not Found`,
      },
    });
  }

  /**
   * User Logout
   * <b>Deprecated</b>: This endpoint is deprecated for API Key-based authentication. The user logout service allows the user to log out of the application.<br>The service does not return a response body. The HTTP response code is 204 (Success with no content).<br>
   * @returns void
   * @throws ApiError
   */
  public userLogout(): CancelablePromise<void> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/user/logout',
      errors: {
        401: `Unauthorized`,
        404: `Not Found`,
      },
    });
  }

}
