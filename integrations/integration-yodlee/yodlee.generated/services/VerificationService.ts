/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type {BaseHttpRequest} from '../core/BaseHttpRequest'
import type {CancelablePromise} from '../core/CancelablePromise'
import type {HolderProfileResponse} from '../models/HolderProfileResponse'
import type {UpdateVerificationRequest} from '../models/UpdateVerificationRequest'
import type {VerificationRequest} from '../models/VerificationRequest'
import type {VerificationResponse} from '../models/VerificationResponse'
import type {VerificationStatusResponse} from '../models/VerificationStatusResponse'
import type {VerifiedAccountResponse} from '../models/VerifiedAccountResponse'

export class VerificationService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Get Verified Accounts
   * The Verified Accounts API v1.1 provides information about the bank and investment accounts that the user  has selected for verification, during the Account Verification flow on FastLink 4. By default, the API only returns information of the accounts that were selected and have been successfully verified. <br><br>
   * @returns VerifiedAccountResponse OK
   * @throws ApiError
   */
  public getVerifiedAccounts({
    providerAccountId,
    accountId,
    isSelected,
    verificationStatus,
  }: {
    /**
     * providerAccountId.
     */
    providerAccountId: string
    /**
     * Comma separated accountIds.
     */
    accountId?: string
    /**
     * Comma separated isSelected. Allowed values are true, false <br><b>Note:</b> If no value is passed, the implicit default value is true.
     */
    isSelected?: string
    /**
     * Comma separated verificationStatus. Allowed values are SUCCESS, FAILED <br><b>Note:</b> If no value is passed, the implicit default value is SUCCESS.
     */
    verificationStatus?: string
  }): CancelablePromise<VerifiedAccountResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/verification/verifiedAccounts',
      query: {
        accountId: accountId,
        isSelected: isSelected,
        providerAccountId: providerAccountId,
        verificationStatus: verificationStatus,
      },
      errors: {
        400: `Y813 : providerAccountId should be provided<br>Y800 : Invalid value for providerAccountId<br>Y800 : Invalid value for verificationStatus<br>Y800 : Invalid value for isSelected<br>Y800 : Invalid value for accountId<br>Y807 : Resource not found<br>Y871 : The verification process for the request is still in progress. This API can only be invoked after the verification process is completed<br>Y824 : The maximum number of accountIds permitted is 10`,
        401: `Unauthorized`,
        404: `Not Found`,
      },
    })
  }

  /**
   * Get Holder Profile
   * The Holder Profile API service allows retrieving the user's profile details (i.e., PII data such as name, email, phone number, and address) that are available at the provider account and each account level. The API accepts the providerAccountId and retrieves the profile information available under it and all the details available under each of the associated accounts.  <br><br>This service can only be invoked by Yodlee API v1.1, FastLink 3, and FastLink 4 customers. <br><br>
   * @returns HolderProfileResponse OK
   * @throws ApiError
   */
  public getHolderProfile({
    providerAccountId,
    accountId,
  }: {
    /**
     * providerAccountId.
     */
    providerAccountId: string
    /**
     * accountId
     */
    accountId?: string
  }): CancelablePromise<HolderProfileResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/verification/holderProfile',
      query: {
        accountId: accountId,
        providerAccountId: providerAccountId,
      },
      errors: {
        400: `Y901 : Service not supported<br>Y800 : Invalid value for providerAccountId<br>Y800 : Invalid value for accountId. Only ACTIVE accountIds are supported<br>Y800 : Invalid value for accountId. All accountIds should belong to the same providerAccountId<br>Y803 : providerAccountId required<br>Y805 : Multiple providerAccountId not supported<br>Y820 : The accountId is not supported for containers other than bank and investment<br>can only be invoked after the verification process is completed<br>Y824 : The maximum number of accountIds permitted is 10<br>Y878 : Profile data is not yet requested for this account`,
        401: `Unauthorized`,
        404: `Not Found`,
      },
    })
  }

  /**
   * Initiaite Challenge Deposit
   * The post verification service is used to initiate the matching service (MS) and the challenge deposit account verification (CDV) process to verify account ownership.<br>The MS and CDV process can verify ownership of only bank accounts (i.e., checking and savings).<br>The MS verification can be initiated only for an already aggregated account or a providerAccount.<br>The prerequisite for the MS verification process is to request the ACCT_PROFILE dataset with the HOLDER_NAME attribute.<br>In the MS verification process, a string-match of the account holder name with the registered user name is performed instantaneously. You can contact the Yodlee CustomerCare to configure the full name or only the last name match.<br>Once the CDV process is initiated Yodlee will post the microtransaction (i.e., credit and debit) in the user's account. The CDV process takes 2 to 3 days to complete as it requires the user to provide the microtransaction details.<br>The CDV process is currently supported only in the United States.<br>The verificationId in the response can be used to track the verification request.<br><br><b>Notes:</b><li>This endpoint cannot be used to test the CDV functionality in the developer sandbox or test environment. You will need a money transmitter license to implement the CDV functionality and also require the Yodlee Professional Services team's assistance to set up a dedicated environment.
   * @returns VerificationResponse OK
   * @throws ApiError
   */
  public initiateMatchingOrChallengeDepositeVerification({
    verificationParam,
  }: {
    /**
     * verification information
     */
    verificationParam: VerificationRequest
  }): CancelablePromise<VerificationResponse> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/verification',
      body: verificationParam,
      errors: {
        400: `Y901 : Service not supported<br>Y812 : Required field/value - verification.verificationType missing in the verificationParam<br>Y812 : Required field/value - accountNumber missing in the verificationParam<br>Y812 : Required field/value - accountType missing in the verificationParam<br>Y812 : Required field/value - bankTransferCode missing in the verificationParam<br>Y812 : Required field/value - bankTransferCode.id missing in the verificationParam<br>Y812 : Required field/value - bankTransferCode.type missing in the verificationParam<br>Y800 : Invalid value for verification.verificationType<br>Y800 : Invalid value for verificationParam<br>Y800 : Invalid value for bankTransferCode.type<br>Y800 : Invalid value for bankTransferCode.id<br>Y800 : Invalid value for accountType<br>Y800 : Invalid value for accountId<br>Y813 : Account details should be provided<br>Y801 : Invalid length for accountNumber<br>Y835 : Account(s) not eligible for Challenge Deposit verification<br>Y806 : Invalid Input<br>Y840 : Verification has been initiated already<br>Y837 : Account has been verified already`,
        401: `Unauthorized`,
        404: `Not Found`,
      },
    })
  }

  /**
   * Get Verification Status
   * The get verification status service is used to retrieve the verification status of all accounts for which the MS or CDV process has been initiated.<br>For the MS process, the account details object returns the aggregated information of the verified accounts. For the CDV process, the account details object returns the user provided account information.<br>
   * @returns VerificationStatusResponse OK
   * @throws ApiError
   */
  public getVerificationStatus({
    accountId,
    providerAccountId,
    verificationType,
  }: {
    /**
     * Comma separated accountId
     */
    accountId?: string
    /**
     * Comma separated providerAccountId
     */
    providerAccountId?: string
    /**
     * verificationType
     */
    verificationType?: string
  }): CancelablePromise<VerificationStatusResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/verification',
      query: {
        accountId: accountId,
        providerAccountId: providerAccountId,
        verificationType: verificationType,
      },
      errors: {
        400: `Y901 : Service not supported<br>Y813 : Either of accountId or providerAccountId should be provided<br>Y800 : Invalid value for accountId<br>Y800 : Invalid value for verification.verificationType<br>Y800 : Invalid value for providerAccountId<br>Y835 : Account(s) not eligible for Matching verification<br>Y836 : No verification initiated`,
        401: `Unauthorized`,
        404: `Not Found`,
      },
    })
  }

  /**
   * Verify Challenge Deposit
   * The put verification service is used to complete the challenge deposit verification (CDV) process.<br>This service is used only by the customer of CDV flow.<br>In the CDV process, the user-provided microtransaction details (i.e., credit and debit) is matched against the microtransactions posted by Yodlee. For a successful verification of the account's ownership both the microtransaction details should match.<br>The CDV process is currently supported only in the United States.<br><br><b>Notes:</b><ul><li>This endpoint cannot be used to test the CDV functionality in the developer sandbox or test environment. You will need a money transmitter license to implement the CDV functionality and also require the Yodlee Professional Services team's assistance to set up a dedicated environment.</li></ul>
   * @returns VerificationResponse OK
   * @throws ApiError
   */
  public verifyChallengeDeposit({
    verificationParam,
  }: {
    /**
     * verification information
     */
    verificationParam: UpdateVerificationRequest
  }): CancelablePromise<VerificationResponse> {
    return this.httpRequest.request({
      method: 'PUT',
      url: '/verification',
      body: verificationParam,
      errors: {
        400: `Y901 : Service not supported<br>Y812 : Required field/value - verification.verificationType missing in the verificationParam<br>Y812 : Required field/value - amount.amount missing in the verificationParam<br>Y812 : Required field/value - baseType missing in the verificationParam<br>Y812 : Required field/value - currency missing in the verificationParam<br>Y812 : Required field/value - providerAccountId missing in the verificationParam<br>Y812 : Required field/value - accountId missing in the verificationParam<br>Y800 : Invalid value for verificationParam<br>Y800 : Invalid value for verification.verificationType<br>Y800 : Invalid value for baseType<br>Y800 : Invalid value for providerAccountId<br>Y800 : Invalid value for accountId<br>Y813 : Transaction should be provided<br>Y801 : Invalid length for accountNumber<br>Y801 : Invalid length for amount<br>Y835 : Account(s) not eligible for Challenge Deposit verification<br>Y806 : Invalid Input<br>Y840 : Verification has been initiated already<br>Y837 : Account has been verified already<br>Y838 : The currency code provided does not match with the currency of the transaction executed on the target account<br>Y846 : The number of financial transactions made on the target account does not match with the number of transactions entered by the user.<br>Y842 : Number of retries exceeded the maximum Challenge Deposit verification limit<br>Y844 : Financial Instructions were not executed successfully on the target account<br>Y845 : Verification time expired. Please try initiating challenge deposit again<br>Y868 : No action is allowed, as the data is being migrated to the Open Banking provider<br>`,
        401: `Unauthorized`,
        404: `Not Found`,
      },
    })
  }
}
