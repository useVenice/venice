/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DerivedHoldingSummaryResponse } from '../models/DerivedHoldingSummaryResponse';
import type { DerivedNetworthResponse } from '../models/DerivedNetworthResponse';
import type { DerivedTransactionSummaryResponse } from '../models/DerivedTransactionSummaryResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class DerivedService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Get Networth Summary
   * The get networth service is used to get the networth for the user.<br>If the include parameter value is passed as details then networth with historical balances is returned. <br>
   * @returns DerivedNetworthResponse OK
   * @throws ApiError
   */
  public getNetworth({
    accountIds,
    container,
    fromDate,
    include,
    interval,
    skip,
    toDate,
    top,
  }: {
    /**
     * comma separated accountIds
     */
    accountIds?: string,
    /**
     * bank/creditCard/investment/insurance/loan/realEstate/otherAssets/otherLiabilities
     */
    container?: string,
    /**
     * from date for balance retrieval (YYYY-MM-DD)
     */
    fromDate?: string,
    /**
     * details
     */
    include?: string,
    /**
     * D-daily, W-weekly or M-monthly
     */
    interval?: string,
    /**
     * skip (Min 0)
     */
    skip?: number,
    /**
     * toDate for balance retrieval (YYYY-MM-DD)
     */
    toDate?: string,
    /**
     * top (Max 500)
     */
    top?: number,
  }): CancelablePromise<DerivedNetworthResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/derived/networth',
      query: {
        'accountIds': accountIds,
        'container': container,
        'fromDate': fromDate,
        'include': include,
        'interval': interval,
        'skip': skip,
        'toDate': toDate,
        'top': top,
      },
      errors: {
        400: `Y800 : Invalid value for accountIds<br>Y800 : Invalid value for fromDate<br>Y800 : Invalid value for toDate<br>Y809 : Invalid date range<br>Y800 : Invalid value for interval<br>Y802 : Future date not allowed<br>Y814 : Exchange rate not available for currency<br>Y800 : Invalid value for container`,
        401: `Unauthorized`,
        404: `Not Found`,
      },
    });
  }

  /**
   * Get Transaction Summary
   * The transaction summary service provides the summary values of transactions for the given date range by category type, high-level categories, or system-defined categories.<br><br>Yodlee has the transaction data stored for a day, month, year and week per category as per the availability of user's data. If the include parameter value is passed as details, then summary details will be returned depending on the interval passed-monthly is the default.<br><br><b>Notes:</b><ol> <li> Details can be requested for only one system-defined category<li>Passing categoryType is mandatory except when the groupBy value is CATEGORY_TYPE<li>Dates will not be respected for monthly, yearly, and weekly details<li>When monthly details are requested, only the fromDate and toDate month will be respected<li>When yearly details are requested, only the fromDate and toDate year will be respected<li>For weekly data points, details will be provided for every Sunday date available within the fromDate and toDate<li>This service supports the localization feature and accepts locale as a header parameter</li></ol>
   * @returns DerivedTransactionSummaryResponse OK
   * @throws ApiError
   */
  public getTransactionSummary({
    groupBy,
    accountId,
    categoryId,
    categoryType,
    fromDate,
    include,
    includeUserCategory,
    interval,
    toDate,
  }: {
    /**
     * CATEGORY_TYPE, HIGH_LEVEL_CATEGORY or CATEGORY
     */
    groupBy: string,
    /**
     * comma separated account Ids
     */
    accountId?: string,
    /**
     * comma separated categoryIds
     */
    categoryId?: string,
    /**
     * INCOME, EXPENSE, TRANSFER, UNCATEGORIZE or DEFERRED_COMPENSATION
     */
    categoryType?: string,
    /**
     * YYYY-MM-DD format
     */
    fromDate?: string,
    /**
     * details
     */
    include?: string,
    /**
     * TRUE/FALSE
     */
    includeUserCategory?: boolean,
    /**
     * D-daily, W-weekly, M-mothly or Y-yearly
     */
    interval?: string,
    /**
     * YYYY-MM-DD format
     */
    toDate?: string,
  }): CancelablePromise<DerivedTransactionSummaryResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/derived/transactionSummary',
      query: {
        'accountId': accountId,
        'categoryId': categoryId,
        'categoryType': categoryType,
        'fromDate': fromDate,
        'groupBy': groupBy,
        'include': include,
        'includeUserCategory': includeUserCategory,
        'interval': interval,
        'toDate': toDate,
      },
      errors: {
        400: `Y010 : Invalid session<br>Y800 : Invalid value for accountId<br>Y800 : Invalid value for groupBy<br>Y803 : groupBy required<br>Y803 : categoryType required<br>Y800 : Invalid value for categoryId<br>Y800 : Invalid value for fromDate<br>Y800 : Invalid value for toDate<br>Y800 : Invalid value for fromDate or toDate<br>Y814 : Exchange rate not available for currency<br>Y815 : Cannot apply filter on categoryId if groupBy value is CATEGORY_TYPE<br>Y816 : User-defined category details can only be requested for one system categoryId with groupBy='CATEGORY'<br>Y824 : The maximum number of accountIds permitted is 100<br>Y824 : The maximum number of categoryIds permitted is 100<br>Y824 : The maximum number of categoryTypes permitted is 100`,
        401: `Unauthorized`,
        404: `Not Found`,
      },
    });
  }

  /**
   * Get Holding Summary
   * The get holding summary service is used to get the summary of asset classifications for the user.<br>By default, accounts with status as ACTIVE and TO BE CLOSED will be considered.<br>If the include parameter value is passed as details then a summary with holdings and account information is returned.<br>
   * @returns DerivedHoldingSummaryResponse OK
   * @throws ApiError
   */
  public getHoldingSummary({
    accountIds,
    classificationType,
    include,
  }: {
    /**
     * Comma separated accountIds
     */
    accountIds?: string,
    /**
     * e.g. Country, Sector, etc.
     */
    classificationType?: string,
    /**
     * details
     */
    include?: string,
  }): CancelablePromise<DerivedHoldingSummaryResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/derived/holdingSummary',
      query: {
        'accountIds': accountIds,
        'classificationType': classificationType,
        'include': include,
      },
      errors: {
        400: `Y800 : Invalid value for classificationType<br>Y814 : Exchange rate not available for currency<br>Y824 : The maximum number of accountIds permitted is 100<br>`,
        401: `Unauthorized`,
        404: `Not Found`,
      },
    });
  }

}
