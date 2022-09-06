/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HoldingAssetClassificationListResponse } from '../models/HoldingAssetClassificationListResponse';
import type { HoldingResponse } from '../models/HoldingResponse';
import type { HoldingSecuritiesResponse } from '../models/HoldingSecuritiesResponse';
import type { HoldingTypeListResponse } from '../models/HoldingTypeListResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class HoldingsService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Get Asset Classification List
   * The get asset classifications list service is used to get the supported asset classifications. <br>The response includes different classification types like assetClass, country, sector, style, etc. and the values corresponding to each type.<br>
   * @returns HoldingAssetClassificationListResponse OK
   * @throws ApiError
   */
  public getAssetClassificationList(): CancelablePromise<HoldingAssetClassificationListResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/holdings/assetClassificationList',
      errors: {
        401: `Unauthorized`,
        404: `Not Found`,
      },
    });
  }

  /**
   * Get Security Details
   * The get security details service is used to get all the security information for the holdings<br>
   * @returns HoldingSecuritiesResponse OK
   * @throws ApiError
   */
  public getSecurities({
    holdingId,
  }: {
    /**
     * Comma separated holdingId
     */
    holdingId?: string,
  }): CancelablePromise<HoldingSecuritiesResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/holdings/securities',
      query: {
        'holdingId': holdingId,
      },
      errors: {
        400: `Y800 : Invalid value for holdingId<br>Y824 : The maximum number of holdingIds permitted is 100`,
        401: `Unauthorized`,
        404: `Not Found`,
      },
    });
  }

  /**
   * Get Holdings
   * The get holdings service is used to get the list of holdings of a user.<br>Supported holding types can be employeeStockOption, moneyMarketFund, bond, etc. and is obtained using get holding type list service. <br>Asset classifications for the holdings need to be requested through the "include" parameter.<br>Asset classification information for holdings are not available by default, as it is a premium feature.<br>
   * @returns HoldingResponse OK
   * @throws ApiError
   */
  public getHoldings({
    accountId,
    assetClassificationClassificationType,
    classificationValue,
    include,
    providerAccountId,
  }: {
    /**
     * Comma separated accountId
     */
    accountId?: string,
    /**
     * e.g. Country, Sector, etc.
     */
    assetClassificationClassificationType?: string,
    /**
     * e.g. US
     */
    classificationValue?: string,
    /**
     * assetClassification
     */
    include?: string,
    /**
     * providerAccountId
     */
    providerAccountId?: string,
  }): CancelablePromise<HoldingResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/holdings',
      query: {
        'accountId': accountId,
        'assetClassification.classificationType': assetClassificationClassificationType,
        'classificationValue': classificationValue,
        'include': include,
        'providerAccountId': providerAccountId,
      },
      errors: {
        400: `Y800 : Invalid value for accountId<br>Y800 : Invalid value for providerAccountId<br>Y800 : Invalid value for include<br>Y800 : Invalid value for classificationType<br>Y800 : Invalid value for classificationValue<br>Y800 : Invalid value for include<br>Y400 : classificationType mismatch<br>Y400 : classificationValue mismatch<br>Y824 : The maximum number of accountIds permitted is 100`,
        401: `Unauthorized`,
        404: `Not Found`,
      },
    });
  }

  /**
   * Get Holding Type List
   * The get holding types list service is used to get the supported holding types.<br>The response includes different holding types such as future, moneyMarketFund, stock, etc. and it returns the supported holding types <br>
   * @returns HoldingTypeListResponse OK
   * @throws ApiError
   */
  public getHoldingTypeList(): CancelablePromise<HoldingTypeListResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/holdings/holdingTypeList',
      errors: {
        401: `Unauthorized`,
        404: `Not Found`,
      },
    });
  }

}
