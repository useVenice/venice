/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type {BaseHttpRequest} from '../core/BaseHttpRequest'
import type {CancelablePromise} from '../core/CancelablePromise'
import type {DataExtractsEventResponse} from '../models/DataExtractsEventResponse'
import type {DataExtractsUserDataResponse} from '../models/DataExtractsUserDataResponse'

export class DataExtractsService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Get userData
   * The get user data service is used to get a user's modified data for a particular period of time for accounts, transactions, holdings, and provider account information.<br>The time difference between fromDate and toDate fields cannot be more than 60 minutes.<br>By default, pagination is available for the transaction entity in this API. In the first response, the API will retrieve 500 transactions along with other data. The response header will provide a link to retrieve the next set of transactions.<br>In the response body of the first API response, totalTransactionsCount indicates the total number of transactions the API will retrieve for the user.<br>This service is only invoked with either admin access token or a cobrand session.<br/>Refer to <a href="https://developer.yodlee.com/docs/api/1.1/DataExtracts">dataExtracts</a> page for more information.<br><br><b>Note:</b><li>This service supports the localization feature and accepts locale as a header parameter.</li>
   * @returns DataExtractsUserDataResponse OK
   * @throws ApiError
   */
  public getDataExtractsUserData({
    fromDate,
    loginName,
    toDate,
  }: {
    /**
     * From DateTime (YYYY-MM-DDThh:mm:ssZ)
     */
    fromDate: string
    /**
     * Login Name
     */
    loginName: string
    /**
     * To DateTime (YYYY-MM-DDThh:mm:ssZ)
     */
    toDate: string
  }): CancelablePromise<DataExtractsUserDataResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/dataExtracts/userData',
      query: {
        fromDate: fromDate,
        loginName: loginName,
        toDate: toDate,
      },
      errors: {
        400: `Y800 : Invalid value for eventName<br>Y821 : Data update event not supported<br>Y800 : Invalid value for fromDate.fromDate cannot be greater than current time<br>Y800 : Invalid value for toDate.toDate cannot be greater than current time<br>.Y800 : Invalid value for fromDate or toDate.fromDate and toDate cannot be older than 7 days<br>Y800 : Invalid value for fromDate.fromDate can not be greater than toDate<br>Y800 : Invalid value for loginName`,
        401: `Unauthorized`,
        404: `Not Found`,
      },
    })
  }

  /**
   * Get Events
   * The get extracts events service is used to learn about occurrences of data extract related events. This service currently supports only the DATA_UPDATES event.<br>Passing the event name as DATA_UPDATES provides information about users for whom data has been modified in the system for the specified time range. To learn more, please refer to the <a href="https://developer.yodlee.com/docs/api/1.1/DataExtracts">dataExtracts</a> page.<br>You can retrieve data in increments of no more than 60 minutes over the period of the last 7 days from today's date.<br>This service is only invoked with either admin access token or a cobrand session.<br>
   * @returns DataExtractsEventResponse OK
   * @throws ApiError
   */
  public getDataExtractsEvents({
    eventName,
    fromDate,
    toDate,
  }: {
    /**
     * Event Name
     */
    eventName: string
    /**
     * From DateTime (YYYY-MM-DDThh:mm:ssZ)
     */
    fromDate: string
    /**
     * To DateTime (YYYY-MM-DDThh:mm:ssZ)
     */
    toDate: string
  }): CancelablePromise<DataExtractsEventResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/dataExtracts/events',
      query: {
        eventName: eventName,
        fromDate: fromDate,
        toDate: toDate,
      },
      errors: {
        400: `Y800 : Invalid value for fromDate.fromDate cannot be greater than current time<br>Y800 : Invalid value for toDate.toDate cannot be greater than current time<br>Y800 : Invalid value for fromDate or toDate.fromDate and toDate cannot be older than 7 days<br>Y800 : Invalid value for fromDate.fromDate cannot be greater than toDate.`,
        401: `Unauthorized`,
        404: `Not Found`,
      },
    })
  }
}
