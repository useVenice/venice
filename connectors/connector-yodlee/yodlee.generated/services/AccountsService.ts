/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type {BaseHttpRequest} from '../core/BaseHttpRequest'
import type {CancelablePromise} from '../core/CancelablePromise'
import type {AccountBalanceResponse} from '../models/AccountBalanceResponse'
import type {AccountHistoricalBalancesResponse} from '../models/AccountHistoricalBalancesResponse'
import type {AccountMigrationResponse} from '../models/AccountMigrationResponse'
import type {AccountResponse} from '../models/AccountResponse'
import type {AssociatedAccountsResponse} from '../models/AssociatedAccountsResponse'
import type {CreateAccountRequest} from '../models/CreateAccountRequest'
import type {CreatedAccountResponse} from '../models/CreatedAccountResponse'
import type {EvaluateAddressRequest} from '../models/EvaluateAddressRequest'
import type {EvaluateAddressResponse} from '../models/EvaluateAddressResponse'
import type {UpdateAccountRequest} from '../models/UpdateAccountRequest'

export class AccountsService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Associated Accounts
   * Yodlee classifies providers into credential-based aggregation and Open Banking (OB) providers.<br>This service is associated with the OB aggregation flow. As part of the OB solution, financial institutions may merge their subsidiaries and provide data as a single OB provider.<br>Before the OB solution, this data was aggregated with different provider IDs.<br>This service accepts the providerAccountId and returns all accounts of the associated providerAccounts that belong to the subsidiary of the financial institution.<br>This data should be displayed to the user to let them select the accounts that they wish to provide consent to share account data.<br>
   * @returns AssociatedAccountsResponse OK
   * @throws ApiError
   */
  public getAssociatedAccounts({
    providerAccountId,
  }: {
    /**
     * providerAccountId
     */
    providerAccountId: number
  }): CancelablePromise<AssociatedAccountsResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/accounts/associatedAccounts/{providerAccountId}',
      path: {
        providerAccountId: providerAccountId,
      },
      errors: {
        400: `Y800 : Invalid value for providerAccountId<br>`,
        401: `Unauthorized`,
        404: `Not Found`,
      },
    })
  }

  /**
   * Add Manual Account
   * The add account service is used to add manual accounts.<br>The response of add account service includes the account name , account number and Yodlee generated account id.<br>All manual accounts added will be included as part of networth calculation by default.<br>Add manual account support is available for bank, card, investment, insurance and loan container only.<br><br><b>Note:</b><ul> <li>A real estate account addition is only supported for SYSTEM and MANUAL valuation type.</li></ul>
   * @returns CreatedAccountResponse OK
   * @throws ApiError
   */
  public createManualAccount({
    accountParam,
  }: {
    /**
     * accountParam
     */
    accountParam: CreateAccountRequest
  }): CancelablePromise<CreatedAccountResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/accounts',
      body: accountParam,
      errors: {
        400: `Y800 : Invalid value for accountParam<br>Y811 : Real Estate Property value already exists<br>Y862 : The provided address is invalid, or the valuation is not available<br>Y869 : Multiple matches found. Provide the complete address or call the POST /accounts/evaluateAddress API to retrieve the list of matched addresses<br>`,
        401: `Unauthorized`,
        404: `Not Found`,
      },
    })
  }

  /**
   * Get Accounts
   * The get accounts service provides information about accounts added by the user.<br>By default, this service returns information for active and to be closed accounts.<br>If requestId is provided, the accounts that are updated in the context of the requestId will be provided in the response.<br><br><b>Note:</b><br><ul><li>fullAccountNumber is deprecated and is replaced with fullAccountNumberList in include parameter and response.</li><li>fullAccountNumberList, PII (Personal Identifiable Information) and holder details are not available by default, as it is a premium feature that needs security approval. This will not be available for testing in Sandbox environment.</li></ul>
   * @returns AccountResponse OK
   * @throws ApiError
   */
  public getAllAccounts({
    accountId,
    container,
    include,
    providerAccountId,
    requestId,
    status,
  }: {
    /**
     * Comma separated accountIds.
     */
    accountId?: string
    /**
     * bank/creditCard/investment/insurance/loan/reward/realEstate/otherAssets/otherLiabilities
     */
    container?: string
    /**
     * profile, holder, fullAccountNumber, fullAccountNumberList, paymentProfile, autoRefresh<br><b>Note:</b><br><li>fullAccountNumber is deprecated and is replaced with fullAccountNumberList in include parameter and response.</li><br><li>profile is deprecated, and to retrieve the profile information, call the GET /verification/holderProfile API instead.</li>
     */
    include?: string
    /**
     * Comma separated providerAccountIds.
     */
    providerAccountId?: string
    /**
     * The unique identifier that returns contextual data
     */
    requestId?: string
    /**
     * ACTIVE,INACTIVE,TO_BE_CLOSED,CLOSED
     */
    status?: string
  }): CancelablePromise<AccountResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/accounts',
      query: {
        accountId: accountId,
        container: container,
        include: include,
        providerAccountId: providerAccountId,
        requestId: requestId,
        status: status,
      },
      errors: {
        400: `Y800 : Invalid value for status<br>Y800 : Invalid value for container<br>Y800 : Invalid value for providerAccountId<br>Y824 : The maximum number of accountIds permitted is 100`,
        401: `Unauthorized`,
        404: `Not Found`,
      },
    })
  }

  /**
   * Migrate Accounts
   * This service is associated with the open banking (OB) flow.<br>Before invoking this service, display all the associated accounts to the user by calling the GET /associatedAccounts API.<br>The migrate accounts API treats the user's consent acceptance to initiate account migration. Invoking this service indicates that the user has given the consent to access the associated account information from the financial institution.<br>If an existing provider supports bank, card, and loan accounts, and chose only to provide bank and card through OB APIs, a new providerAccountId for OB will be created.<br>The bank and card account information will be moved to the new providerAccountId. The loan account will be retained in the existing provider account.<br>This service returns the OB providerId and the OB providerAccountId. Note that, as part of this process, there is a possibility of one or more providerAccounts getting merged.<br>The update or delete actions will not be allowed for the providerAccounts involved in the migration process until the user completes the authorization on the OB provider.<br>The oauthMigrationEligibilityStatus attribute in the GET /accounts API response indicates the accounts included in the migration process.<br>
   * @returns AccountMigrationResponse OK
   * @throws ApiError
   */
  public migrateAccounts({
    providerAccountId,
  }: {
    /**
     * providerAccountId
     */
    providerAccountId: number
  }): CancelablePromise<AccountMigrationResponse> {
    return this.httpRequest.request({
      method: 'PUT',
      url: '/accounts/migrateAccounts/{providerAccountId}',
      path: {
        providerAccountId: providerAccountId,
      },
      errors: {
        400: `Y800 : Invalid value for providerAccountId<br>`,
        401: `Unauthorized`,
        404: `Not Found`,
      },
    })
  }

  /**
   * Evaluate Address
   * Use this service to validate the address before adding the real estate account.<br>If the address is valid, the service will return the complete address information.<br>The response will contain multiple addresses if the user-provided input matches with multiple entries in the vendor database.<br>In the case of multiple matches, the user can select the appropriate address from the list and then invoke the add account service with the complete address.<br><br><b>Note:</b> <ul><li>Yodlee recommends to use this service before adding the real estate account to avoid failures.</li></ul>
   * @returns EvaluateAddressResponse OK
   * @throws ApiError
   */
  public evaluateAddress({
    addressParam,
  }: {
    /**
     * addressParam
     */
    addressParam: EvaluateAddressRequest
  }): CancelablePromise<EvaluateAddressResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/accounts/evaluateAddress',
      body: addressParam,
      errors: {
        400: `Y806 : Invalid input<br>Y800 : Invalid value for zip<br>Y812 : Required field/value - address missing in the request<br>Y812 : Required field/value - street missing in the request<br>Y812 : Required field/value - state & city / zip missing in the request`,
        401: `Unauthorized`,
        404: `Not Found`,
      },
    })
  }

  /**
   * Get Account Details
   * The get account details service provides detailed information of an account.<br><br><b>Note:</b><li> fullAccountNumber is deprecated and is replaced with fullAccountNumberList in include parameter and response.</li>
   * @returns AccountResponse OK
   * @throws ApiError
   */
  public getAccount({
    accountId,
    include,
  }: {
    /**
     * accountId
     */
    accountId: number
    /**
     * profile, holder, fullAccountNumber, fullAccountNumberList, paymentProfile, autoRefresh<br><b>Note:</b>fullAccountNumber is deprecated and is replaced with fullAccountNumberList in include parameter and response.
     */
    include?: string
  }): CancelablePromise<AccountResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/accounts/{accountId}',
      path: {
        accountId: accountId,
      },
      query: {
        include: include,
      },
      errors: {
        401: `Unauthorized`,
        404: `Not Found`,
      },
    })
  }

  /**
   * Delete Account
   * The delete account service allows an account to be deleted.<br>This service does not return a response. The HTTP response code is 204 (Success with no content).<br>
   * @returns void
   * @throws ApiError
   */
  public deleteAccount({
    accountId,
  }: {
    /**
     * accountId
     */
    accountId: number
  }): CancelablePromise<void> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/accounts/{accountId}',
      path: {
        accountId: accountId,
      },
      errors: {
        400: `Y800 : Invalid value for accountId<br>Y806 : Invalid input<br>Y807 : Resource not found<br>Y868 : No action is allowed, as the data is being migrated to the Open Banking provider<br>`,
        401: `Unauthorized`,
        404: `Not Found`,
      },
    })
  }

  /**
   * Update Account
   * The update account service is used to update manual and aggregated accounts.<br>The HTTP response code is 204 (Success without content).<br>Update manual account support is available for bank, card, investment, insurance, loan, otherAssets, otherLiabilities and realEstate containers only.<br><br><b>Note:</b><li> A real estate account update is only supported for SYSTEM and MANUAL valuation type.</li> <li> A real estate account can be linked to a loan account by passing accountId of a loan account in linkedAccountIds .</li> <li> Attribute <b>isEbillEnrolled</b> is deprecated as it is applicable for bill accounts only.</li>
   * @returns void
   * @throws ApiError
   */
  public updateAccount({
    accountId,
    accountRequest,
  }: {
    /**
     * accountId
     */
    accountId: number
    /**
     * accountRequest
     */
    accountRequest: UpdateAccountRequest
  }): CancelablePromise<void> {
    return this.httpRequest.request({
      method: 'PUT',
      url: '/accounts/{accountId}',
      path: {
        accountId: accountId,
      },
      body: accountRequest,
      errors: {
        400: `Y800 : Invalid value for accountId<br>Y800 : Invalid value for updateParam<br>Y862 : The provided address is invalid, or the valuation is not available<br>Y868 : No action is allowed, as the data is being migrated to the Open Banking provider<br>Y869 : Multiple matches found. Provide the complete address or call the POST /accounts/evaluateAddress API to retrieve the list of matched addresses<br>`,
        401: `Unauthorized`,
        404: `Not Found`,
      },
    })
  }

  /**
   * Get Historical Balances
   * The historical balances service is used to retrieve the historical balances for an account or a user.<br>Historical balances are daily (D), weekly (W), and monthly (M). <br>The interval input should be passed as D, W, and M to retrieve the desired historical balances. The default interval is daily (D). <br>When no account id is provided, historical balances of the accounts that are active, to be closed, and closed are provided in the response. <br>If the fromDate and toDate are not passed, the last 90 days of data will be provided. <br>The fromDate and toDate should be passed in the YYYY-MM-DD format. <br>The date field in the response denotes the date for which the balance is requested.<br>includeCF needs to be sent as true if the customer wants to return carried forward balances for a date when the data is not available. <br>asofDate field in the response denotes the date as of which the balance was updated for that account.<br>When there is no balance available for a requested date and if includeCF is sent as true, the previous date for which the balance is available is provided in the response. <br>When there is no previous balance available, no data will be sent. <br>By default, pagination is available for the historicalBalances entity in this API. The skip and top parameters are used for pagination. In the skip and top parameters, pass the number of records to be skipped and retrieved, respectively. The response header provides the links to retrieve the next and previous set of historical balances.<br> The API will only retrieve a maximum 500 records by default when values for skip and top parameters are not provided.
   * @returns AccountHistoricalBalancesResponse OK
   * @throws ApiError
   */
  public getHistoricalBalances({
    accountId,
    fromDate,
    includeCf,
    interval,
    skip,
    toDate,
    top,
  }: {
    /**
     * accountId
     */
    accountId?: string
    /**
     * from date for balance retrieval (YYYY-MM-DD)
     */
    fromDate?: string
    /**
     * Consider carry forward logic for missing balances
     */
    includeCf?: boolean
    /**
     * D-daily, W-weekly or M-monthly
     */
    interval?: string
    /**
     * skip (Min 0)
     */
    skip?: number
    /**
     * toDate for balance retrieval (YYYY-MM-DD)
     */
    toDate?: string
    /**
     * top (Max 500)
     */
    top?: number
  }): CancelablePromise<AccountHistoricalBalancesResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/accounts/historicalBalances',
      query: {
        accountId: accountId,
        fromDate: fromDate,
        includeCF: includeCf,
        interval: interval,
        skip: skip,
        toDate: toDate,
        top: top,
      },
      errors: {
        400: `Y800 : Invalid value for accountId<br>Y800 : Invalid value for fromDate<br>Y800 : Invalid value for toDate<br>Y809 : Invalid date range<br>Y800 : Invalid value for interval<br>Y802 : Future date not allowed`,
        401: `Unauthorized`,
        404: `Not Found`,
      },
    })
  }

  /**
   * Get Latest Balances
   * The latest balances service provides the latest account balance by initiating a new balance refresh request
   * @returns AccountBalanceResponse OK
   * @throws ApiError
   */
  public getLatestBalances({
    accountId,
    providerAccountId,
  }: {
    /**
     * Comma separated accountIds.
     */
    accountId: string
    /**
     * providerAccountId.
     */
    providerAccountId: string
  }): CancelablePromise<AccountBalanceResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/accounts/latestBalances',
      query: {
        accountId: accountId,
        providerAccountId: providerAccountId,
      },
      errors: {
        400: `Y800 : Invalid value for providerAccountId<br>Y800 : Invalid value for accountId <br>Y800 : Invalid value for accountId. Only ACTIVE accountId are supported <br>Y901 : Service not supported<br>Y803 : providerAccountId required <br>Y805 : Multiple providerAccountId not supported <br>Y803 : accountId required <br>Y820 : The accountId is not supported for container other than bank, investment<br>Y824 : The maximum number of accountIds permitted is 10<br>Y800 : Invalid value for accountId. All accountIds should belong to the same providerAccountId`,
        401: `Unauthorized`,
        404: `Not Found`,
      },
    })
  }
}
