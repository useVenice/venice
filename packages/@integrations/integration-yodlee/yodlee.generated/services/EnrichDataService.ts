/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EnrichDataRequest } from '../models/EnrichDataRequest';
import type { EnrichedTransactionResponse } from '../models/EnrichedTransactionResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class EnrichDataService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Push UserData
   * <b>Push User Data </b><br>The data enrich API v1.1 allows customers to get the transactions enriched in real-time by feeding the data into the Yodlee Platform. To get the transactions enriched, it is necessary that users, accounts, and transactions are updated to the Yodlee Platform.<br>The following features are supported through the data enrich API:<ul><li>Add user</li><li>Add account</li><li>Update account</li><li>Add transactions</li><li>Update transactions</li></ul>Yodlee will enrich the transactions with the following information:<ul><li>Category</li><li>High Level Category</li><li>Detail Category</li><li>Simple description</li><li>Merchant details<ul><li>Name</li><li>Address</li></ul></li><li>Transaction type</li><li>Transaction subtype</li></ul>The data feed through the enrich APIs will be updated to the Yodlee Platform in real time. The updated accounts and transactions information can then be retrieved from the system using the respective Yodlee 1.1 APIs.<br><b> Implementation Notes </b><ul><li>Supported only through credential-based authentication mechanisms.</li><li>Customer must be TLS 1.2 compliant to integrate with the data enrich API.</li><li>Supported account types are savings, checking, and credit.</li><li>A maximum of 128 transactions can be passed to the API.</li><li>As the data enrich API is a premium offering and is priced per API call, Yodlee recommends not to call the API to update accounts and transactions.</li><li>The minimum required parameters to create account and transaction is accepted. The Yodlee data model supports more parameters than what is accepted in this API. Customers can make the rest of the parameters available during the auto-refresh process of the accounts.</li><li>Though few input parameters are optional, Yodlee recommends passing them as the account information will make complete sense to the consumers when it is displayed in the Yodlee applications or widgets.</li></ul>
   * @returns EnrichedTransactionResponse OK
   * @throws ApiError
   */
  public pushUserData({
    userData,
  }: {
    /**
     * Input for User Data
     */
    userData?: EnrichDataRequest,
  }): CancelablePromise<EnrichedTransactionResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/enrichData/userData',
      body: userData,
      errors: {
        400: `Y851 : Value cannot be blank or null for user<br>Y851 : Value cannot be blank or null for account<br>Y851 : Value cannot be blank or null for transaction<br>Y851 : Value cannot be blank or null for user[1].loginName<br>Y851 : Value cannot be blank or null for account[1].userLoginName<br>Y851 : Value cannot be blank or null for account[1].container<br>Y851 : Value cannot be blank or null for account[1].accountNumber<br>Y851 : Value cannot be blank or null for account[1].accountType<br>Y851 : Value cannot be blank or null for account[1].availableCredit<br>Y851 : Value cannot be blank or null for account[1].availableCash<br>Y851 : Value cannot be blank or null for account[1].availableBalance<br>Y851 : Value cannot be blank or null for account[1].currentBalance<br>Y851 : Value cannot be blank or null for transaction[1].userLoginName<br>Y851 : Value cannot be blank or null for transaction[1].accountNumber<br>Y851 : Value cannot be blank or null for transaction[1].container<br>Y851 : Value cannot be blank or null for transaction[1].sourceId<br>Y851 : Value cannot be blank or null for transaction[1].description<br>Y851 : Value cannot be blank or null for transaction[1].amount<br>Y851 : Value cannot be blank or null for transaction[1].baseType<br>Y1001 : Invalid value format or data type used for transaction[1].transactionDate<br>Y821 : transaction[1].status not supported<br>Y821 : transaction[1].baseType not supported<br>Y851 : Value cannot be blank or null for transaction[1].amount.amount<br>Y851 : Value cannot be blank or null for transaction[1].amount.currency<br>Y1001 :  Invalid value format or data type used for transaction[1].amount.amount<br>Y801 : Invalid length for transaction[1].amount.amount<br>Y1001 : Invalid value format or data type used for transaction[1].amount.currency<br>Y812 : Required field/value - account[1].userLoginName missing in user entity<br>Y812 : Required field/value - transaction[1].userLoginName missing in user entity<br>Y812 : Required field/value - account[1].accountNumber missing in transaction entity<br>Y821 : transaction[1].container not supported<br>Y821 : account[1].accountType not supported<br>Y821 : account[1].accountStatus not supported<br>Y1001 : Invalid value format or data type used for account[1].dueDate<br>Y852 : Duplicate user[2].loginName cannot be passed in the input<br>Y852 : Duplicate transaction[2].sourceId cannot be passed in the input<br>Y852 : Duplicate account[2].accountNumber cannot be passed in the input<br>Y851 : Value cannot be blank or null for user<br>Y1001 : Invalid value format or data type used for transaction[1].isDeleted<br>Y851 : Value cannot be blank or null for transaction[1].description.original<br>Y801 : Invalid length for transaction[1].description.original<br>Y824 : The maximum number of transaction permitted is 128<br>Y821 : user[1].address.country not supported<br>Y822 : user[1].address.state not supported<br>Y1001 : Invalid value format or data type used for user[1].preferences.currency<br>`,
        401: `Unauthorized`,
        404: `Not Found`,
        500: `Y014 : Cobrand configuration missing<br>Y904 : Internal exception<br>`,
      },
    });
  }

}
