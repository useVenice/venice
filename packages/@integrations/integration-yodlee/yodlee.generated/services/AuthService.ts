/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ApiKeyRequest } from '../models/ApiKeyRequest';
import type { ApiKeyResponse } from '../models/ApiKeyResponse';
import type { ClientCredentialTokenResponse } from '../models/ClientCredentialTokenResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class AuthService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Generate Access Token
   * <b>Generate Access Token using client credential authentication.</b><br>This service returns access tokens required to access Yodlee 1.1 APIs. These tokens are the simplest and easiest of several alternatives for authenticating with Yodlee servers.<br>The most commonly used services obtain data specific to an end user (your customer). For these services, you need a <b>user access token</b>. These are simply tokens created with the user name parameter (<b>loginName</b>) set to the id of your end user.  <i><br><br><b>Note:</b> You determine this id and you must ensure it's unique among all your customers.</i> <br><br>Each token issued has an associated user. The token passed in the http headers explicitly names the user referenced in that API call.<br><br>Some of the APIs do administrative work, and don't reference an end user. <br/>One example of administrative work is key management. Another example is registering a new user explicitly, with <b>POST /user/register</b> call or subscribe to webhook, with <b>POST /config/notifications/events/{eventName}</b>. <br/>To invoke these, you need an <b>admin access token</b>. Create this by passing in your admin user login name in place of a regular user name.<br><br>This service also allows for simplified registration of new users. Any time you pass in a user name not already in use, the system will automatically implicitly create a new user for you. <br>This user will naturally have very few associated details. You can later provide additional user information by calling the <b>PUT user/register service</b>.<br><br><b>Notes:</b><ul><li>The header <code>Authorization</code> does not apply to this service.</li><li>The content type has to be passed as application/x-www-form-urlencoded.<li>Upgrading to client credential authentication requires infrastructure reconfiguration. <li>Customers wishing to switch from another authentication scheme to client credential authentication, please contact Yodlee Client Services.</li><li>Default expiry time of user access token and admin access token is 30 minutes.</li></ul>
   * @returns ClientCredentialTokenResponse OK
   * @throws ApiError
   */
  public generateAccessToken({
    clientId,
    secret,
  }: {
    /**
     * clientId issued by Yodlee is used to generate the OAuth token for authentication.
     */
    clientId?: string,
    /**
     * secret issued by Yodlee is used to generate the OAuth token for authentication.
     */
    secret?: string,
  }): CancelablePromise<ClientCredentialTokenResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/auth/token',
      formData: {
        'clientId': clientId,
        'secret': secret,
      },
      errors: {
        400: `Y800 : Invalid value for loginName<br>Y806 : Invalid input<br>Y801 : Invalid length for loginName<br>Y303 : clientId or secret is missing<br>Y301 : Invalid clientId or secret<br>Y305 : Access token can be issued only for pre-registered users<br>Y004 : Inactive user<br>Y901 : Service not supported<br>`,
        401: `Y016 : loginName header missing<br>Y015 : Unauthorized User<br>Y016 : Api-Version header missing<br>Y020 : Invalid token in authorization header<br>Y027 : Unsupported authentication type`,
        404: `Not Found`,
      },
    });
  }

  /**
   * Delete Token
   * This endpoint revokes the token passed in the Authorization header. This service is applicable for JWT-based (and all API key-based) authentication and also client credential (clientId and secret) based authentication. This service does not return a response body. The HTTP response code is 204 (success with no content). <br>Tokens generally have limited lifetime of up to 30 minutes. You will call this service when you finish working with one user, and you want to delete the valid token rather than simply letting it expire.<br><br><b>Note:</b> <li>Revoking an access token (either type, admin or a user token) can take up to 2 minutes, as the tokens are stored on a distributed system.<br/>
   * @returns void
   * @throws ApiError
   */
  public deleteToken(): CancelablePromise<void> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/auth/token',
      errors: {
        401: `Y020 : Invalid token in authorization header<br>Y023 : Token has expired<br>Y016 : Api-Version header missing<br>Y015 : Unauthorized User<br>Y027 : Unsupported authentication type<br>Y007 : Authorization header missing<br>Y020 : Invalid token in authorization header`,
        404: `Not Found`,
      },
    });
  }

  /**
   * Delete API Key
   * This endpoint allows an existing API key to be deleted.<br>You can use one of the following authorization methods to access this API:<br><ol><li>cobsession</li><li>JWT token</li></ol> <b>Notes:</b> <li>This service is not available in developer sandbox environment and will be made availablefor testing in your dedicated environment.
   * @returns any OK
   * @throws ApiError
   */
  public deleteApiKey({
    key,
  }: {
    /**
     * key
     */
    key: string,
  }): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/auth/apiKey/{key}',
      path: {
        'key': key,
      },
      errors: {
        400: `Y807 : Resource not found<br>Y806 : Invalid input`,
        401: `Unauthorized`,
        404: `Not Found`,
      },
    });
  }

  /**
   * Generate API Key
   * This endpoint is used to generate an API key. The RSA public key you provide should be in 2048 bit PKCS#8 encoded format. <br>A public key is a mandatory input for generating the API key.<br/>The public key should be a unique key. The apiKeyId you get in the response is what you should use to generate the JWT token.<br> You can use one of the following authorization methods to access<br/>this API:<br><ol><li>cobsession</li><li>JWT token</li></ol> Alternatively, you can use base 64 encoded cobrandLogin and cobrandPassword in the Authorization header (Format: Authorization: Basic <encoded value of cobrandLogin: cobrandPassword>)<br><br><b>Note:</b><br><li>This service is not available in developer sandbox environment and will be made available for testing in your dedicated environment. The content type has to be passed as application/json for the body parameter.</li>
   * @returns ApiKeyResponse OK
   * @throws ApiError
   */
  public generateApiKey({
    apiKeyRequest,
  }: {
    /**
     * apiKeyRequest
     */
    apiKeyRequest: ApiKeyRequest,
  }): CancelablePromise<ApiKeyResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/auth/apiKey',
      body: apiKeyRequest,
      errors: {
        400: `Y800 : Invalid value for RS512 publicKey<br>Y806 : Invalid input<br>Y824 : The maximum number of apiKey permitted is 5<br>Y811 : publicKey value already exists`,
        401: `Unauthorized`,
        404: `Not Found`,
      },
    });
  }

  /**
   * Get API Keys
   * This endpoint provides the list of API keys that exist for a customer.<br>You can use one of the following authorization methods to access this API:<br><ol><li>cobsession</li><li>JWT token</li></ol><b>Notes:</b><li>This service is not available in developer sandbox environment and will be made available for testing in your dedicated environment.
   * @returns ApiKeyResponse OK
   * @throws ApiError
   */
  public getApiKeys(): CancelablePromise<ApiKeyResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/auth/apiKey',
      errors: {
        401: `Unauthorized`,
        404: `Not Found`,
      },
    });
  }

}
