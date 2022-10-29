/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type {BaseHttpRequest} from '../core/BaseHttpRequest'
import type {CancelablePromise} from '../core/CancelablePromise'
import type {InstitutionResponse} from '../models/InstitutionResponse'

export class InstitutionsService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Get institutions
   * Yodlee classifies providers into credential-based aggregation and Open Banking (OB) providers. The get institutions service helps in identifying credential and related OB sites in a financial institution. The service searches for an institution regardless of the authentication types associated with the providers. Using the get institutions service, retrieve institutions enabled for the customer, search an institution by its name or routing number, and retrieve the popular institutions for a region. Searching for an institution using a routing number applies only to the USA and Canada regions.<br> The valid values for the priority parameter are: <br/> 1.  all: Returns all the institutions enabled for the customer (the default value for the priority parameter).<br/> 2.  search: Returns institutions matching the name provided by the user. The name parameter is mandatory if the priority parameter is set as search.<br/> 3.  popular: Returns institutions that are popular among the customer's users.<br/> Only the datasets, attributes, and containers that are enabled for the customer will be returned in the response.<br/>Input for the dataset$filter should adhere to the following expression:<dataset.name>[<attribute.name>.container[<container> OR <container>] OR <attribute.name>.container[<container>]] <br>OR <dataset.name>[<attribute.name> OR <attribute.name>]<br><b>dataset$filter value examples:</b><br>ACCT_PROFILE[FULL_ACCT_NUMBER.container[bank OR investment OR creditCard]]<br>ACCT_PROFILE[FULL_ACCT_NUMBER.container[bank]]<br>BASIC_AGG_DATA[ACCOUNT_DETAILS.container[bank OR investment] OR HOLDINGS.container[bank]] OR ACCT_PROFILE[FULL_ACCT_NUMBER.container[bank]]<br>BASIC_AGG_DATA<br>BASIC_AGG_DATA OR ACCT_PROFILE<br>BASIC_AGG_DATA [ ACCOUNT_DETAILS OR HOLDINGS ]<br>BASIC_AGG_DATA [ ACCOUNT_DETAILS] OR DOCUMENT <br>BASIC_AGG_DATA [ BASIC_ACCOUNT_INFO OR ACCOUNT_DETAILS ] <br><br>The skip and top parameters are used for pagination. In the skip and top parameters, pass the number of records to be skipped and retrieved, respectively.<br>The response header provides the links to retrieve the next and previous set of transactions.<br><br><b>Note:</b> <br><br/> 1. If no value is set for the priority parameter, all the institutions enabled for the customer will be returned.<br/> 2. In a product flow involving user interaction, Yodlee recommends invoking this service with filters.<br/> Without filters, the service may perform slowly as it takes a few minutes to return data in the response.<br/> 3. The response includes comma separated provider IDs that are associated with the institution.<br/> 4. This service supports the localization feature and accepts locale as a header parameter.<br>
   * @returns InstitutionResponse OK
   * @throws ApiError
   */
  public getInstitutions({
    datasetFilter,
    name,
    priority,
    providerId,
    skip,
    top,
  }: {
    /**
     * Expression to filter the providers by dataset(s) or dataset attribute(s). The default value will be the dataset or dataset attributes configured as default for the customer.
     */
    datasetFilter?: string
    /**
     * Name in minimum 1 character or routing number.
     */
    name?: string
    /**
     * Search priority
     */
    priority?: string
    /**
     * providerId
     */
    providerId?: number
    /**
     * skip (Min 0) - This is not applicable along with 'name' parameter.
     */
    skip?: number
    /**
     * top (Max 500) - This is not applicable along with 'name' parameter.
     */
    top?: number
  }): CancelablePromise<InstitutionResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/institutions',
      query: {
        dataset$filter: datasetFilter,
        name: name,
        priority: priority,
        providerId: providerId,
        skip: skip,
        top: top,
      },
      errors: {
        400: `Y800 : Invalid value for priority<br>Y800 : Invalid value for skip<br>Y804 : Permitted values of top between 1 - 500<br>Y821 : Dataset not supported<br>`,
        401: `Unauthorized`,
        404: `Not Found`,
      },
    })
  }
}
