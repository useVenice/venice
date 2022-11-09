/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type {BaseHttpRequest} from '../core/BaseHttpRequest'
import type {CancelablePromise} from '../core/CancelablePromise'
import type {ProviderDetailResponse} from '../models/ProviderDetailResponse'
import type {ProviderResponse} from '../models/ProviderResponse'
import type {ProvidersCountResponse} from '../models/ProvidersCountResponse'

export class ProvidersService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Get Providers
   * The get provider service is used to get all the providers that are enabled, search a provider service by name or routing number and get popular sites of a region. <br>Searching for a provider using a routing number is applicable only to the USA and Canada regions.<br>The valid values for priority are: <br>   1. cobrand: Returns providers enabled for the cobrand (Default priority)<br>   2. popular: Returns providers popular among users of the customer<br><br>Only the datasets, attributes, and containers that are enabled for the customer will be returned in the response.<br>Input for the dataset$filter should adhere to the following expression:<br><dataset.name>[<attribute.name>.container[<container> OR <container>] OR <attribute.name>.container[<container>]] <br>OR <dataset.name>[<attribute.name> OR <attribute.name>]<br><b>dataset$filter value examples:</b><br>ACCT_PROFILE[FULL_ACCT_NUMBER.container[bank OR investment OR creditCard]]<br>ACCT_PROFILE[FULL_ACCT_NUMBER.container[bank]]<br>BASIC_AGG_DATA[ACCOUNT_DETAILS.container[bank OR investment] OR HOLDINGS.container[bank]] OR ACCT_PROFILE[FULL_ACCT_NUMBER.container[bank]]<br>BASIC_AGG_DATA<br>BASIC_AGG_DATA OR ACCT_PROFILE<br>BASIC_AGG_DATA [ ACCOUNT_DETAILS OR HOLDINGS ]<br>BASIC_AGG_DATA [ ACCOUNT_DETAILS] OR DOCUMENT <br>BASIC_AGG_DATA [ BASIC_ACCOUNT_INFO OR ACCOUNT_DETAILS ] <br><br>The fullAcountNumberFields is specified to filter the providers that have paymentAccountNumber or unmaskedAccountNumber support in the FULL_ACCT_NUMBER dataset attribute.<br><b>Examples for usage of fullAccountNumberFields </b><br>dataset$filter=ACCT_PROFILE[ FULL_ACCT_NUMBER.container [ bank ]] &amp; fullAccountNumberFields=paymentAccountNumber<br>dataset$filter=ACCT_PROFILE[ FULL_ACCT_NUMBER.container [ bank ]] &amp; fullAccountNumberFields=unmaskedAccountNumber<br>dataset$filter=ACCT_PROFILE[ FULL_ACCT_NUMBER.container [ bank ]] &amp; fullAccountNumberFields=unmaskedAccountNumber,paymentAccountNumber<br><br>The skip and top parameters are used for pagination. In the skip and top parameters, pass the number of records to be skipped and retrieved, respectively.<br>The response header provides the links to retrieve the next and previous set of transactions.<br><br><b>Note:</b> <ol><li>In a product flow involving user interaction, Yodlee recommends invoking this service with filters.<li>Without filters, the service may perform slowly as it takes a few minutes to return data in the response.<li>The AuthParameter appears in the response only in case of token-based aggregation sites.<li>The pagination feature only applies when the priority parameter is set as cobrand. If no values are provided in the skip and top parameters, the API will only return the first 500 records.<li>This service supports the localization feature and accepts locale as a header parameter.<li>The capability has been deprecated in query parameter and response.</li></ol>
   * @returns ProviderResponse OK
   * @throws ApiError
   */
  public getAllProviders({
    capability,
    datasetFilter,
    fullAccountNumberFields,
    institutionId,
    name,
    priority,
    providerId,
    skip,
    top,
  }: {
    /**
     * CHALLENGE_DEPOSIT_VERIFICATION - capability search is deprecated
     */
    capability?: string
    /**
     * Expression to filter the providers by dataset(s) or dataset attribute(s). The default value will be the dataset or dataset attributes configured as default for the customer.
     */
    datasetFilter?: string
    /**
     * Specify to filter the providers with values paymentAccountNumber,unmaskedAccountNumber.
     */
    fullAccountNumberFields?: string
    /**
     * Institution Id for Single site selection
     */
    institutionId?: number
    /**
     * Name in minimum 1 character or routing number.
     */
    name?: string
    /**
     * Search priority
     */
    priority?: string
    /**
     * Max 5 Comma seperated Provider Ids
     */
    providerId?: string
    /**
     * skip (Min 0) - This is not applicable along with 'name' parameter.
     */
    skip?: number
    /**
     * top (Max 500) - This is not applicable along with 'name' parameter.
     */
    top?: number
  }): CancelablePromise<ProviderResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/providers',
      query: {
        capability: capability,
        dataset$filter: datasetFilter,
        fullAccountNumberFields: fullAccountNumberFields,
        institutionId: institutionId,
        name: name,
        priority: priority,
        providerId: providerId,
        skip: skip,
        top: top,
      },
      errors: {
        400: `Y800 : Invalid value for priority<br>Y800 : Invalid value for providerName<br>Y801 : Invalid length for a site search. The search string must have atleast 1 character<br>Y800 : Invalid value for skip<br>Y804 : Permitted values of top between 1 - 500<br>Y821 : Dataset not supported<br>Y820 : The additionalDataSet is not supported for Get provider API`,
        401: `Unauthorized`,
        404: `Not Found`,
      },
    })
  }

  /**
   * Get Provider Details
   * The get provider detail service is used to get detailed information including the login form for a provider.<br>The response is a provider object that includes information such as name of the provider, <br>provider's base URL, a list of containers supported by the provider, the login form details of the provider, etc.<br>Only enabled datasets, attributes and containers gets returned in the response.<br><br><b>Note:</b><li>This service supports the localization feature and accepts locale as a header parameter.<li>The capability has been deprecated in the response.
   * @returns ProviderDetailResponse OK
   * @throws ApiError
   */
  public getProvider({
    providerId,
  }: {
    /**
     * providerId
     */
    providerId: number
  }): CancelablePromise<ProviderDetailResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/providers/{providerId}',
      path: {
        providerId: providerId,
      },
      errors: {
        400: `Y800 : Invalid value for providerId`,
        401: `Unauthorized`,
        404: `Not Found`,
      },
    })
  }

  /**
   * Get Providers Count
   * The count service provides the total number of providers that get returned in the GET /providers depending on the input parameters passed.<br>If you are implementing pagination for providers, call this endpoint before calling GET /providers to know the number of providers that are returned for the input parameters passed.<br>The functionality of the input parameters remains the same as that of the GET /providers endpoint<br><br><b>Note:</b> <li>The capability has been deprecated in the query parameter.</li>
   * @returns ProvidersCountResponse OK
   * @throws ApiError
   */
  public getProvidersCount({
    capability,
    datasetFilter,
    fullAccountNumberFields,
    name,
    priority,
  }: {
    /**
     * CHALLENGE_DEPOSIT_VERIFICATION - capability search is deprecated
     */
    capability?: string
    /**
     * Expression to filter the providers by dataset(s) or dataset attribute(s). The default value will be the dataset or dataset attributes configured as default for the customer.
     */
    datasetFilter?: string
    /**
     * Specify to filter the providers with values paymentAccountNumber,unmaskedAccountNumber.
     */
    fullAccountNumberFields?: string
    /**
     * Name in minimum 1 character or routing number.
     */
    name?: string
    /**
     * Search priority
     */
    priority?: string
  }): CancelablePromise<ProvidersCountResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/providers/count',
      query: {
        capability: capability,
        dataset$filter: datasetFilter,
        fullAccountNumberFields: fullAccountNumberFields,
        name: name,
        priority: priority,
      },
      errors: {
        400: `Y800 : Invalid value for priority<br>Y800 : Invalid value for providerName<br>Y801 : Invalid length for a site search. The search string must have at least 1 character<br>Y800 : Invalid value for skip<br>Y804 : Permitted values of top between 1 - 500<br>Y821 : Dataset not supported<br>Y820 : The additionalDataSet is not supported for Get provider API`,
        401: `Unauthorized`,
        404: `Not Found`,
      },
    })
  }
}
