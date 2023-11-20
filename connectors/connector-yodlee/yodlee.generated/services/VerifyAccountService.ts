/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type {BaseHttpRequest} from '../core/BaseHttpRequest'
import type {CancelablePromise} from '../core/CancelablePromise'
import type {VerifyAccountRequest} from '../models/VerifyAccountRequest'
import type {VerifyAccountResponse} from '../models/VerifyAccountResponse'

export class VerifyAccountService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Verify Accounts Using Transactions
   * The verify account service is used to verify the account's ownership by  matching the transaction details with the accounts aggregated for the user.<br><ul><li>If a match is identified, the service returns details of all the accounts along with the matched transaction's details.<li>If no transaction match is found, an empty response will be returned.<li>A maximum of 5 transactionCriteria can be passed in a request.<li>The baseType, date, and amount parameters should mandatorily be passed.<li>The optional dateVariance parameter cannot be more than 7 days. For example, +7, -4, or +/-2.<li>Pass the container or accountId parameters for better performance.<li>This service supports the localization feature and accepts locale as a header parameter.</li></ul>
   * @returns VerifyAccountResponse OK
   * @throws ApiError
   */
  public initiateAccountVerification({
    providerAccountId,
    verificationParam,
  }: {
    /**
     * providerAccountId
     */
    providerAccountId: string
    /**
     * verificationParam
     */
    verificationParam: VerifyAccountRequest
  }): CancelablePromise<VerifyAccountResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/verifyAccount/{providerAccountId}',
      path: {
        providerAccountId: providerAccountId,
      },
      body: verificationParam,
      errors: {
        400: `Y800 : Invalid value for container<br>Y800 : Invalid value for accountId<br>Y800 : Invalid value for amount<br>Y800 : Invalid value for dateVariance<br>Y801 : Invalid length for keyword<br>Y804 : Permitted values of dateVariance between 1 - 7<br>Y806 : Invalid input<br>Y807 : Resource not found<br>Y809 : Invalid date range<br>Y812 : Required field/value - transactionCriteria missing in the input<br>Y812 : Required field/value - amount missing in the transactionCriteria<br>Y812 : Required field/value - amount date in the transactionCriteria<br>Y812 : Required field/value - baseType missing in the transactionCriteria<br>Y823 : Transaction not applicable for container <br>Y824 : The maximum number of transactionCriteria permitted is 5<br>Y857 : Transactions are not refreshed in the past 24 hours<br>Y858 : Only active accounts can be verified<br>Y901 : Service not supported<br>`,
        401: `Unauthorized`,
        404: `Not Found`,
      },
    })
  }
}
