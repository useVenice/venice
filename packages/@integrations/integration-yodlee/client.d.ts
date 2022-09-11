import type {
  AxiosRequestConfig,
  OpenAPIClient,
  OperationResponse,
  Parameters,
  UnknownParamsObject,
} from 'openapi-client-axios'

declare namespace Definitions {
  /**
   * AbstractAddress
   */
  export interface AbstractAddress {
    zip?: string
    country?: string
    address3?: string
    address2?: string
    city?: string
    address1?: string
    state?: string
  }
  /**
   * AccessTokens
   */
  export interface AccessTokens {
    /**
     * The identifier of the application for which the access token is generated.<br><br><b>Endpoints</b>:<ul><li>GET user/accessTokens</li></ul>
     */
    appId?: string
    /**
     * Access token value used to invoke the widgets/apps.<br><br><b>Endpoints</b>:<ul><li>GET user/accessTokens</li></ul>
     */
    value?: string
    /**
     * Base URL using which the application is accessed.<br><br><b>Endpoints</b>:<ul><li>GET user/accessTokens</li></ul>
     */
    url?: string
  }
  /**
   * Account
   */
  export interface Account {
    /**
     * The amount that is available for an ATM withdrawal, i.e., the cash available after deducting the amount that is already withdrawn from the total cash limit. (totalCashLimit-cashAdvance= availableCash)<br><b>Additional Details:</b> The available cash amount at the account-level can differ from the available cash at the statement-level, as the information in the aggregated card account data provides more up-to-date information.<br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: creditCard<br><b>Endpoints</b>:<br><ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    availableCash?: /* Money */ Money
    /**
     * Used to determine  whether an account to be considered in the networth calculation.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: bank,creditCard,loan,investment,insurance,realEstate,otherAssets,otherLiabilities<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    includeInNetWorth?: boolean
    /**
     * The amount in the money market fund or its equivalent such as bank deposit programs.<br><b>Note:</b> The money market balance field is only applicable to brokerage related accounts.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: investment<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    moneyMarketBalance?: /* Money */ Money
    /**
     * Date on which the user is enrolled on the rewards program.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: reward<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    enrollmentDate?: string
    /**
     * The date on which the home value was estimated.<br><br><b>Aggregated / Manual</b>: Manual<br><b>Applicable containers</b>: realEstate<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    estimatedDate?: string
    /**
     * The additional description or notes given by the user.<br><br><b>Aggregated / Manual</b>: Both <br><b>Applicable containers</b>: All containers<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    memo?: string
    /**
     * A nonprofit or state organization that works with lender, servicer, school, and the Department of Education to help successfully repay Federal Family Education Loan Program (FFELP) loans. If FFELP student loans default, the guarantor takes ownership of them.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: loan<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    guarantor?: string
    /**
     * Interest paid in last calendar year.<br><b>Applicable containers</b>: loan<br><b>Aggregated / Manual</b>: Aggregated<br><b>Endpoints</b>:<br><ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    interestPaidLastYear?: /* Money */ Money
    /**
     * The date time the account information was last retrieved from the provider site and updated in the Yodlee system.<br><br><b>Aggregated / Manual</b>: Both <br><b>Applicable containers</b>: All containers<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    lastUpdated?: string
    /**
     * The total account value. <br><b>Additional Details:</b><br><b>Bank:</b> available balance or current balance.<br><b>Credit Card:</b> running Balance.<br><b>Investment:</b> The total balance of all the investment account, as it appears on the FI site.<br><b>Insurance:</b> CashValue or amountDue<br><b>Loan:</b> principalBalance<br><b>Applicable containers</b>: bank, creditCard, investment, insurance, loan, otherAssets, otherLiabilities, realEstate<br><b>Aggregated / Manual</b>: Both <br><b>Endpoints</b>:<br><ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    balance?: /* Money */ Money
    /**
     * Type of home insurance, like -<ul><li>HOME_OWNER</li><li>RENTAL</li><li>RENTER</li><li>etc..</li></ul><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: insurance<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul><b>Applicable Values</b><br>
     */
    homeInsuranceType?: 'HOME_OWNER' | 'RENTAL' | 'RENTER' | 'UNKNOWN' | 'OTHER'
    /**
     * The primary key of the account resource and the unique identifier for the account.<br><br><b>Aggregated / Manual</b>: Both <br><b>Applicable containers</b>: All containers<br><b>Endpoints</b>:<ul><li>GET accounts </li><li>GET accounts/{accountId}</li><li>GET investmentOptions</li><li>GET accounts/historicalBalances</li><li>POST accounts</li><li>GET dataExtracts/userData</li></ul>
     */
    id?: number // int64
    /**
     * The amount that is available for immediate withdrawal or the total amount available to purchase securities in a brokerage or investment account.<br><b>Note:</b> The cash balance field is only applicable to brokerage related accounts.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: investment<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    cash?: /* Money */ Money
    /**
     * Total credit line is the amount of money that can be charged to a credit card. If credit limit of $5,000 is issued on a credit card, the total charges on the card cannot exceed this amount.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: creditCard<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    totalCreditLine?: /* Money */ Money
    /**
     * Service provider or institution name where the account originates. This belongs to the provider resource.<br><br><b>Aggregated / Manual</b>: Both <br><b>Applicable containers</b>: All containers<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    providerName?: string
    /**
     * The valuation type indicates whether the home value is calculated either manually or by Yodlee Partners.<br><br><b>Aggregated / Manual</b>: Manual<br><b>Applicable containers</b>: realEstate<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul><b>Applicable Values</b><br>
     */
    valuationType?: 'SYSTEM' | 'MANUAL'
    /**
     * The amount of borrowed funds used to purchase securities.<br><b>Note</b>: Margin balance is displayed only if the brokerage account is approved for margin. The margin balance field is only applicable to brokerage related accounts.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: investment<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    marginBalance?: /* Money */ Money
    /**
     * The annual percentage rate (APR) is the yearly rate of interest on the credit card account.<br><b>Additional Details:</b> The yearly percentage rate charged when a balance is held on a credit card. This rate of interest is applied every month on the outstanding credit card balance.<br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: creditCard<br><b>Endpoints</b>:<br><ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    apr?: number // double
    /**
     * <br><b>Credit Card:</b> Amount that is available to spend on the credit card. It is usually the Total credit line- Running balance- pending charges. <br><b>Loan:</b> The unused portion of  line of credit, on a revolving loan (such as a home-equity line of credit).<br><b>Additional Details:</b><br><b>Note:</b> The available credit amount at the account-level can differ from the available credit field at the statement-level, as the information in the aggregated card account data provides more up-to-date information.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: creditCard, loan<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    availableCredit?: /* Money */ Money
    /**
     * The balance in the account that is available at the beginning of the business day; it is equal to the ledger balance of the account.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: bank<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    currentBalance?: /* Money */ Money
    /**
     * Indicates if an account is aggregated from a site or it is a manual account i.e. account information manually provided by the user.<br><b>Aggregated / Manual</b>: Both <br><b>Applicable containers</b>: All containers<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    isManual?: boolean
    /**
     * Profile information of the account.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: bank<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul>
     */
    profile?: /* AccountProfile */ AccountProfile
    /**
     * The amount a mortgage company holds to pay a consumer's non-mortgage related expenses like insurance and property taxes. <br><b>Additional Details:</b><br><b>Note:</b> The escrow balance field is only applicable to the mortgage account type.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: loan<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    escrowBalance?: /* Money */ Money
    /**
     * The eligible next level of the rewards program.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: reward<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    nextLevel?: string
    /**
     * The classification of the account such as personal, corporate, etc.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: bank, creditCard, investment, reward, loan, insurance<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul><b>Applicable Values</b><br>
     */
    classification?:
      | 'OTHER'
      | 'PERSONAL'
      | 'CORPORATE'
      | 'SMALL_BUSINESS'
      | 'TRUST'
      | 'ADD_ON_CARD'
      | 'VIRTUAL_CARD'
    /**
     * The amount to be paid to close the loan account, i.e., the total amount required to meet a borrower's obligation on a loan.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: loan<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    loanPayoffAmount?: /* Money */ Money
    /**
     * The type of the interest rate, for example, fixed or variable.<br><b>Applicable containers</b>: loan<br><b>Aggregated / Manual</b>: Aggregated<br><b>Endpoints</b>:<br><ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul><b>Applicable Values</b><br>
     */
    interestRateType?: 'FIXED' | 'VARIABLE' | 'UNKNOWN' | 'OTHER'
    /**
     * The date by which the payoff amount should be paid.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: loan<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    loanPayByDate?: string
    /**
     * The amount stated on the face of a consumer's policy that will be paid in the event of his or her death or any other event as stated in the insurance policy. The face amount is also referred to as the sum insured or maturity value in India.<br><b>Note:</b> The face amount field is applicable only to life insurance.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: insurance<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    faceAmount?: /* Money */ Money
    /**
     * The date the insurance policy began.<br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: insurance<br><b>Endpoints</b>:<br><ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    policyFromDate?: string
    /**
     * The number of years for which premium payments have to be made in a policy.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: insurance<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    premiumPaymentTerm?: string
    /**
     * The duration for which the policy is valid or in effect. For example, one year, five years, etc.<br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: insurance<br><b>Endpoints</b>:<br><ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    policyTerm?: string
    /**
     * The type of repayment plan that the borrower prefers to repay the loan. <br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: loan<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul><b>Applicable Values:</b><br>
     */
    repaymentPlanType?:
      | 'STANDARD'
      | 'GRADUATED'
      | 'EXTENDED'
      | 'INCOME_BASED'
      | 'INCOME_CONTINGENT'
      | 'INCOME_SENSITIVE'
      | 'PAY_AS_YOU_EARN'
      | 'REVISED_PAY_AS_YOU_EARN'
    /**
     * The type of account that is aggregated.
     */
    aggregatedAccountType?: string
    /**
     * The balance in the account that is available for spending. For checking accounts with overdraft, available balance may include overdraft amount, if end site adds overdraft balance to available balance.<br><b>Applicable containers</b>: bank, investment<br><b>Aggregated / Manual</b>: Aggregated<br><b>Endpoints</b>:<br><ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    availableBalance?: /* Money */ Money
    /**
     * The status of the account that is updated by the consumer through an application or an API. Valid Values: AccountStatus<br><b>Additional Details:</b><br><b>ACTIVE:</b> All the added manual and aggregated accounts status will be made "ACTIVE" by default. <br><b>TO_BE_CLOSED:</b> If the aggregated accounts are not found or closed in the data provider site, Yodlee system marks the status as TO_BE_CLOSED<br><b>INACTIVE:</b> Users can update the status as INACTIVE to stop updating and to stop considering the account in other services<br><b>CLOSED:</b> Users can update the status as CLOSED, if the account is closed with the provider. <br><br><b>Aggregated / Manual</b>: Both <br><b>Applicable containers</b>: All containers<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul><b>Applicable Values</b><br>
     */
    accountStatus?:
      | 'ACTIVE'
      | 'INACTIVE'
      | 'TO_BE_CLOSED'
      | 'CLOSED'
      | 'DELETED'
    /**
     * Type of life insurance.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: insurance<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul><b>Applicable Values</b><br>
     */
    lifeInsuranceType?:
      | 'OTHER'
      | 'TERM_LIFE_INSURANCE'
      | 'UNIVERSAL_LIFE_INSURANCE'
      | 'WHOLE_LIFE_INSURANCE'
      | 'VARIABLE_LIFE_INSURANCE'
      | 'ULIP'
      | 'ENDOWMENT'
    /**
     * Full account number of the account that is included only when include = fullAccountNumber is provided in the request. For student loan account the account number that will be used for ACH or fund transfer<br><br><b>Aggregated / Manual</b>: Both <br><b>Applicable containers</b>: bank, creditCard, investment, insurance, loan, reward, otherAssets, otherLiabilities <br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><b> Note : </b> fullAccountNumber is deprecated and is replaced with fullAccountNumberList in include parameter and response.</ul>
     */
    fullAccountNumber?: string
    /**
     * The financial cost that the policyholder pays to the insurance company to obtain an insurance cover.The premium is paid as a lump sum or in installments during the duration of the policy.<br><b>Applicable containers</b>: insurance<br><b>Aggregated / Manual</b>: Aggregated<br><b>Endpoints</b>:<br><ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    premium?: /* Money */ Money
    /**
     * The source through which the account(s) are added in the system.<br><b>Valid Values</b>: SYSTEM, USER<br><b>Applicable containers</b>: All Containers<br><b>Aggregated / Manual</b>: Both <br><b>Endpoints</b>:<br><ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul><b>Applicable Values</b><br>
     */
    aggregationSource?: 'SYSTEM' | 'USER'
    /**
     * The overdraft limit for the account.<br><b>Note:</b> The overdraft limit is provided only for AUS, INDIA, UK, NZ locales.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: bank<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    overDraftLimit?: /* Money */ Money
    /**
     * The nickname of the account as provided by the consumer to identify an account. The account nickname can be used instead of the account name.<br><br><b>Aggregated / Manual</b>: Both <br><b>Applicable containers</b>: All containers<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    nickname?: string
    /**
     * The tenure for which the CD account is valid  or in case of loan, the number of years/months over which the loan amount  has to be repaid. <br><b>Additional Details:</b><br>  Bank: The Term field is only applicable for the account type CD.Loan: The period for which the loan agreement is in force. The period, before or at the end of which, the loan should either be repaid or renegotiated for another term.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: bank, loan<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    term?: string
    /**
     * <br><b>Bank:</b> The interest rate offered by a FI to its depositors on a bank account.<br><b>Loan:</b> Interest rate applied on the loan.<br><b>Additional Details:</b><br><b>Note:</b> The Interest Rate field is only applicable for the following account types: savings, checking, money market, and certificate of deposit.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: bank, loan<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    interestRate?: number // double
    /**
     * The death benefit amount on a life insurance policy and annuity. It is usually equal to the face amount of the policy, but sometimes can vary for a whole life and universal life insurance policies.<br><b>Note:</b> The death benefit amount field is applicable only to annuities and life insurance.<br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: insurance<br><b>Endpoints</b>:<br><ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    deathBenefit?: /* Money */ Money
    /**
     * The home address of the real estate account. The address entity for home address consists of state, zip and city only<br><br><b>Aggregated / Manual</b>: Manual<br><b>Applicable containers</b>: realEstate<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    address?: /* AccountAddress */ AccountAddress
    /**
     * The amount of cash value available in the consumer's life insurance policy account - except for term insurance policy - for withdrawals, loans, etc. This field is also used to capture the cash value on the home insurance policy.It is the standard that the insurance company generally prefer to reimburse the policyholder for his or her loss, i.e., the cash value is equal to the replacement cost minus depreciation. The cash value is also referred to as surrender value in India for life insurance policies.<br><b>Note:</b> The cash value field is applicable to all types of life insurance (except for term life) and home insurance.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: insurance<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    cashValue?: /* Money */ Money
    /**
     * Holder details of the account.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: bank<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul>
     */
    holder?: /* AccountHolder */ AccountHolder[]
    /**
     * The amount borrowed from the 401k account.<br><b>Note</b>: The 401k loan field is only applicable to the 401k account type.<br><b>Applicable containers</b>: investment<br><b>Aggregated / Manual</b>: Aggregated<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    $401kLoan?: /* Money */ Money
    /**
     * The home value of the real estate account.<br><br><b>Aggregated / Manual</b>: Manual<br><b>Applicable containers</b>: realEstate<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    homeValue?: /* Money */ Money
    /**
     * The account number as it appears on the site. (The POST accounts service response return this field as number)<br><b>Additional Details</b>:<b> Bank/ Loan/ Insurance/ Investment</b>:<br> The account number for the bank account as it appears at the site.<br><b>Credit Card</b>: The account number of the card account as it appears at the site,<br>i.e., the card number.The account number can be full or partial based on how it is displayed in the account summary page of the site.In most cases, the site does not display the full account number in the account summary page and additional navigation is required to aggregate it.<br><b>Applicable containers</b>: All Containers<br><b>Aggregated / Manual</b>: Both <br><b>Endpoints</b>:<br><ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>POST accounts</li><li>GET dataExtracts/userData</li></ul>
     */
    accountNumber?: string
    /**
     * The date on which the account is created in the Yodlee system.<br><b>Additional Details:</b> It is the date when the user links or aggregates the account(s) that are held with the provider to the Yodlee system.<br><br><b>Aggregated / Manual</b>: Both <br><b>Applicable containers</b>: All containers<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    createdDate?: string
    /**
     * Interest paid from the start of the year to date.<br><b>Applicable containers</b>: loan<br><b>Aggregated / Manual</b>: Aggregated<br><b>Endpoints</b>:<br><ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    interestPaidYTD?: /* Money */ Money
    /**
     * The primary key of the provider account resource.<br><br><b>Aggregated / Manual</b>: Both <br><b>Applicable containers</b>: All containers<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    providerAccountId?: number // int64
    /**
     * Property or possession offered to support a loan that can be seized on a default.<br><b>Applicable containers</b>: loan<br><b>Aggregated / Manual</b>: Aggregated<br><b>Endpoints</b>:<br><ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    collateral?: string
    /**
     * Logical grouping of dataset attributes into datasets such as Basic Aggregation Data, Account Profile and Documents.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: All containers<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    dataset?: /* AccountDataset */ AccountDataset[]
    /**
     * The amount that is currently owed on the credit card account.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: creditCard<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    runningBalance?: /* Money */ Money
    /**
     * A unique ID that the provider site has assigned to the account. The source ID is only available for the HELD accounts.<br><br><b>Applicable containers</b>: bank, creditCard, investment, insurance, loan, reward<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    sourceId?: string
    /**
     * The date on which the due amount has to be paid. <br><b>Additional Details:</b><br><b>Credit Card:</b> The monthly date by when the minimum payment is due to be paid on the credit card account. <br><b>Loan:</b> The date on or before which the due amount should be paid.<br><b>Note:</b> The due date at the account-level can differ from the due date field at the statement-level, as the information in the aggregated card account data provides an up-to-date information to the consumer.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: creditCard, loan, insurance<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    dueDate?: string
    /**
     * The frequency of the billing cycle of the account in case of card. The frequency in which premiums are paid in an insurance policy such as monthly, quarterly, and annually. The frequency in which due amounts are paid in a loan  account.<br><br><b>Aggregated / Manual</b>: Both <br><b>Applicable containers</b>: creditCard, insurance, loan<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul><b>Applicable Values</b><br>
     */
    frequency?:
      | 'DAILY'
      | 'ONE_TIME'
      | 'WEEKLY'
      | 'EVERY_2_WEEKS'
      | 'SEMI_MONTHLY'
      | 'MONTHLY'
      | 'QUARTERLY'
      | 'SEMI_ANNUALLY'
      | 'ANNUALLY'
      | 'EVERY_2_MONTHS'
      | 'EBILL'
      | 'FIRST_DAY_MONTHLY'
      | 'LAST_DAY_MONTHLY'
      | 'EVERY_4_WEEKS'
      | 'UNKNOWN'
      | 'OTHER'
    /**
     * The maturity amount on the CD is the amount(principal and interest) paid on or after the maturity date.<br><b>Additional Details:</b> The Maturity Amount field is only applicable for the account type CD(Fixed Deposits).<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: bank<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    maturityAmount?: /* Money */ Money
    /**
     * The providerAccountIds that share the account with the primary providerAccountId that was created when the user had added the account for the first time.<br><b>Additional Details</b>: This attribute is returned in the response only if the account deduplication feature is enabled and the same account is mapped to more than one provider account IDs indicating the account is owned by more than one user, for example, joint accounts.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: All Containers<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    associatedProviderAccountId?: number /* int64 */[]
    /**
     * The account to be considered as an asset or liability.<br><b>Applicable containers</b>: All Containers<br><b>Aggregated / Manual</b>: Both <br><b>Endpoints</b>:<br><ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    isAsset?: boolean
    /**
     * The principal or loan balance is the outstanding balance on a loan account, excluding the interest and fees. The principal balance is the original borrowed amount plus any applicable loan fees, minus any principal payments.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: loan<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    principalBalance?: /* Money */ Money
    /**
     * The maximum amount that can be withdrawn from an ATM using the credit card. Credit cards issuer allow cardholders to withdraw cash using their cards - the cash limit is a percent of the overall credit limit.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: creditCard<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    totalCashLimit?: /* Money */ Money
    /**
     * The date when a certificate of deposit (CD/FD) matures or the final payment date of a loan at which point the principal amount (including pending interest) is due to be paid.<br><b>Additional Details:</b> The date when a certificate of deposit (CD) matures, i.e., the money in the CD can be withdrawn without paying an early withdrawal penalty.The final payment date of a loan, i.e., the principal amount (including pending interest) is due to be paid.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: bank, loan<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    maturityDate?: string
    /**
     * The minimum amount due is the lowest amount of money that a consumer is required to pay each month.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: creditCard, insurance, loan<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    minimumAmountDue?: /* Money */ Money
    /**
     * Annual percentage yield (APY) is a normalized representation of an interest rate, based on a compounding period of one year. APY generally refers to the rate paid to a depositor by a financial institution on an account.<br><b>Applicable containers</b>: bank<br><b>Aggregated / Manual</b>: Aggregated<br><b>Endpoints</b>:<br><ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    annualPercentageYield?: number // double
    /**
     * The type of account that is aggregated, i.e., savings, checking, credit card, charge, HELOC, etc. The account type is derived based on the attributes of the account. <br><b>Valid Values:</b><br><b>Aggregated Account Type</b><br><b>bank</b><ul><li>CHECKING</li><li>SAVINGS</li><li>CD</li><li>PPF</li><li>RECURRING_DEPOSIT</li><li>FSA</li><li>MONEY_MARKET</li><li>IRA</li><li>PREPAID</li></ul><b>creditCard</b><ul><li>OTHER</li><li>CREDIT</li><li>STORE</li><li>CHARGE</li><li>OTHER</li></ul><b>investment (SN 1.0)</b><ul><li>BROKERAGE_MARGIN</li><li>HSA</li><li>IRA</li><li>BROKERAGE_CASH</li><li>401K</li><li>403B</li><li>TRUST</li><li>ANNUITY</li><li>SIMPLE</li><li>CUSTODIAL</li><li>BROKERAGE_CASH_OPTION</li><li>BROKERAGE_MARGIN_OPTION</li><li>INDIVIDUAL</li><li>CORPORATE</li><li>JTTIC</li><li>JTWROS</li><li>COMMUNITY_PROPERTY</li><li>JOINT_BY_ENTIRETY</li><li>CONSERVATORSHIP</li><li>ROTH</li><li>ROTH_CONVERSION</li><li>ROLLOVER</li><li>EDUCATIONAL</li><li>529_PLAN</li><li>457_DEFERRED_COMPENSATION</li><li>401A</li><li>PSP</li><li>MPP</li><li>STOCK_BASKET</li><li>LIVING_TRUST</li><li>REVOCABLE_TRUST</li><li>IRREVOCABLE_TRUST</li><li>CHARITABLE_REMAINDER</li><li>CHARITABLE_LEAD</li><li>CHARITABLE_GIFT_ACCOUNT</li><li>SEP</li><li>UTMA</li><li>UGMA</li><li>ESOPP</li><li>ADMINISTRATOR</li><li>EXECUTOR</li><li>PARTNERSHIP</li><li>SOLE_PROPRIETORSHIP</li><li>CHURCH</li><li>INVESTMENT_CLUB</li><li>RESTRICTED_STOCK_AWARD</li><li>CMA</li><li>EMPLOYEE_STOCK_PURCHASE_PLAN</li><li>PERFORMANCE_PLAN</li><li>BROKERAGE_LINK_ACCOUNT</li><li>MONEY_MARKET</li><li>SUPER_ANNUATION</li><li>REGISTERED_RETIREMENT_SAVINGS_PLAN</li><li>SPOUSAL_RETIREMENT_SAVINGS_PLAN</li><li>DEFERRED_PROFIT_SHARING_PLAN</li><li>NON_REGISTERED_SAVINGS_PLAN</li><li>REGISTERED_EDUCATION_SAVINGS_PLAN</li><li>GROUP_RETIREMENT_SAVINGS_PLAN</li><li>LOCKED_IN_RETIREMENT_SAVINGS_PLAN</li><li>RESTRICTED_LOCKED_IN_SAVINGS_PLAN</li><li>LOCKED_IN_RETIREMENT_ACCOUNT</li><li>REGISTERED_PENSION_PLAN</li><li>TAX_FREE_SAVINGS_ACCOUNT</li><li>LIFE_INCOME_FUND</li><li>REGISTERED_RETIREMENT_INCOME_FUND</li><li>SPOUSAL_RETIREMENT_INCOME_FUND</li><li>LOCKED_IN_REGISTERED_INVESTMENT_FUND</li><li>PRESCRIBED_REGISTERED_RETIREMENT_INCOME_FUND</li><li>GUARANTEED_INVESTMENT_CERTIFICATES</li><li>REGISTERED_DISABILITY_SAVINGS_PLAN</li><li>DIGITAL_WALLET</li><li>OTHER</li></ul><b>investment (SN 2.0)</b><ul><li>BROKERAGE_CASH</li><li>BROKERAGE_MARGIN</li><li>INDIVIDUAL_RETIREMENT_ACCOUNT_IRA</li><li>EMPLOYEE_RETIREMENT_ACCOUNT_401K</li><li>EMPLOYEE_RETIREMENT_SAVINGS_PLAN_403B</li><li>TRUST</li><li>ANNUITY</li><li>SIMPLE_IRA</li><li>CUSTODIAL_ACCOUNT</li><li>BROKERAGE_CASH_OPTION</li><li>BROKERAGE_MARGIN_OPTION</li><li>INDIVIDUAL</li><li>CORPORATE_INVESTMENT_ACCOUNT</li><li>JOINT_TENANTS_TENANCY_IN_COMMON_JTIC</li><li>JOINT_TENANTS_WITH_RIGHTS_OF_SURVIVORSHIP_JTWROS</li><li>JOINT_TENANTS_COMMUNITY_PROPERTY</li><li>JOINT_TENANTS_TENANTS_BY_ENTIRETY</li><li>CONSERVATOR</li><li>ROTH_IRA</li><li>ROTH_CONVERSION</li><li>ROLLOVER_IRA</li><li>EDUCATIONAL</li><li>EDUCATIONAL_SAVINGS_PLAN_529</li><li>DEFERRED_COMPENSATION_PLAN_457</li><li>MONEY_PURCHASE_RETIREMENT_PLAN_401A</li><li>PROFIT_SHARING_PLAN</li><li>MONEY_PURCHASE_PLAN</li><li>STOCK_BASKET_ACCOUNT</li><li>LIVING_TRUST</li><li>REVOCABLE_TRUST</li><li>IRREVOCABLE_TRUST</li><li>CHARITABLE_REMAINDER_TRUST</li><li>CHARITABLE_LEAD_TRUST</li><li>CHARITABLE_GIFT_ACCOUNT</li><li>SEP_IRA</li><li>UNIFORM_TRANSFER_TO_MINORS_ACT_UTMA</li><li>UNIFORM_GIFT_TO_MINORS_ACT_UGMA</li><li>EMPLOYEE_STOCK_OWNERSHIP_PLAN_ESOP</li><li>ADMINISTRATOR</li><li>EXECUTOR</li><li>PARTNERSHIP</li><li>PROPRIETORSHIP</li><li>CHURCH_ACCOUNT</li><li>INVESTMENT_CLUB</li><li>RESTRICTED_STOCK_AWARD</li><li>CASH_MANAGEMENT_ACCOUNT</li><li>EMPLOYEE_STOCK_PURCHASE_PLAN_ESPP</li><li>PERFORMANCE_PLAN</li><li>BROKERAGE_LINK_ACCOUNT</li><li>MONEY_MARKET_ACCOUNT</li><li>SUPERANNUATION</li><li>REGISTERED_RETIREMENT_SAVINGS_PLAN_RRSP</li><li>SPOUSAL_RETIREMENT_SAVINGS_PLAN_SRSP</li><li>DEFERRED_PROFIT_SHARING_PLAN_DPSP</li><li>NON_REGISTERED_SAVINGS_PLAN_NRSP</li><li>REGISTERED_EDUCATION_SAVINGS_PLAN_RESP</li><li>GROUP_RETIREMENT_SAVINGS_PLAN_GRSP</li><li>LOCKED_IN_RETIREMENT_SAVINGS_PLAN_LRSP</li><li>RESTRICTED_LOCKED_IN_SAVINGS_PLAN_RLSP</li><li>LOCKED_IN_RETIREMENT_ACCOUNT_LIRA</li><li>REGISTERED_PENSION_PLAN_RPP</li><li>TAX_FREE_SAVINGS_ACCOUNT_TFSA</li><li>LIFE_INCOME_FUND_LIF</li><li>REGISTERED_RETIREMENT_INCOME_FUND_RIF</li><li>SPOUSAL_RETIREMENT_INCOME_FUND_SRIF</li><li>LOCKED_IN_REGISTERED_INVESTMENT_FUND_LRIF</li><li>PRESCRIBED_REGISTERED_RETIREMENT_INCOME_FUND_PRIF</li><li>GUARANTEED_INVESTMENT_CERTIFICATES_GIC</li><li>REGISTERED_DISABILITY_SAVINGS_PLAN_RDSP</li><li>DEFINED_CONTRIBUTION_PLAN</li><li>DEFINED_BENEFIT_PLAN</li><li>EMPLOYEE_STOCK_OPTION_PLAN</li><li>NONQUALIFIED_DEFERRED_COMPENSATION_PLAN_409A</li><li>KEOGH_PLAN</li><li>EMPLOYEE_RETIREMENT_ACCOUNT_ROTH_401K</li><li>DEFERRED_CONTINGENT_CAPITAL_PLAN_DCCP</li><li>EMPLOYEE_BENEFIT_PLAN</li><li>EMPLOYEE_SAVINGS_PLAN</li><li>HEALTH_SAVINGS_ACCOUNT_HSA</li><li>COVERDELL_EDUCATION_SAVINGS_ACCOUNT_ESA</li><li>TESTAMENTARY_TRUST</li><li>ESTATE</li><li>GRANTOR_RETAINED_ANNUITY_TRUST_GRAT</li><li>ADVISORY_ACCOUNT</li><li>NON_PROFIT_ORGANIZATION_501C</li><li>HEALTH_REIMBURSEMENT_ARRANGEMENT_HRA</li><li>INDIVIDUAL_SAVINGS_ACCOUNT_ISA</li><li>CASH_ISA</li><li>STOCKS_AND_SHARES_ISA</li><li>INNOVATIVE_FINANCE_ISA</li><li>JUNIOR_ISA</li><li>EMPLOYEES_PROVIDENT_FUND_ORGANIZATION_EPFO</li><li>PUBLIC_PROVIDENT_FUND_PPF</li><li>EMPLOYEES_PENSION_SCHEME_EPS</li><li>NATIONAL_PENSION_SYSTEM_NPS</li><li>INDEXED_ANNUITY</li><li>ANNUITIZED_ANNUITY</li><li>VARIABLE_ANNUITY</li><li>ROTH_403B</li><li>SPOUSAL_IRA</li><li>SPOUSAL_ROTH_IRA</li><li>SARSEP_IRA</li><li>SUBSTANTIALLY_EQUAL_PERIODIC_PAYMENTS_SEPP</li><li>OFFSHORE_TRUST</li><li>IRREVOCABLE_LIFE_INSURANCE_TRUST</li><li>INTERNATIONAL_TRUST</li><li>LIFE_INTEREST_TRUST</li><li>EMPLOYEE_BENEFIT_TRUST</li><li>PRECIOUS_METAL_ACCOUNT</li><li>INVESTMENT_LOAN_ACCOUNT</li><li>GRANTOR_RETAINED_INCOME_TRUST</li><li>PENSION_PLAN</li><li>DIGITAL_WALLET</li><li>OTHER</li></ul><b>loan</b><ul><li>MORTGAGE</li><li>INSTALLMENT_LOAN</li><li>PERSONAL_LOAN</li><li>HOME_EQUITY_LINE_OF_CREDIT</li><li>LINE_OF_CREDIT</li><li>AUTO_LOAN</li><li>STUDENT_LOAN</li><li>HOME_LOAN</li></ul><b>insurance</b><ul><li>AUTO_INSURANCE</li><li>HEALTH_INSURANCE</li><li>HOME_INSURANCE</li><li>LIFE_INSURANCE</li><li>ANNUITY</li><li>TRAVEL_INSURANCE</li><li>INSURANCE</li></ul><b>realEstate</b><ul> <li>REAL_ESTATE</li></ul><b>reward</b><ul><li>REWARD_POINTS</li></ul><b>Manual Account Type</b><br><b>bank</b><ul><li>CHECKING</li><li>SAVINGS</li><li>CD</li><li>PREPAID</li></ul><b>credit</b><ul>  <li>CREDIT</li></ul><b>loan</b><ul>  <li>PERSONAL_LOAN</li><li>HOME_LOAN</li></ul><b>insurance</b><ul><li>INSURANCE</li><li>ANNUITY</li></ul><b>investment</b><ul><li>BROKERAGE_CASH</li></ul><br><br><b>Aggregated / Manual</b>: Both <br><b>Applicable containers</b>: All containers<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    accountType?: string
    /**
     * The date on which the loan is disbursed.<br><br><b>Aggregated / Manual</b>: Both <br><b>Applicable containers</b>: loan<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    originationDate?: string
    /**
     * The total vested balance that appears in an investment account. Such as the 401k account or the equity award account that includes employer provided funding. <br><b>Note:</b> The amount an employee can claim after he or she leaves the organization. The total vested balance field is only applicable to the retirement related accounts such as 401k, equity awards, etc.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: investment<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    totalVestedBalance?: /* Money */ Money
    /**
     * Information of different reward balances associated with the account.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: reward<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    rewardBalance?: /* RewardBalance */ RewardBalance[]
    /**
     * Indicates the status of the loan account. <br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: loan<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul><b>Applicable Values:</b><br>
     */
    sourceAccountStatus?:
      | 'IN_REPAYMENT'
      | 'DEFAULTED'
      | 'IN_SCHOOL'
      | 'IN_GRACE_PERIOD'
      | 'DELINQUENCY'
      | 'DEFERMENT'
      | 'FORBEARANCE'
    /**
     * List of Loan accountId(s) to which the real-estate account is linked<br><br><b>Aggregated / Manual</b>: Both <br><b>Applicable containers</b>: realEstate<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    linkedAccountIds?: number /* int64 */[]
    /**
     * Derived APR will be an estimated purchase APR based on consumers credit card transactions and credit card purchase.<br><b>Aggregated / Manual / Derived</b>: Derived<br><b>Applicable containers</b>: creditCard<br><b>Endpoints</b>:<br><ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    derivedApr?: number // double
    /**
     * The date on which the insurance policy coverage commences.<br><b>Applicable containers</b>: insurance<br><b>Aggregated / Manual</b>: Aggregated<br><b>Endpoints</b>:<br><ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    policyEffectiveDate?: string
    /**
     * The total unvested balance that appears in an investment account.Such as the 401k account or the equity award account that includes employer provided funding. <br><b>Note:</b> The amount the employer contributes is generally subject to vesting and remain unvested for a specific period of time or until fulfillment of certain conditions. The total unvested balance field is only applicable to the retirement related accounts such as 401k, equity awards, etc.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: investment<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    totalUnvestedBalance?: /* Money */ Money
    /**
     * Indicates the contract value of the annuity.<br><b>Note:</b> The annuity balance field is applicable only to annuities.<br><b>Applicable containers</b>: insurance, investment<br><b>Aggregated / Manual</b>: Both <br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    annuityBalance?: /* Money */ Money
    /**
     * The account name as it appears at the site.<br>(The POST accounts service response return this field as name)<br><b>Applicable containers</b>: All Containers<br><b>Aggregated / Manual</b>: Both <br><b>Endpoints</b>:<br><ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    accountName?: string
    /**
     * The maximum amount of credit a financial institution extends to a consumer through a line of credit or a revolving loan like HELOC. <br><b>Additional Details:</b><br><b>Note:</b> The credit limit field is applicable only to LOC and HELOC account types.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: loan<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    totalCreditLimit?: /* Money */ Money
    /**
     * The status of the policy.<br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: insurance<br><b>Endpoints</b>:<br><ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul><b>Applicable Values</b><br>
     */
    policyStatus?: 'ACTIVE' | 'INACTIVE' | 'OTHER'
    /**
     * The sum of the current market values of short positions held in a brokerage account.<br><b>Note:</b> The short balance balance field is only applicable to brokerage related accounts.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: investment<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    shortBalance?: /* Money */ Money
    /**
     * The financial institution that provides the loan.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: loan<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    lender?: string
    /**
     * Indicates the last amount contributed by the employee to the 401k account.<br><b>Note:</b> The last employee contribution amount field is derived from the transaction data and not aggregated from the FI site. The field is only applicable to the 401k account type.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: investment<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    lastEmployeeContributionAmount?: /* Money */ Money
    /**
     * Identifier of the provider site. The primary key of provider resource. <br><br><b>Aggregated / Manual</b>: Both <br><b>Applicable containers</b>: All containers<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    providerId?: string
    /**
     * The date on which the payment for the previous or current billing cycle is done.<br><b>Additional Details:</b> If the payment is already done for the current billing cycle, then the field indicates the payment date of the current billing cycle. If payment is yet to be done for the current billing cycle, then the field indicates the date on which the payment was made for any of the previous billing cycles. The last payment date at the account-level can differ from the last payment date at the statement-level, as the information in the aggregated card account data provides an up-to-date information to the consumer.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: creditCard, loan, insurance<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    lastPaymentDate?: string
    /**
     * Primary reward unit for this reward program. E.g. miles, points, etc.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: reward<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    primaryRewardUnit?: string
    /**
     * Last/Previous payment amount on the account.  Portion of the principal and interest paid on previous month or period to satisfy a loan.<br><b>Additional Details:</b> If the payment is already done for the current billing cycle, then the field indicates the payment of the current billing cycle. If payment is yet to be done for the current billing cycle, then the field indicates the payment that was made for any of the previous billing cycles.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: creditCard, loan, insurance<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    lastPaymentAmount?: /* Money */ Money
    /**
     * The sum of the future payments due to be paid to the insurance company during a policy year. It is the policy rate minus the payments made till date.<br><b>Note:</b> The remaining balance field is applicable only to auto insurance and home insurance.<br><b>Applicable containers</b>: insurance<br><b>Aggregated / Manual</b>: Aggregated<br><b>Endpoints</b>:<br><ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    remainingBalance?: /* Money */ Money
    /**
     * <b>Applicable containers</b>: reward, bank, creditCard, investment, loan, insurance, realEstate, otherLiabilities<br><b>Endpoints</b>:<ul><li>GET accounts </li><li>GET accounts/{accountId}</li><li>POST accounts</ul><li>GET dataExtracts/userData</li><b>Applicable Values</b><br>
     */
    userClassification?: 'BUSINESS' | 'PERSONAL'
    /**
     * Bank and branch identification information.<br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: bank, investment, loan<br><b>Endpoints</b>:<br><ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    bankTransferCode?: /* BankTransferCode */ BankTransferCode[]
    /**
     * The date on which the insurance policy expires or matures.<br><b>Additional Details:</b> The due date at the account-level can differ from the due date field at the statement-level, as the information in the aggregated card account data provides an up-to-date information to the consumer.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: insurance<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    expirationDate?: string
    /**
     * The coverage-related details of the account.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: insurance,investment<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    coverage?: /* Coverage */ Coverage[]
    /**
     * Annual percentage rate applied to cash withdrawals on the card.<br><br><b>Account Type</b>: Aggregated<br><b>Applicable containers</b>: creditCard<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    cashApr?: number // double
    /**
     * Auto refresh account-related information.<br><br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul>
     */
    autoRefresh?: /* AutoRefresh */ AutoRefresh
    /**
     * Indicates the migration status of the account from screen-scraping provider to the Open Banking provider. <br><br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    oauthMigrationStatus?:
      | 'IN_PROGRESS'
      | 'TO_BE_MIGRATED'
      | 'COMPLETED'
      | 'MIGRATED'
    /**
     * The name or identification of the account owner, as it appears at the FI site. <br><b>Note:</b> The account holder name can be full or partial based on how it is displayed in the account summary page of the FI site. In most cases, the FI site does not display the full account holder name in the account summary page.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: bank, creditCard, investment, insurance, loan, reward<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    displayedName?: string
    /**
     * Full account number List of the account that is included only when include = fullAccountNumberList is provided in the request. <br><br><b>Aggregated / Manual</b>: Both <br><b>Applicable containers</b>: bank, creditCard, investment, insurance, loan, reward, otherAssets, otherLiabilities <br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul>
     */
    fullAccountNumberList?: /* FullAccountNumberList */ FullAccountNumberList
    /**
     * The amount due to be paid for the account.<br><b>Additional Details:</b><b>Credit Card:</b> The total amount due for the purchase of goods or services that must be paid by the due date.<br><b>Loan:</b> The amount due to be paid on the due date.<br><b>Note:</b> The amount due at the account-level can differ from the amount due at the statement-level, as the information in the aggregated card account data provides more up-to-date information.<br><b>Applicable containers</b>: creditCard, loan, insurance<br><b>Aggregated / Manual</b>: Both <br><b>Endpoints</b>:<br><ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    amountDue?: /* Money */ Money
    /**
     * Current level of the reward program the user is associated with. E.g. Silver, Jade etc.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: reward<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    currentLevel?: string
    /**
     * The amount of loan that the lender has provided.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: loan<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    originalLoanAmount?: /* Money */ Money
    /**
     * The date to which the policy exists.<br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: insurance<br><b>Endpoints</b>:<br><ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    policyToDate?: string
    /**
     * The loan payoff details such as date by which the payoff amount should be paid, loan payoff amount, and the outstanding balance on the loan account.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: loan<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    loanPayoffDetails?: /* LoanPayoffDetails */ LoanPayoffDetails
    /**
     * The payment profile attribute contains information such as payment address, payment identifier, etc., that are required to set up a payment. <br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: loan<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul>
     */
    paymentProfile?: /* PaymentProfile */ PaymentProfile
    /**
     * The type of service. E.g., Bank, Credit Card, Investment, Insurance, etc.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: All containers<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul><b>Applicable Values</b><br>
     */
    CONTAINER?:
      | 'bank'
      | 'creditCard'
      | 'investment'
      | 'insurance'
      | 'loan'
      | 'reward'
      | 'bill'
      | 'realEstate'
      | 'otherAssets'
      | 'otherLiabilities'
    /**
     * The date on which the last employee contribution was made to the 401k account.<br><b>Note:</b> The last employee contribution date field is derived from the transaction data and not aggregated from the FI site. The field is only applicable to the 401k account type.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: investment<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    lastEmployeeContributionDate?: string
    /**
     * The last payment made for the account.<br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: bill<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    lastPayment?: /* Money */ Money
    /**
     * The monthly or periodic payment on a loan that is recurring in nature. The recurring payment amount is usually same as the amount due, unless late fees or other charges are added eventually changing the amount due for a particular month.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: loan<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    recurringPayment?: /* Money */ Money
  }
  /**
   * AccountAddress
   */
  export interface AccountAddress {
    zip?: string
    country?: string
    address3?: string
    address2?: string
    city?: string
    sourceType?: string
    address1?: string
    street?: string
    state?: string
    type?:
      | 'HOME'
      | 'BUSINESS'
      | 'POBOX'
      | 'RETAIL'
      | 'OFFICE'
      | 'SMALL_BUSINESS'
      | 'COMMUNICATION'
      | 'PERMANENT'
      | 'STATEMENT_ADDRESS'
      | 'PAYMENT'
      | 'PAYOFF'
      | 'UNKNOWN'
  }
  /**
   * AccountBalanceResponse
   */
  export interface AccountBalanceResponse {
    accountBalance?: /* AccountLatestBalance */ AccountLatestBalance[]
  }
  /**
   * AccountDataset
   */
  export interface AccountDataset {
    /**
     * Indicate when the dataset is last updated successfully for the given provider account.<br><br><b>Account Type</b>: Aggregated<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET providerAccounts</li><li>POST providerAccounts</li><li>PUT providerAccounts/{providerAccountId}</li><li>GET providerAccounts/{providerAccountId}</li></ul>
     */
    lastUpdated?: string
    /**
     * Indicate whether the dataset is eligible for update or not.<br><br><b>Account Type</b>: Aggregated<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET providerAccounts</li><li>POST providerAccounts</li><li>PUT providerAccounts/{providerAccountId}</li><li>GET providerAccounts/{providerAccountId}</li></ul><b>Applicable Values</b><br>
     */
    updateEligibility?:
      | 'ALLOW_UPDATE'
      | 'ALLOW_UPDATE_WITH_CREDENTIALS'
      | 'DISALLOW_UPDATE'
    /**
     * The status of last update attempted for the dataset. <br><br><b>Account Type</b>: Aggregated<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET providerAccounts</li><li>POST providerAccounts</li><li>PUT providerAccounts/{providerAccountId}</li><li>GET providerAccounts/{providerAccountId}</li></ul><b>Applicable Values</b><br>
     */
    additionalStatus?:
      | 'LOGIN_IN_PROGRESS'
      | 'DATA_RETRIEVAL_IN_PROGRESS'
      | 'ACCT_SUMMARY_RECEIVED'
      | 'AVAILABLE_DATA_RETRIEVED'
      | 'PARTIAL_DATA_RETRIEVED'
      | 'DATA_RETRIEVAL_FAILED'
      | 'DATA_NOT_AVAILABLE'
      | 'ACCOUNT_LOCKED'
      | 'ADDL_AUTHENTICATION_REQUIRED'
      | 'BETA_SITE_DEV_IN_PROGRESS'
      | 'CREDENTIALS_UPDATE_NEEDED'
      | 'INCORRECT_CREDENTIALS'
      | 'PROPERTY_VALUE_NOT_AVAILABLE'
      | 'INVALID_ADDL_INFO_PROVIDED'
      | 'REQUEST_TIME_OUT'
      | 'SITE_BLOCKING_ERROR'
      | 'UNEXPECTED_SITE_ERROR'
      | 'SITE_NOT_SUPPORTED'
      | 'SITE_UNAVAILABLE'
      | 'TECH_ERROR'
      | 'USER_ACTION_NEEDED_AT_SITE'
      | 'SITE_SESSION_INVALIDATED'
      | 'NEW_AUTHENTICATION_REQUIRED'
      | 'DATASET_NOT_SUPPORTED'
      | 'ENROLLMENT_REQUIRED_FOR_DATASET'
      | 'CONSENT_REQUIRED'
      | 'CONSENT_EXPIRED'
      | 'CONSENT_REVOKED'
      | 'INCORRECT_OAUTH_TOKEN'
      | 'MIGRATION_IN_PROGRESS'
    /**
     * Indicates when the next attempt to update the dataset is scheduled.<br><br><b>Account Type</b>: Aggregated<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET providerAccounts</li><li>POST providerAccounts</li><li>PUT providerAccounts/{providerAccountId}</li><li>GET providerAccounts/{providerAccountId}</li></ul>
     */
    nextUpdateScheduled?: string
    /**
     * The name of the dataset requested from the provider site<br><br><b>Account Type</b>: Manual<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET providerAccounts</li><li>POST providerAccounts</li><li>PUT providerAccounts/{providerAccountId}</li><li>GET providerAccounts/{providerAccountId}</li><li>GET providers/{providerId}</li><li>GET providers</li></ul><b>Applicable Values</b><br>
     */
    name?: 'BASIC_AGG_DATA' | 'ADVANCE_AGG_DATA' | 'ACCT_PROFILE' | 'DOCUMENT'
    /**
     * Indicate when the last attempt was performed to update the dataset for the given provider account<br><br><b>Account Type</b>: Aggregated<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET providerAccounts</li><li>POST providerAccounts</li><li>PUT providerAccounts/{providerAccountId}</li><li>GET providerAccounts/{providerAccountId}</li></ul>
     */
    lastUpdateAttempt?: string
  }
  /**
   * AccountHistoricalBalancesResponse
   */
  export interface AccountHistoricalBalancesResponse {
    account?: /* AccountHistory */ AccountHistory[]
  }
  /**
   * AccountHistory
   */
  export interface AccountHistory {
    historicalBalances?: /* HistoricalBalance */ HistoricalBalance[]
    id?: number // int64
  }
  /**
   * AccountHolder
   */
  export interface AccountHolder {
    /**
     * Identifiers of the account holder.<br><br><b>Aggregated / Manual</b>: Aggregated <br><b>Applicable containers</b>: bank<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul>
     */
    identifier?: /* Identifier */ Identifier[]
    /**
     * Identifiers of the account holder.<br><br><b>Aggregated / Manual</b>: Aggregated <br><b>Applicable containers</b>: bank<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul>
     */
    gender?: string
    /**
     * Indicates the ownership of the account.<br><br><b>Aggregated / Manual</b>: Aggregated <br><b>Applicable containers</b>: bank<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul><b>Applicable Values</b><br>
     */
    ownership?:
      | 'PRIMARY'
      | 'SECONDARY'
      | 'CUSTODIAN'
      | 'OTHERS'
      | 'POWER_OF_ATTORNEY'
      | 'TRUSTEE'
      | 'JOINT_OWNER'
      | 'BENEFICIARY'
      | 'AAS'
      | 'BUSINESS'
      | 'DBA'
      | 'TRUST'
    /**
     * Name of the account holder.<br><br><b>Aggregated / Manual</b>: Aggregated <br><b>Applicable containers</b>: bank<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul>
     */
    name?: /* Name */ Name
  }
  /**
   * AccountLatestBalance
   */
  export interface AccountLatestBalance {
    /**
     * The account name as it appears at the site.<br>(The POST accounts service response return this field as name)<br><b>Applicable containers</b>: bank, investment<br><b>Aggregated / Manual</b>: Aggregated<br><b>Endpoints</b>:<br><ul><li>GET accounts/latestBalances</li></ul>
     */
    accountName?: string
    /**
     * The total account value. <br><b>Additional Details:</b><br><b>Investment:</b> The total balance of all the investment account, as it appears on the FI site.<b>Applicable containers</b>: investment <br><b>Aggregated / Manual</b>: Aggregated<br><b>Endpoints</b>:<br><ul><li>GET accounts/latestBalances</li></ul>
     */
    totalBalance?: /* Money */ Money
    /**
     * The type of account that is aggregated, i.e., savings, checking, charge, HELOC, etc. The account type is derived based on the attributes of the account. <br><b>Valid Values:</b><br><b>Aggregated Account Type</b><br><b>bank</b><ul><li>CHECKING</li><li>SAVINGS</li><li>CD</li><li>PPF</li><li>RECURRING_DEPOSIT</li><li>FSA</li><li>MONEY_MARKET</li><li>IRA</li><li>PREPAID</li></ul><b>investment (SN 1.0)</b><ul><li>BROKERAGE_MARGIN</li><li>HSA</li><li>IRA</li><li>BROKERAGE_CASH</li><li>401K</li><li>403B</li><li>TRUST</li><li>ANNUITY</li><li>SIMPLE</li><li>CUSTODIAL</li><li>BROKERAGE_CASH_OPTION</li><li>BROKERAGE_MARGIN_OPTION</li><li>INDIVIDUAL</li><li>CORPORATE</li><li>JTTIC</li><li>JTWROS</li><li>COMMUNITY_PROPERTY</li><li>JOINT_BY_ENTIRETY</li><li>CONSERVATORSHIP</li><li>ROTH</li><li>ROTH_CONVERSION</li><li>ROLLOVER</li><li>EDUCATIONAL</li><li>529_PLAN</li><li>457_DEFERRED_COMPENSATION</li><li>401A</li><li>PSP</li><li>MPP</li><li>STOCK_BASKET</li><li>LIVING_TRUST</li><li>REVOCABLE_TRUST</li><li>IRREVOCABLE_TRUST</li><li>CHARITABLE_REMAINDER</li><li>CHARITABLE_LEAD</li><li>CHARITABLE_GIFT_ACCOUNT</li><li>SEP</li><li>UTMA</li><li>UGMA</li><li>ESOPP</li><li>ADMINISTRATOR</li><li>EXECUTOR</li><li>PARTNERSHIP</li><li>SOLE_PROPRIETORSHIP</li><li>CHURCH</li><li>INVESTMENT_CLUB</li><li>RESTRICTED_STOCK_AWARD</li><li>CMA</li><li>EMPLOYEE_STOCK_PURCHASE_PLAN</li><li>PERFORMANCE_PLAN</li><li>BROKERAGE_LINK_ACCOUNT</li><li>MONEY_MARKET</li><li>SUPER_ANNUATION</li><li>REGISTERED_RETIREMENT_SAVINGS_PLAN</li><li>SPOUSAL_RETIREMENT_SAVINGS_PLAN</li><li>DEFERRED_PROFIT_SHARING_PLAN</li><li>NON_REGISTERED_SAVINGS_PLAN</li><li>REGISTERED_EDUCATION_SAVINGS_PLAN</li><li>GROUP_RETIREMENT_SAVINGS_PLAN</li><li>LOCKED_IN_RETIREMENT_SAVINGS_PLAN</li><li>RESTRICTED_LOCKED_IN_SAVINGS_PLAN</li><li>LOCKED_IN_RETIREMENT_ACCOUNT</li><li>REGISTERED_PENSION_PLAN</li><li>TAX_FREE_SAVINGS_ACCOUNT</li><li>LIFE_INCOME_FUND</li><li>REGISTERED_RETIREMENT_INCOME_FUND</li><li>SPOUSAL_RETIREMENT_INCOME_FUND</li><li>LOCKED_IN_REGISTERED_INVESTMENT_FUND</li><li>PRESCRIBED_REGISTERED_RETIREMENT_INCOME_FUND</li><li>GUARANTEED_INVESTMENT_CERTIFICATES</li><li>REGISTERED_DISABILITY_SAVINGS_PLAN</li><li>DIGITAL_WALLET</li><li>OTHER</li></ul><b>investment (SN 2.0)</b><ul><li>BROKERAGE_CASH</li><li>BROKERAGE_MARGIN</li><li>INDIVIDUAL_RETIREMENT_ACCOUNT_IRA</li><li>EMPLOYEE_RETIREMENT_ACCOUNT_401K</li><li>EMPLOYEE_RETIREMENT_SAVINGS_PLAN_403B</li><li>TRUST</li><li>ANNUITY</li><li>SIMPLE_IRA</li><li>CUSTODIAL_ACCOUNT</li><li>BROKERAGE_CASH_OPTION</li><li>BROKERAGE_MARGIN_OPTION</li><li>INDIVIDUAL</li><li>CORPORATE_INVESTMENT_ACCOUNT</li><li>JOINT_TENANTS_TENANCY_IN_COMMON_JTIC</li><li>JOINT_TENANTS_WITH_RIGHTS_OF_SURVIVORSHIP_JTWROS</li><li>JOINT_TENANTS_COMMUNITY_PROPERTY</li><li>JOINT_TENANTS_TENANTS_BY_ENTIRETY</li><li>CONSERVATOR</li><li>ROTH_IRA</li><li>ROTH_CONVERSION</li><li>ROLLOVER_IRA</li><li>EDUCATIONAL</li><li>EDUCATIONAL_SAVINGS_PLAN_529</li><li>DEFERRED_COMPENSATION_PLAN_457</li><li>MONEY_PURCHASE_RETIREMENT_PLAN_401A</li><li>PROFIT_SHARING_PLAN</li><li>MONEY_PURCHASE_PLAN</li><li>STOCK_BASKET_ACCOUNT</li><li>LIVING_TRUST</li><li>REVOCABLE_TRUST</li><li>IRREVOCABLE_TRUST</li><li>CHARITABLE_REMAINDER_TRUST</li><li>CHARITABLE_LEAD_TRUST</li><li>CHARITABLE_GIFT_ACCOUNT</li><li>SEP_IRA</li><li>UNIFORM_TRANSFER_TO_MINORS_ACT_UTMA</li><li>UNIFORM_GIFT_TO_MINORS_ACT_UGMA</li><li>EMPLOYEE_STOCK_OWNERSHIP_PLAN_ESOP</li><li>ADMINISTRATOR</li><li>EXECUTOR</li><li>PARTNERSHIP</li><li>PROPRIETORSHIP</li><li>CHURCH_ACCOUNT</li><li>INVESTMENT_CLUB</li><li>RESTRICTED_STOCK_AWARD</li><li>CASH_MANAGEMENT_ACCOUNT</li><li>EMPLOYEE_STOCK_PURCHASE_PLAN_ESPP</li><li>PERFORMANCE_PLAN</li><li>BROKERAGE_LINK_ACCOUNT</li><li>MONEY_MARKET_ACCOUNT</li><li>SUPERANNUATION</li><li>REGISTERED_RETIREMENT_SAVINGS_PLAN_RRSP</li><li>SPOUSAL_RETIREMENT_SAVINGS_PLAN_SRSP</li><li>DEFERRED_PROFIT_SHARING_PLAN_DPSP</li><li>NON_REGISTERED_SAVINGS_PLAN_NRSP</li><li>REGISTERED_EDUCATION_SAVINGS_PLAN_RESP</li><li>GROUP_RETIREMENT_SAVINGS_PLAN_GRSP</li><li>LOCKED_IN_RETIREMENT_SAVINGS_PLAN_LRSP</li><li>RESTRICTED_LOCKED_IN_SAVINGS_PLAN_RLSP</li><li>LOCKED_IN_RETIREMENT_ACCOUNT_LIRA</li><li>REGISTERED_PENSION_PLAN_RPP</li><li>TAX_FREE_SAVINGS_ACCOUNT_TFSA</li><li>LIFE_INCOME_FUND_LIF</li><li>REGISTERED_RETIREMENT_INCOME_FUND_RIF</li><li>SPOUSAL_RETIREMENT_INCOME_FUND_SRIF</li><li>LOCKED_IN_REGISTERED_INVESTMENT_FUND_LRIF</li><li>PRESCRIBED_REGISTERED_RETIREMENT_INCOME_FUND_PRIF</li><li>GUARANTEED_INVESTMENT_CERTIFICATES_GIC</li><li>REGISTERED_DISABILITY_SAVINGS_PLAN_RDSP</li><li>DEFINED_CONTRIBUTION_PLAN</li><li>DEFINED_BENEFIT_PLAN</li><li>EMPLOYEE_STOCK_OPTION_PLAN</li><li>NONQUALIFIED_DEFERRED_COMPENSATION_PLAN_409A</li><li>KEOGH_PLAN</li><li>EMPLOYEE_RETIREMENT_ACCOUNT_ROTH_401K</li><li>DEFERRED_CONTINGENT_CAPITAL_PLAN_DCCP</li><li>EMPLOYEE_BENEFIT_PLAN</li><li>EMPLOYEE_SAVINGS_PLAN</li><li>HEALTH_SAVINGS_ACCOUNT_HSA</li><li>COVERDELL_EDUCATION_SAVINGS_ACCOUNT_ESA</li><li>TESTAMENTARY_TRUST</li><li>ESTATE</li><li>GRANTOR_RETAINED_ANNUITY_TRUST_GRAT</li><li>ADVISORY_ACCOUNT</li><li>NON_PROFIT_ORGANIZATION_501C</li><li>HEALTH_REIMBURSEMENT_ARRANGEMENT_HRA</li><li>INDIVIDUAL_SAVINGS_ACCOUNT_ISA</li><li>CASH_ISA</li><li>STOCKS_AND_SHARES_ISA</li><li>INNOVATIVE_FINANCE_ISA</li><li>JUNIOR_ISA</li><li>EMPLOYEES_PROVIDENT_FUND_ORGANIZATION_EPFO</li><li>PUBLIC_PROVIDENT_FUND_PPF</li><li>EMPLOYEES_PENSION_SCHEME_EPS</li><li>NATIONAL_PENSION_SYSTEM_NPS</li><li>INDEXED_ANNUITY</li><li>ANNUITIZED_ANNUITY</li><li>VARIABLE_ANNUITY</li><li>ROTH_403B</li><li>SPOUSAL_IRA</li><li>SPOUSAL_ROTH_IRA</li><li>SARSEP_IRA</li><li>SUBSTANTIALLY_EQUAL_PERIODIC_PAYMENTS_SEPP</li><li>OFFSHORE_TRUST</li><li>IRREVOCABLE_LIFE_INSURANCE_TRUST</li><li>INTERNATIONAL_TRUST</li><li>LIFE_INTEREST_TRUST</li><li>EMPLOYEE_BENEFIT_TRUST</li><li>PRECIOUS_METAL_ACCOUNT</li><li>INVESTMENT_LOAN_ACCOUNT</li><li>GRANTOR_RETAINED_INCOME_TRUST</li><li>PENSION_PLAN</li><li>DIGITAL_WALLET</li><li>OTHER</li></ul><ul><li>GET accounts/latestBalances</li></ul>
     */
    accountType?: string
    /**
     * The balance in the account that is available at the beginning of the business day; it is equal to the ledger balance of the account.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: bank<br><b>Endpoints</b>:<ul><li>GET accounts/latestBalances</li></ul>
     */
    currentBalance?: /* Money */ Money
    /**
     * The status of the account balance refresh request.
     */
    refreshStatus?: 'SUCCESS' | 'IN_PROGRESS' | 'FAILED'
    /**
     * The account number as it appears on the site. (The POST accounts service response return this field as number)<br><b>Additional Details</b>:<b> Bank / Investment</b>:<br> The account number for the bank account as it appears at the site.<br>In most cases, the site does not display the full account number in the account summary page and additional navigation is required to aggregate it.<br><b>Applicable containers</b>: bank, investment<br><b>Aggregated / Manual</b>: Aggregated<br><b>Endpoints</b>:<br><ul><li>GET accounts/latestBalances</li></ul>
     */
    accountNumber?: string
    /**
     * The balance in the account that is available for spending. For checking accounts with overdraft, available balance may include overdraft amount, if end site adds overdraft balance to available balance.<br><b>Applicable containers</b>: bank, investment<br><b>Aggregated / Manual</b>: Aggregated<br><b>Endpoints</b>:<br><ul><li>GET accounts/latestBalances</li></ul>
     */
    availableBalance?: /* Money */ Money
    /**
     * The primary key of the provider account resource.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: bank, investment<br><b>Endpoints</b>:<ul><li>GET accounts/latestBalances</li></ul>
     */
    accountId?: number // int64
    /**
     * The date time the account information was last retrieved from the provider site and updated in the Yodlee system.<br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: bank, investment<br><b>Endpoints</b>:<ul><li>GET accounts/latestBalances</li></ul>
     */
    lastUpdated?: string
    /**
     * The total account value. <br><b>Additional Details:</b><br><b>Bank:</b> available balance or current balance.<br><b>Investment:</b> The total balance of all the investment account, as it appears on the FI site.<b>Applicable containers</b>: bank, investment <br><b>Aggregated / Manual</b>: Aggregated<br><b>Endpoints</b>:<br><ul><li>GET accounts/latestBalances</li></ul>
     */
    balance?: /* Money */ Money
    /**
     * Identifier of the provider site. The primary key of provider resource. <br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: bank, investment<br><b>Endpoints</b>:<ul><li>GET accounts/latestBalances</li></ul>
     */
    providerId?: string
    /**
     * The primary key of the provider account resource.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: bank, investment<br><b>Endpoints</b>:<ul><li>GET accounts/latestBalances</li></ul>
     */
    providerAccountId?: number // int64
    /**
     * The type of service. E.g., Bank, Investment <br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: bank, investment<br><b>Endpoints</b>:<ul><li>GET accounts/latestBalances</li></ul><b>Applicable Values</b><br>
     */
    CONTAINER?: 'bank' | 'investment'
    /**
     * The amount that is available for immediate withdrawal or the total amount available to purchase securities in a brokerage or investment account.<br><b>Note:</b> The cash balance field is only applicable to brokerage related accounts.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: investment<br><b>Endpoints</b>:<ul><li>GET accounts/latestBalances</li></ul>
     */
    cash?: /* Money */ Money
    /**
     * Service provider or institution name where the account originates. This belongs to the provider resource.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: bank, investment<br><b>Endpoints</b>:<ul><li>GET accounts/latestBalances</li></ul>
     */
    providerName?: string
    /**
     * The reason the account balance refresh failed.
     */
    failedReason?:
      | 'REQUIRED_DATA_NOT_AVAILABLE'
      | 'USER_INPUT_REQUIRED'
      | 'CREDENTIALS_UPDATE_NEEDED'
      | 'INCORRECT_CREDENTIALS'
      | 'USER_ACTION_NEEDED_AT_SITE'
      | 'ADDL_AUTHENTICATION_REQUIRED'
      | 'INVALID_ADDL_INFO_PROVIDED'
      | 'ACCOUNT_LOCKED'
      | 'SITE_NOT_SUPPORTED'
      | 'SITE_BLOCKING_ERROR'
      | 'TECH_ERROR'
      | 'UNEXPECTED_SITE_ERROR'
      | 'SITE_UNAVAILABLE'
      | 'SITE_SESSION_INVALIDATED'
      | 'REQUEST_TIME_OUT'
      | 'CONSENT_EXPIRED'
      | 'CONSENT_REVOKED'
      | 'INCORRECT_OAUTH_TOKEN'
      | 'CONSENT_REQUIRED'
      | 'NEW_AUTHENTICATION_REQUIRED'
  }
  /**
   * AccountMigrationResponse
   */
  export interface AccountMigrationResponse {
    providerId?: number // int64
    providerAccountId?: number // int64
  }
  /**
   * AccountProfile
   */
  export interface AccountProfile {
    /**
     * Identifiers available in the profile page of the account.<br><br><b>Account Type</b>: Aggregated<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul>
     */
    identifier?: /* Identifier */ Identifier[]
    /**
     * Address available in the profile page of the account.<br><br><b>Account Type</b>: Aggregated<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul>
     */
    address?: /* AccountAddress */ AccountAddress[]
    /**
     * Phone number available in the profile page of the account.<br><br><b>Account Type</b>: Aggregated<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul>
     */
    phoneNumber?: /* PhoneNumber */ PhoneNumber[]
    /**
     * Email Id available in the profile page of the account.<br><br><b>Account Type</b>: Aggregated<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul>
     */
    email?: /* Email */ Email[]
  }
  /**
   * AccountResponse
   */
  export interface AccountResponse {
    account?: /* Account */ Account[]
  }
  /**
   * AddedProviderAccount
   */
  export interface AddedProviderAccount {
    /**
     * Indicate when the providerAccount is last updated successfully.<br><br><b>Account Type</b>: Aggregated<br><b>Endpoints</b>:<ul><li>GET dataExtracts/userData</li></ul>
     */
    lastUpdated?: string
    /**
     * The source through which the providerAccount is added in the system.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts</li><li>POST providerAccounts</li><li>PUT providerAccounts/{providerAccountId}</li><li>GET providerAccounts/{providerAccountId}</li><li>GET dataExtracts/userData</li></ul><b>Applicable Values</b><br>
     */
    aggregationSource?: 'SYSTEM' | 'USER'
    /**
     * Indicates the migration status of the provider account from screen-scraping provider to the Open Banking provider. <br><br><b>Endpoints</b>:<ul><li>GET providerAccounts</li><li>GET providerAccounts/{providerAccountId}</li><li>PUT providerAccounts/{providerAccountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    oauthMigrationStatus?:
      | 'IN_PROGRESS'
      | 'TO_BE_MIGRATED'
      | 'COMPLETED'
      | 'MIGRATED'
    /**
     * Unique identifier for the provider resource. This denotes the provider for which the provider account id is generated by the user.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts</li><li>POST providerAccounts</li><li>PUT providerAccounts/{providerAccountId}</li><li>GET providerAccounts/{providerAccountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    providerId?: number // int64
    /**
     * Unique id generated to indicate the request.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts</li><li>POST providerAccounts</li><li>PUT providerAccounts/{providerAccountId}</li><li>GET providerAccounts/{providerAccountId}</li></ul>
     */
    requestId?: string
    /**
     * Indicates whether account is a manual or aggregated provider account.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts</li><li>POST providerAccounts</li><li>PUT providerAccounts/{providerAccountId}</li><li>GET providerAccounts/{providerAccountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    isManual?: boolean
    /**
     * Unique identifier for the provider account resource. This is created during account addition.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts</li><li>POST providerAccounts</li><li>PUT providerAccounts/{providerAccountId}</li><li>GET providerAccounts/{providerAccountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    id?: number // int64
    /**
     * Logical grouping of dataset attributes into datasets such as Basic Aggregation Data, Account Profile and Documents.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts</li><li>POST providerAccounts</li><li>PUT providerAccounts/{providerAccountId}</li><li>GET providerAccounts/{providerAccountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    dataset?: /* AccountDataset */ AccountDataset[]
    /**
     * The status of last update attempted for the account. <br><br><b>Endpoints</b>:<ul><li>GET providerAccounts</li><li>POST providerAccounts</li><li>PUT providerAccounts/{providerAccountId}</li><li>GET providerAccounts/{providerAccountId}</li><li>GET dataExtracts/userData</li></ul><b>Applicable Values</b><br>
     */
    status?:
      | 'LOGIN_IN_PROGRESS'
      | 'USER_INPUT_REQUIRED'
      | 'IN_PROGRESS'
      | 'PARTIAL_SUCCESS'
      | 'SUCCESS'
      | 'FAILED'
      | 'MIGRATION_IN_PROGRESS'
  }
  /**
   * AddedProviderAccountResponse
   */
  export interface AddedProviderAccountResponse {
    providerAccount?: /* AddedProviderAccount */ AddedProviderAccount[]
  }
  /**
   * ApiKeyOutput
   */
  export interface ApiKeyOutput {
    /**
     * Time in seconds after which the JWT token created for users expires.<br><br><b>Endpoints</b>:<ul><li>GET /auth/apiKey</li><li>POST /auth/apiKey</li></ul>
     */
    expiresIn?: number // int64
    /**
     * The date on which the apiKey was created for the customer.<br><br><b>Endpoints</b>:<ul><li>GET /auth/apiKey</li><li>POST /auth/apiKey</li></ul>
     */
    createdDate?: string
    /**
     * Public key uploaded by the customer while generating ApiKey.<br><br><b>Endpoints</b>:<ul><li>GET /auth/apiKey</li><li>POST /auth/apiKey</li></ul>
     */
    publicKey?: string
    /**
     * ApiKey or the issuer key used to generate the JWT token for authentication.<br><br><b>Endpoints</b>:<ul><li>GET /auth/apiKey</li><li>POST /auth/apiKey</li></ul>
     */
    key?: string
  }
  /**
   * ApiKeyRequest
   */
  export interface ApiKeyRequest {
    /**
     * Public key uploaded by the customer while generating ApiKey.<br><br><b>Endpoints</b>:<ul><li>GET /auth/apiKey</li><li>POST /auth/apiKey</li></ul>
     */
    publicKey?: string
  }
  /**
   * ApiKeyResponse
   */
  export interface ApiKeyResponse {
    /**
     * ApiKey customer details.<br><br><b>Endpoints</b>:<ul><li>GET /auth/apiKey</li><li>POST /auth/apiKey</li></ul>
     */
    apiKey?: /* ApiKeyOutput */ ApiKeyOutput[]
  }
  /**
   * AssetClassification
   */
  export interface AssetClassification {
    /**
     * The allocation percentage of the holding.<br><br><b>Required Feature Enablement</b>: Asset classification feature<br><br><b>Applicable containers</b>: investment<br>
     */
    allocation?: number // double
    /**
     * The type of classification to which the investment belongs (assetClass, country, sector, and style).<br><b>Required Feature Enablement</b>: Asset classification feature<br><br><b>Applicable containers</b>: investment<br>
     */
    classificationType?: string
    /**
     * The value for each classificationType.<br><b>Required Feature Enablement</b>: Asset classification feature<br><br><b>Applicable containers</b>: investment<br>
     */
    classificationValue?: string
  }
  /**
   * AssetClassificationList
   */
  export interface AssetClassificationList {
    /**
     * The type of classification to which the investment belongs (assetClass, country, sector, and style).<br><b>Required Feature Enablement</b>: Asset classification feature<br><br><b>Applicable containers</b>: investment<br>
     */
    classificationType?: string
    /**
     * The value for each classificationType.<br><b>Required Feature Enablement</b>: Asset classification feature<br><br><b>Applicable containers</b>: investment<br>
     */
    classificationValue?: string[]
  }
  /**
   * AssociatedAccount
   */
  export interface AssociatedAccount {
    /**
     * The date time the account information was last retrieved from the provider site and updated in the Yodlee system.<br><b>Applicable containers</b>: bank<br><b>Associated Accounts<br><b>Endpoints</b>:<ul><li>GET Associated Accounts/{providerAccountId}</li></ul>
     */
    lastUpdated?: string
    /**
     * The total account value. <br><b>Additional Details:</b><br><b>Bank:</b> available balance or current balance.<br><b>Credit Card:</b> running Balance.<br><b>Investment:</b> The total balance of all the investment account, as it appears on the FI site.<br><b>Insurance:</b> CashValue or amountDue<br><b>Loan:</b> principalBalance<br><b>Applicable containers</b>: bank, creditCard, investment, insurance, loan, otherAssets, otherLiabilities, realEstate<br><b>Associated Accounts<br><b>Endpoints</b>:<ul><li>GET Associated Accounts/{providerAccountId}</li></ul>
     */
    balance?: /* Money */ Money
    /**
     * The account name as it appears at the site.<br>(The POST accounts service response return this field as name)<br><b>Associated Accounts<br><b>Applicable containers</b>: All containers<br><b>Endpoints</b>:<ul><li>GET Associated Accounts/{providerAccountId}</li></ul>
     */
    accountName?: string
    /**
     * Identifier of the provider site. The primary key of provider resource. <br><br><b>Associated Accounts<br><b>Applicable containers</b>: All containers<br><b>Endpoints</b>:<ul><li>GET Associated Accounts/{providerAccountId}</li></ul>
     */
    providerId?: string
    /**
     * The type of account that is aggregated, i.e., savings, checking, credit card, charge, HELOC, etc. The account type is derived based on the attributes of the account. <br><b>Valid Values:</b><br><b>Aggregated Account Type</b><br><b>bank</b><ul><li>CHECKING</li><li>SAVINGS</li><li>CD</li><li>PPF</li><li>RECURRING_DEPOSIT</li><li>FSA</li><li>MONEY_MARKET</li><li>IRA</li><li>PREPAID</li></ul><b>creditCard</b><ul><li>OTHER</li><li>CREDIT</li><li>STORE</li><li>CHARGE</li><li>OTHER</li></ul><b>investment (SN 1.0)</b><ul><li>BROKERAGE_MARGIN</li><li>HSA</li><li>IRA</li><li>BROKERAGE_CASH</li><li>401K</li><li>403B</li><li>TRUST</li><li>ANNUITY</li><li>SIMPLE</li><li>CUSTODIAL</li><li>BROKERAGE_CASH_OPTION</li><li>BROKERAGE_MARGIN_OPTION</li><li>INDIVIDUAL</li><li>CORPORATE</li><li>JTTIC</li><li>JTWROS</li><li>COMMUNITY_PROPERTY</li><li>JOINT_BY_ENTIRETY</li><li>CONSERVATORSHIP</li><li>ROTH</li><li>ROTH_CONVERSION</li><li>ROLLOVER</li><li>EDUCATIONAL</li><li>529_PLAN</li><li>457_DEFERRED_COMPENSATION</li><li>401A</li><li>PSP</li><li>MPP</li><li>STOCK_BASKET</li><li>LIVING_TRUST</li><li>REVOCABLE_TRUST</li><li>IRREVOCABLE_TRUST</li><li>CHARITABLE_REMAINDER</li><li>CHARITABLE_LEAD</li><li>CHARITABLE_GIFT_ACCOUNT</li><li>SEP</li><li>UTMA</li><li>UGMA</li><li>ESOPP</li><li>ADMINISTRATOR</li><li>EXECUTOR</li><li>PARTNERSHIP</li><li>SOLE_PROPRIETORSHIP</li><li>CHURCH</li><li>INVESTMENT_CLUB</li><li>RESTRICTED_STOCK_AWARD</li><li>CMA</li><li>EMPLOYEE_STOCK_PURCHASE_PLAN</li><li>PERFORMANCE_PLAN</li><li>BROKERAGE_LINK_ACCOUNT</li><li>MONEY_MARKET</li><li>SUPER_ANNUATION</li><li>REGISTERED_RETIREMENT_SAVINGS_PLAN</li><li>SPOUSAL_RETIREMENT_SAVINGS_PLAN</li><li>DEFERRED_PROFIT_SHARING_PLAN</li><li>NON_REGISTERED_SAVINGS_PLAN</li><li>REGISTERED_EDUCATION_SAVINGS_PLAN</li><li>GROUP_RETIREMENT_SAVINGS_PLAN</li><li>LOCKED_IN_RETIREMENT_SAVINGS_PLAN</li><li>RESTRICTED_LOCKED_IN_SAVINGS_PLAN</li><li>LOCKED_IN_RETIREMENT_ACCOUNT</li><li>REGISTERED_PENSION_PLAN</li><li>TAX_FREE_SAVINGS_ACCOUNT</li><li>LIFE_INCOME_FUND</li><li>REGISTERED_RETIREMENT_INCOME_FUND</li><li>SPOUSAL_RETIREMENT_INCOME_FUND</li><li>LOCKED_IN_REGISTERED_INVESTMENT_FUND</li><li>PRESCRIBED_REGISTERED_RETIREMENT_INCOME_FUND</li><li>GUARANTEED_INVESTMENT_CERTIFICATES</li><li>REGISTERED_DISABILITY_SAVINGS_PLAN</li><li>DIGITAL_WALLET</li><li>OTHER</li></ul><b>investment (SN 2.0)</b><ul><li>BROKERAGE_CASH</li><li>BROKERAGE_MARGIN</li><li>INDIVIDUAL_RETIREMENT_ACCOUNT_IRA</li><li>EMPLOYEE_RETIREMENT_ACCOUNT_401K</li><li>EMPLOYEE_RETIREMENT_SAVINGS_PLAN_403B</li><li>TRUST</li><li>ANNUITY</li><li>SIMPLE_IRA</li><li>CUSTODIAL_ACCOUNT</li><li>BROKERAGE_CASH_OPTION</li><li>BROKERAGE_MARGIN_OPTION</li><li>INDIVIDUAL</li><li>CORPORATE_INVESTMENT_ACCOUNT</li><li>JOINT_TENANTS_TENANCY_IN_COMMON_JTIC</li><li>JOINT_TENANTS_WITH_RIGHTS_OF_SURVIVORSHIP_JTWROS</li><li>JOINT_TENANTS_COMMUNITY_PROPERTY</li><li>JOINT_TENANTS_TENANTS_BY_ENTIRETY</li><li>CONSERVATOR</li><li>ROTH_IRA</li><li>ROTH_CONVERSION</li><li>ROLLOVER_IRA</li><li>EDUCATIONAL</li><li>EDUCATIONAL_SAVINGS_PLAN_529</li><li>DEFERRED_COMPENSATION_PLAN_457</li><li>MONEY_PURCHASE_RETIREMENT_PLAN_401A</li><li>PROFIT_SHARING_PLAN</li><li>MONEY_PURCHASE_PLAN</li><li>STOCK_BASKET_ACCOUNT</li><li>LIVING_TRUST</li><li>REVOCABLE_TRUST</li><li>IRREVOCABLE_TRUST</li><li>CHARITABLE_REMAINDER_TRUST</li><li>CHARITABLE_LEAD_TRUST</li><li>CHARITABLE_GIFT_ACCOUNT</li><li>SEP_IRA</li><li>UNIFORM_TRANSFER_TO_MINORS_ACT_UTMA</li><li>UNIFORM_GIFT_TO_MINORS_ACT_UGMA</li><li>EMPLOYEE_STOCK_OWNERSHIP_PLAN_ESOP</li><li>ADMINISTRATOR</li><li>EXECUTOR</li><li>PARTNERSHIP</li><li>PROPRIETORSHIP</li><li>CHURCH_ACCOUNT</li><li>INVESTMENT_CLUB</li><li>RESTRICTED_STOCK_AWARD</li><li>CASH_MANAGEMENT_ACCOUNT</li><li>EMPLOYEE_STOCK_PURCHASE_PLAN_ESPP</li><li>PERFORMANCE_PLAN</li><li>BROKERAGE_LINK_ACCOUNT</li><li>MONEY_MARKET_ACCOUNT</li><li>SUPERANNUATION</li><li>REGISTERED_RETIREMENT_SAVINGS_PLAN_RRSP</li><li>SPOUSAL_RETIREMENT_SAVINGS_PLAN_SRSP</li><li>DEFERRED_PROFIT_SHARING_PLAN_DPSP</li><li>NON_REGISTERED_SAVINGS_PLAN_NRSP</li><li>REGISTERED_EDUCATION_SAVINGS_PLAN_RESP</li><li>GROUP_RETIREMENT_SAVINGS_PLAN_GRSP</li><li>LOCKED_IN_RETIREMENT_SAVINGS_PLAN_LRSP</li><li>RESTRICTED_LOCKED_IN_SAVINGS_PLAN_RLSP</li><li>LOCKED_IN_RETIREMENT_ACCOUNT_LIRA</li><li>REGISTERED_PENSION_PLAN_RPP</li><li>TAX_FREE_SAVINGS_ACCOUNT_TFSA</li><li>LIFE_INCOME_FUND_LIF</li><li>REGISTERED_RETIREMENT_INCOME_FUND_RIF</li><li>SPOUSAL_RETIREMENT_INCOME_FUND_SRIF</li><li>LOCKED_IN_REGISTERED_INVESTMENT_FUND_LRIF</li><li>PRESCRIBED_REGISTERED_RETIREMENT_INCOME_FUND_PRIF</li><li>GUARANTEED_INVESTMENT_CERTIFICATES_GIC</li><li>REGISTERED_DISABILITY_SAVINGS_PLAN_RDSP</li><li>DEFINED_CONTRIBUTION_PLAN</li><li>DEFINED_BENEFIT_PLAN</li><li>EMPLOYEE_STOCK_OPTION_PLAN</li><li>NONQUALIFIED_DEFERRED_COMPENSATION_PLAN_409A</li><li>KEOGH_PLAN</li><li>EMPLOYEE_RETIREMENT_ACCOUNT_ROTH_401K</li><li>DEFERRED_CONTINGENT_CAPITAL_PLAN_DCCP</li><li>EMPLOYEE_BENEFIT_PLAN</li><li>EMPLOYEE_SAVINGS_PLAN</li><li>HEALTH_SAVINGS_ACCOUNT_HSA</li><li>COVERDELL_EDUCATION_SAVINGS_ACCOUNT_ESA</li><li>TESTAMENTARY_TRUST</li><li>ESTATE</li><li>GRANTOR_RETAINED_ANNUITY_TRUST_GRAT</li><li>ADVISORY_ACCOUNT</li><li>NON_PROFIT_ORGANIZATION_501C</li><li>HEALTH_REIMBURSEMENT_ARRANGEMENT_HRA</li><li>INDIVIDUAL_SAVINGS_ACCOUNT_ISA</li><li>CASH_ISA</li><li>STOCKS_AND_SHARES_ISA</li><li>INNOVATIVE_FINANCE_ISA</li><li>JUNIOR_ISA</li><li>EMPLOYEES_PROVIDENT_FUND_ORGANIZATION_EPFO</li><li>PUBLIC_PROVIDENT_FUND_PPF</li><li>EMPLOYEES_PENSION_SCHEME_EPS</li><li>NATIONAL_PENSION_SYSTEM_NPS</li><li>INDEXED_ANNUITY</li><li>ANNUITIZED_ANNUITY</li><li>VARIABLE_ANNUITY</li><li>ROTH_403B</li><li>SPOUSAL_IRA</li><li>SPOUSAL_ROTH_IRA</li><li>SARSEP_IRA</li><li>SUBSTANTIALLY_EQUAL_PERIODIC_PAYMENTS_SEPP</li><li>OFFSHORE_TRUST</li><li>IRREVOCABLE_LIFE_INSURANCE_TRUST</li><li>INTERNATIONAL_TRUST</li><li>LIFE_INTEREST_TRUST</li><li>EMPLOYEE_BENEFIT_TRUST</li><li>PRECIOUS_METAL_ACCOUNT</li><li>INVESTMENT_LOAN_ACCOUNT</li><li>GRANTOR_RETAINED_INCOME_TRUST</li><li>PENSION_PLAN</li><li>DIGITAL_WALLET</li><li>OTHER</li></ul><b>loan</b><ul><li>MORTGAGE</li><li>INSTALLMENT_LOAN</li><li>PERSONAL_LOAN</li><li>HOME_EQUITY_LINE_OF_CREDIT</li><li>LINE_OF_CREDIT</li><li>AUTO_LOAN</li><li>STUDENT_LOAN</li><li>HOME_LOAN</li></ul><b>insurance</b><ul><li>AUTO_INSURANCE</li><li>HEALTH_INSURANCE</li><li>HOME_INSURANCE</li><li>LIFE_INSURANCE</li><li>ANNUITY</li><li>TRAVEL_INSURANCE</li><li>INSURANCE</li></ul><b>realEstate</b><ul> <li>REAL_ESTATE</li></ul><b>reward</b><ul><li>REWARD_POINTS</li></ul><b>Manual Account Type</b><br><b>bank</b><ul><li>CHECKING</li><li>SAVINGS</li><li>CD</li><li>PREPAID</li></ul><b>credit</b><ul>  <li>CREDIT</li></ul><b>loan</b><ul>  <li>PERSONAL_LOAN</li><li>HOME_LOAN</li></ul><b>insurance</b><ul><li>INSURANCE</li><li>ANNUITY</li></ul><b>investment</b><ul><li>BROKERAGE_CASH</li></ul><br><br><b>Applicable containers</b>: bank<br><b>Associated Accounts<br><b>Endpoints</b>:<ul><li>GET Associated Accounts/{providerAccountId}</li></ul>
     */
    accountType?: string
    /**
     * The balance in the account that is available at the beginning of the business day; it is equal to the ledger balance of the account.<br><br><b>Applicable containers</b>: bank<br><b>Associated Accounts<br><b>Endpoints</b>:<ul><li>GET Associated Accounts/{providerAccountId}</li></ul>
     */
    currentBalance?: /* Money */ Money
    /**
     * The primary key of the provider account resource.<br><br><b>Associated Accounts<br><b>Applicable containers</b>: All containers<br><b>Endpoints</b>:<ul><li>GET Associated Accounts/{providerAccountId}</li></ul>
     */
    providerAccountId?: number // int64
    /**
     * The type of service. E.g., Bank, Credit Card, Investment, Insurance, etc.<br><br><b>Associated Accounts<br><b>Applicable containers</b>: All containers<br><b>Endpoints</b>:<ul><li>GET Associated Accounts/{providerAccountId}</li></ul>
     */
    CONTAINER?:
      | 'bank'
      | 'creditCard'
      | 'investment'
      | 'insurance'
      | 'loan'
      | 'reward'
      | 'bill'
      | 'realEstate'
      | 'otherAssets'
      | 'otherLiabilities'
    /**
     * The primary key of the account resource and the unique identifier for the account.<br><br><b>Associated Accounts<br><b>Applicable containers</b>: All containers<br><b>Endpoints</b>:<ul><li>GET Associated Accounts/{providerAccountId}</li></ul>
     */
    id?: number // int64
    /**
     * The account number as it appears on the site. (The POST accounts service response return this field as number)<br><b>Additional Details</b>:<b> Bank/ Loan/ Insurance/ Investment</b>:<br> The account number for the bank account as it appears at the site.<br><b>Credit Card</b>: The account number of the card account as it appears at the site,<br>i.e., the card number.The account number can be full or partial based on how it is displayed in the account summary page of the site.In most cases, the site does not display the full account number in the account summary page and additional navigation is required to aggregate it.<br><b>Associated Accounts<br><b>Applicable containers</b>: All containers<br><b>Endpoints</b>:<ul><li>GET Associated Accounts/{providerAccountId}</li></ul>
     */
    accountNumber?: string
    /**
     * Service provider or institution name where the account originates. This belongs to the provider resource.<br><br><b>Associated Accounts<br><b>Applicable containers</b>: All containers<br><b>Endpoints</b>:<ul><li>GET Associated Accounts/{providerAccountId}</li></ul>
     */
    providerName?: string
    /**
     * The balance in the account that is available for spending. For checking accounts with overdraft, available balance may include overdraft amount, if end site adds overdraft balance to available balance.<br><b>Applicable containers</b>: bank, investment<br><b>Associated Accounts<br><b>Endpoints</b>:<ul><li>GET Associated Accounts/{providerAccountId}</li></ul>
     */
    availableBalance?: /* Money */ Money
  }
  /**
   * AssociatedAccountsResponse
   */
  export interface AssociatedAccountsResponse {
    account?: /* AssociatedAccount */ AssociatedAccount[]
  }
  /**
   * Attribute
   */
  export interface Attribute {
    /**
     * Containers for which the attributes are supported.<br><br><b>Endpoints</b>:<ul><li>GET providers</li><li>GET providers/{providerId}</li></ul>
     */
    container?: Array<| 'bank'
      | 'creditCard'
      | 'investment'
      | 'insurance'
      | 'loan'
      | 'reward'
      | 'bill'
      | 'realEstate'
      | 'otherAssets'
      | 'otherLiabilities'>
    /**
     * Applicable only to EBILLS and STATEMENTS attributes of DOCUMENT dataset.<br><br><b>Endpoints</b>:<ul><li>POST providerAccounts</li><li>PUT providerAccounts</li></ul>
     */
    fromDate?: string
    /**
     * Applicable only to TAX attribute of DOCUMENT dataset.<br><br><b>Endpoints</b>:<ul><li>POST providerAccounts</li><li>PUT providerAccounts</li></ul>
     */
    toFinYear?: string
    /**
     * Applicable only to TAX attribute of DOCUMENT dataset.<br><br><b>Endpoints</b>:<ul><li>POST providerAccounts</li><li>PUT providerAccounts</li></ul>
     */
    fromFinYear?: string
    /**
     * Applicable only to TRANSACTIONS attributes of BASIC_AGG_DATA dataset.<br><br><b>Endpoints</b>:<ul><li>GET providers</li><li>GET providers/{providerId}</li><li>POST providerAccounts</li><li>PUT providerAccounts</li></ul>
     */
    containerAttributes?: /* ContainerAttributes */ ContainerAttributes
    /**
     * Applicable only to EBILLS and STATEMENTS attributes of DOCUMENT dataset.<br><br><b>Endpoints</b>:<ul><li>POST providerAccounts</li><li>PUT providerAccounts</li></ul>
     */
    toDate?: string
    /**
     * Attributes that are supported for a dataset.<br><br><b>Endpoints</b>:<ul><li>GET providers</li><li>GET providers/{providerId}</li></ul>
     */
    name?:
      | 'BASIC_ACCOUNT_INFO'
      | 'TRANSACTIONS'
      | 'STATEMENTS'
      | 'HOLDINGS'
      | 'ACCOUNT_DETAILS'
      | 'TAX'
      | 'EBILLS'
      | 'FULL_ACCT_NUMBER'
      | 'BANK_TRANSFER_CODE'
      | 'HOLDER_NAME'
      | 'HOLDER_DETAILS'
      | 'PAYMENT_PROFILE'
      | 'PAYMENT_DETAILS'
      | 'INTEREST_DETAILS'
      | 'COVERAGE'
  }
  /**
   * AutoRefresh
   */
  export interface AutoRefresh {
    /**
     * Indicates the reason for the status.<br><br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul><b>Applicable Values</b><br>
     */
    additionalStatus?:
      | 'SCHEDULED'
      | 'TEMP_ERROR'
      | 'SITE_BLOCKING'
      | 'SITE_NOT_SUPPORTED'
      | 'REAL_TIME_MFA_REQUIRED'
      | 'USER_ACTION_REQUIRED'
      | 'UNSUBSCRIBED'
      | 'MANUAL_ACCOUNT'
    /**
     * Date on which the auto refresh status is determined.<br><br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul>
     */
    asOfDate?: string
    /**
     * Indicates whether auto refresh is enabled or disabled.<br><br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul><b>Applicable Values</b><br>
     */
    status?: 'ENABLED' | 'DISABLED'
  }
  /**
   * BankTransferCode
   */
  export interface BankTransferCode {
    /**
     * The FI's branch identification number.Additional Details: The routing number of the bank account in the United States. For non-United States accounts, it is the IFSC code (India), BSB number (Australia), and sort code (United Kingdom). <br><b>Account Type</b>: Aggregated<br><b>Applicable containers</b>: bank, investment<br><b>Endpoints</b>:<br><ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>POST verification</li></ul>
     */
    id?: string
    /**
     * The bank transfer code type varies depending on the region of the account origination. <br><b>Account Type</b>: Aggregated<br><b>Applicable containers</b>: bank, investment<br><b>Endpoints</b>:<br><ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>POST verification</li></ul><b>Applicable Values</b><br>
     */
    type?: 'BSB' | 'IFSC' | 'ROUTING_NUMBER' | 'SORT_CODE'
  }
  /**
   * Capability
   */
  export interface Capability {
    container?: Array<| 'bank'
      | 'creditCard'
      | 'investment'
      | 'insurance'
      | 'loan'
      | 'reward'
      | 'bill'
      | 'realEstate'
      | 'otherAssets'
      | 'otherLiabilities'>
    name?: string
  }
  /**
   * ClientCredentialToken
   */
  export interface ClientCredentialToken {
    /**
     * Time in seconds after which the issued accessToken expires.<br><br><b>Endpoints</b>:<ul><li>POST /auth/token</li></ul>
     */
    expiresIn?: number // int32
    /**
     * The date and time on which accessToken was created for the customer.<br><br><b>Endpoints</b>:<ul><li>POST /auth/token</li></ul>
     */
    issuedAt?: string
    /**
     * Access Token to access YSL 1.1 services.<br><br><b>Endpoints</b>:<ul><li>POST /auth/token</li></ul>
     */
    accessToken?: string
  }
  /**
   * ClientCredentialTokenResponse
   */
  export interface ClientCredentialTokenResponse {
    token?: /* ClientCredentialToken */ ClientCredentialToken
  }
  /**
   * Cobrand
   */
  export interface Cobrand {
    cobrandLogin: string
    cobrandPassword: string
    /**
     * The customer's locale that will be considered for the localization functionality.<br><br><b>Endpoints</b>:<ul><li>POST cobrand/login</li></ul>
     */
    locale?: string // [a-z]{2}_[A-Z]{2}
  }
  /**
   * CobrandLoginRequest
   */
  export interface CobrandLoginRequest {
    cobrand: /* Cobrand */ Cobrand
  }
  /**
   * CobrandLoginResponse
   */
  export interface CobrandLoginResponse {
    session?: /* CobrandSession */ CobrandSession
    /**
     * Unique identifier of the cobrand (customer) in the system.<br><br><b>Endpoints</b>:<ul><li>POST cobrand/login</li></ul>
     */
    cobrandId?: number // int64
    /**
     * The application identifier.<br><br><b>Endpoints</b>:<ul><li>POST cobrand/login</li></ul>
     */
    applicationId?: string
    /**
     * The customer's locale that will be considered for the localization functionality.<br><br><b>Endpoints</b>:<ul><li>POST cobrand/login</li></ul>
     */
    locale?: string
  }
  /**
   * CobrandNotificationEvent
   */
  export interface CobrandNotificationEvent {
    /**
     * Name of the event for which the customers must subscribe to receive notifications.<br><b>Valid Value:</b> Notification Events Name<br><br><b>Endpoints</b>:<ul><li>GET cobrand/config/notifications/events</li></ul><b>Applicable Values</b><br>
     */
    name?: 'REFRESH' | 'DATA_UPDATES' | 'AUTO_REFRESH_UPDATES'
    /**
     * URL to which the notification should be posted.<br><br><b>Endpoints</b>:<ul><li>GET cobrand/config/notifications/events</li></ul>
     */
    callbackUrl?: string
  }
  /**
   * CobrandNotificationResponse
   */
  export interface CobrandNotificationResponse {
    event?: /* CobrandNotificationEvent */ CobrandNotificationEvent[]
  }
  /**
   * CobrandPublicKeyResponse
   */
  export interface CobrandPublicKeyResponse {
    /**
     * The key name used for encryption.<br><br><b>Endpoints</b>:<ul><li>GET cobrand/publicKey</li></ul>
     */
    keyAlias?: string
    /**
     * Public key that the customer should be using to encrypt the credentials and answers before sending to the add & update providerAccounts APIs.<br><br><b>Endpoints</b>:<ul><li>GET cobrand/publicKey</li></ul>
     */
    keyAsPemString?: string
  }
  /**
   * CobrandSession
   */
  export interface CobrandSession {
    cobSession?: string
  }
  /**
   * ConfigsNotificationEvent
   */
  export interface ConfigsNotificationEvent {
    /**
     * Name of the event for which the customers must subscribe to receive notifications.<br><b>Valid Value:</b> Notification Events Name<br><br><b>Endpoints</b>:<ul><li>GET configs/notifications/events</li></ul><b>Applicable Values</b><br>
     */
    name?:
      | 'REFRESH'
      | 'DATA_UPDATES'
      | 'AUTO_REFRESH_UPDATES'
      | 'LATEST_BALANCE_UPDATES'
    /**
     * URL to which the notification should be posted.<br><br><b>Endpoints</b>:<ul><li>GET configs/notifications/events</li></ul>
     */
    callbackUrl?: string
  }
  /**
   * ConfigsNotificationResponse
   */
  export interface ConfigsNotificationResponse {
    event?: /* ConfigsNotificationEvent */ ConfigsNotificationEvent[]
  }
  /**
   * ConfigsPublicKey
   */
  export interface ConfigsPublicKey {
    /**
     * The key name used for encryption.<br><br><b>Endpoints</b>:<ul><li>GET configs/publicKey</li></ul>
     */
    alias?: string
    /**
     * Public key that the customer should be using to encrypt the credentials and answers before sending to the add and update providerAccounts APIs.<br><br><b>Endpoints</b>:<ul><li>GET configs/publicKey</li></ul>
     */
    key?: string
  }
  /**
   * ConfigsPublicKeyResponse
   */
  export interface ConfigsPublicKeyResponse {
    publicKey?: /* ConfigsPublicKey */ ConfigsPublicKey
  }
  /**
   * Consent
   */
  export interface Consent {
    /**
     * Data Access Frequency explains the number of times that this consent can be used.<br> Otherwise called as consent frequency type.
     */
    dataAccessFrequency?: 'ONE_TIME' | 'RECURRING'
    /**
     * Description for the title.
     */
    titleBody: string
    /**
     * Consent Id generated through POST Consent.
     */
    consentId: number // int64
    /**
     * Renewal describes the sharing duration and reauthorization required.
     */
    renewal?: /* Renewal */ Renewal
    /**
     * Provider Id for which the consent needs to be generated.
     */
    providerId: number // int64
    /**
     * Status of the consent.
     */
    consentStatus:
      | 'ACTIVE'
      | 'CONSENT_GENERATED'
      | 'CONSENT_ACCEPTED'
      | 'CONSENT_AUTHORIZED'
      | 'CONSENT_MISMATCH'
      | 'PENDING'
      | 'EXPIRED'
      | 'REVOKED'
    /**
     * Unique identifier for the provider account resource. <br>This is created during account addition.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts</li></ul>
     */
    providerAccountId?: number // int64
    /**
     * Scope describes about the consent permissions and their purpose.
     */
    scope: /* Scope */ Scope[]
    /**
     * Title for the consent form.
     */
    title: string
    /**
     * Application display name.
     */
    applicationDisplayName: string
    /**
     * Consent start date.
     */
    startDate: string
    /**
     * Consent expiry date.
     */
    expirationDate: string
  }
  /**
   * ConsentResponse
   */
  export interface ConsentResponse {
    consent?: /* Consent */ Consent[]
  }
  /**
   * Contact
   */
  export interface Contact {
    /**
     * Phone number of the merchant<br><br><b>Applicable containers</b>: bank,creditCard,investment,loan<br>
     */
    phone?: string
    /**
     * Email Id of the merchant<br><br><b>Applicable containers</b>: bank,creditCard,investment,loan<br>
     */
    email?: string
  }
  /**
   * ContainerAttributes
   */
  export interface ContainerAttributes {
    BANK?: /* TransactionDays */ TransactionDays
    LOAN?: /* TransactionDays */ TransactionDays
    CREDITCARD?: /* TransactionDays */ TransactionDays
    INVESTMENT?: /* TransactionDays */ TransactionDays
    INSURANCE?: /* TransactionDays */ TransactionDays
  }
  /**
   * Coordinates
   */
  export interface Coordinates {
    /**
     * Latitude of the merchant<br><br><b>Applicable containers</b>: bank,creditCard,loan<br>
     */
    latitude?: number // double
    /**
     * Longitude of the merchant<br><br><b>Applicable containers</b>: bank,creditCard,loan<br>
     */
    longitude?: number // double
  }
  /**
   * Coverage
   */
  export interface Coverage {
    /**
     * The coverage amount-related details.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: insurance,investment<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul>
     */
    amount?: /* CoverageAmount */ CoverageAmount[]
    /**
     * The plan type for an insurance provided to an individual or an entity.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: insurance<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul><b>Applicable Values:</b><br>
     */
    planType?: 'PPO' | 'HMO' | 'UNKNOWN'
    /**
     * The date on which the coverage for the account ends or expires.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: insurance,investment<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul>
     */
    endDate?: string
    /**
     * The type of coverage provided to an individual or an entity.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: insurance,investment<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul><b>Applicable Values:</b><br>
     */
    type?:
      | 'VISION'
      | 'DENTAL'
      | 'MEDICAL'
      | 'HEALTH'
      | 'DEATH_COVER'
      | 'TOTAL_PERMANENT_DISABILITY'
      | 'ACCIDENTAL_DEATH_COVER'
      | 'INCOME_PROTECTION'
      | 'DEATH_TOTAL_PERMANENT_DISABILITY'
      | 'OTHER'
    /**
     * The date on which the coverage for the account starts.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: insurance,investment<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul>
     */
    startDate?: string
  }
  /**
   * CoverageAmount
   */
  export interface CoverageAmount {
    /**
     * The maximum amount that will be paid to an individual or an entity for a covered loss<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: insurance,investment<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul>
     */
    cover?: /* Money */ Money
    /**
     * The type of coverage unit indicates if the coverage is for an individual or a family.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: insurance,investment<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul><b>Applicable Values:</b><br>
     */
    unitType?: 'PER_FAMILY' | 'PER_MEMBER'
    /**
     * The type of coverage provided to an individual or an entity.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: insurance,investment<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul><b>Applicable Values:</b><br>
     */
    type?:
      | 'DEDUCTIBLE'
      | 'OUT_OF_POCKET'
      | 'ANNUAL_BENEFIT'
      | 'MAX_BENEFIT'
      | 'COVERAGE_AMOUNT'
      | 'MONTHLY_BENEFIT'
      | 'OTHER'
    /**
     * The type of coverage limit indicates if the coverage is in-network or out-of-network.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: insurance,investment<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul><b>Applicable Values:</b><br>
     */
    limitType?: 'IN_NETWORK' | 'OUT_NETWORK'
    /**
     * The amount the insurance company paid for the incurred medical expenses.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: insurance,investment<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul>
     */
    met?: /* Money */ Money
  }
  /**
   * CreateAccountInfo
   */
  export interface CreateAccountInfo {
    includeInNetWorth?: string
    address?: /* AccountAddress */ AccountAddress
    accountName: string
    accountType: string
    dueDate?: string
    memo?: string
    homeValue?: /* Money */ Money
    accountNumber?: string // ^[a-zA-Z0-9]+$
    frequency?:
      | 'DAILY'
      | 'ONE_TIME'
      | 'WEEKLY'
      | 'EVERY_2_WEEKS'
      | 'SEMI_MONTHLY'
      | 'MONTHLY'
      | 'QUARTERLY'
      | 'SEMI_ANNUALLY'
      | 'ANNUALLY'
      | 'EVERY_2_MONTHS'
      | 'EBILL'
      | 'FIRST_DAY_MONTHLY'
      | 'LAST_DAY_MONTHLY'
      | 'EVERY_4_WEEKS'
      | 'UNKNOWN'
      | 'OTHER'
    amountDue?: /* Money */ Money
    balance?: /* Money */ Money
    nickname?: string
    valuationType?: 'SYSTEM' | 'MANUAL'
  }
  /**
   * CreateAccountRequest
   */
  export interface CreateAccountRequest {
    account: /* CreateAccountInfo */ CreateAccountInfo
  }
  /**
   * CreateCobrandNotificationEvent
   */
  export interface CreateCobrandNotificationEvent {
    /**
     * URL to which the notification should be posted.<br><br><b>Endpoints</b>:<ul><li>GET cobrand/config/notifications/events</li></ul>
     */
    callbackUrl?: string
  }
  /**
   * CreateCobrandNotificationEventRequest
   */
  export interface CreateCobrandNotificationEventRequest {
    event: /* CreateCobrandNotificationEvent */ CreateCobrandNotificationEvent
  }
  /**
   * CreateConfigsNotificationEvent
   */
  export interface CreateConfigsNotificationEvent {
    /**
     * URL to which the notification should be posted.<br><br><b>Endpoints</b>:<ul><li>GET configs/notifications/events</li></ul>
     */
    callbackUrl?: string
  }
  /**
   * CreateConfigsNotificationEventRequest
   */
  export interface CreateConfigsNotificationEventRequest {
    event: /* CreateConfigsNotificationEvent */ CreateConfigsNotificationEvent
  }
  /**
   * CreateConsent
   */
  export interface CreateConsent {
    /**
     * Data Access Frequency explains the number of times that this consent can be used.<br> Otherwise called as consent frequency type.
     */
    dataAccessFrequency?: 'ONE_TIME' | 'RECURRING'
    /**
     * Description for the title.
     */
    titleBody: string
    /**
     * Consent Id generated through POST Consent.
     */
    consentId: number // int64
    /**
     * Renewal describes the sharing duration and reauthorization required.
     */
    renewal?: /* Renewal */ Renewal
    /**
     * Provider Id for which the consent needs to be generated.
     */
    providerId: number // int64
    /**
     * Status of the consent.
     */
    consentStatus:
      | 'ACTIVE'
      | 'CONSENT_GENERATED'
      | 'CONSENT_ACCEPTED'
      | 'CONSENT_AUTHORIZED'
      | 'CONSENT_MISMATCH'
      | 'PENDING'
      | 'EXPIRED'
      | 'REVOKED'
    /**
     * Scope describes about the consent permissions and their purpose.
     */
    scope: /* Scope */ Scope[]
    /**
     * Title for the consent form.
     */
    title: string
    /**
     * Application display name.
     */
    applicationDisplayName: string
    /**
     * Consent start date.
     */
    startDate: string
    /**
     * Consent expiry date.
     */
    expirationDate: string
  }
  /**
   * CreateConsentRequest
   */
  export interface CreateConsentRequest {
    /**
     * Unique identifier for the provider site.(e.g., financial institution sites, biller sites, lender sites, etc.).<br><br><b>Endpoints</b>:<ul><li>POST Consent</li></ul>
     */
    providerId?: number // int64
    /**
     * The name of the dataset attribute supported by the provider.If no dataset value is provided, the datasets that are configured for the customer will be considered.The configured dataset can be overridden by providing the dataset as an input.<br><br><b>Endpoints</b>:<ul><li>POST Consent</li></ul>
     */
    dataset?: /* ProvidersDataset */ ProvidersDataset[]
    /**
     * The name of the application.If no applicationName is provided in the input, the default applicationName will be considered<br><br><b>Endpoints</b>:<ul><li>POST Consent</li></ul>
     */
    applicationName?: string
  }
  /**
   * CreatedAccountInfo
   */
  export interface CreatedAccountInfo {
    accountName?: string
    id?: number // int64
    accountNumber?: string
  }
  /**
   * CreatedAccountResponse
   */
  export interface CreatedAccountResponse {
    account?: /* CreatedAccountInfo */ CreatedAccountInfo[]
  }
  /**
   * CreatedConsentResponse
   */
  export interface CreatedConsentResponse {
    consent?: /* CreateConsent */ CreateConsent[]
  }
  /**
   * DataExtractsAccount
   */
  export interface DataExtractsAccount {
    /**
     * The amount that is available for an ATM withdrawal, i.e., the cash available after deducting the amount that is already withdrawn from the total cash limit. (totalCashLimit-cashAdvance= availableCash)<br><b>Additional Details:</b> The available cash amount at the account-level can differ from the available cash at the statement-level, as the information in the aggregated card account data provides more up-to-date information.<br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: creditCard<br><b>Endpoints</b>:<br><ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    availableCash?: /* Money */ Money
    /**
     * Used to determine  whether an account to be considered in the networth calculation.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: bank,creditCard,loan,investment,insurance,realEstate,otherAssets,otherLiabilities<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    includeInNetWorth?: boolean
    /**
     * The amount in the money market fund or its equivalent such as bank deposit programs.<br><b>Note:</b> The money market balance field is only applicable to brokerage related accounts.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: investment<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    moneyMarketBalance?: /* Money */ Money
    /**
     * Date on which the user is enrolled on the rewards program.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: reward<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    enrollmentDate?: string
    /**
     * The date on which the home value was estimated.<br><br><b>Aggregated / Manual</b>: Manual<br><b>Applicable containers</b>: realEstate<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    estimatedDate?: string
    /**
     * The additional description or notes given by the user.<br><br><b>Aggregated / Manual</b>: Both <br><b>Applicable containers</b>: All containers<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    memo?: string
    /**
     * A nonprofit or state organization that works with lender, servicer, school, and the Department of Education to help successfully repay Federal Family Education Loan Program (FFELP) loans. If FFELP student loans default, the guarantor takes ownership of them.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: loan<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    guarantor?: string
    /**
     * Interest paid in last calendar year.<br><b>Applicable containers</b>: loan<br><b>Aggregated / Manual</b>: Aggregated<br><b>Endpoints</b>:<br><ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    interestPaidLastYear?: /* Money */ Money
    /**
     * The date time the account information was last retrieved from the provider site and updated in the Yodlee system.<br><br><b>Aggregated / Manual</b>: Both <br><b>Applicable containers</b>: All containers<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    lastUpdated?: string
    /**
     * The total account value. <br><b>Additional Details:</b><br><b>Bank:</b> available balance or current balance.<br><b>Credit Card:</b> running Balance.<br><b>Investment:</b> The total balance of all the investment account, as it appears on the FI site.<br><b>Insurance:</b> CashValue or amountDue<br><b>Loan:</b> principalBalance<br><b>Applicable containers</b>: bank, creditCard, investment, insurance, loan, otherAssets, otherLiabilities, realEstate<br><b>Aggregated / Manual</b>: Both <br><b>Endpoints</b>:<br><ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    balance?: /* Money */ Money
    /**
     * Type of home insurance, like -<ul><li>HOME_OWNER</li><li>RENTAL</li><li>RENTER</li><li>etc..</li></ul><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: insurance<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul><b>Applicable Values</b><br>
     */
    homeInsuranceType?: 'HOME_OWNER' | 'RENTAL' | 'RENTER' | 'UNKNOWN' | 'OTHER'
    /**
     * The primary key of the account resource and the unique identifier for the account.<br><br><b>Aggregated / Manual</b>: Both <br><b>Applicable containers</b>: All containers<br><b>Endpoints</b>:<ul><li>GET accounts </li><li>GET accounts/{accountId}</li><li>GET investmentOptions</li><li>GET accounts/historicalBalances</li><li>POST accounts</li><li>GET dataExtracts/userData</li></ul>
     */
    id?: number // int64
    /**
     * The amount that is available for immediate withdrawal or the total amount available to purchase securities in a brokerage or investment account.<br><b>Note:</b> The cash balance field is only applicable to brokerage related accounts.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: investment<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    cash?: /* Money */ Money
    /**
     * Total credit line is the amount of money that can be charged to a credit card. If credit limit of $5,000 is issued on a credit card, the total charges on the card cannot exceed this amount.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: creditCard<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    totalCreditLine?: /* Money */ Money
    /**
     * Service provider or institution name where the account originates. This belongs to the provider resource.<br><br><b>Aggregated / Manual</b>: Both <br><b>Applicable containers</b>: All containers<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    providerName?: string
    /**
     * The valuation type indicates whether the home value is calculated either manually or by Yodlee Partners.<br><br><b>Aggregated / Manual</b>: Manual<br><b>Applicable containers</b>: realEstate<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul><b>Applicable Values</b><br>
     */
    valuationType?: 'SYSTEM' | 'MANUAL'
    /**
     * The amount of borrowed funds used to purchase securities.<br><b>Note</b>: Margin balance is displayed only if the brokerage account is approved for margin. The margin balance field is only applicable to brokerage related accounts.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: investment<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    marginBalance?: /* Money */ Money
    /**
     * The annual percentage rate (APR) is the yearly rate of interest on the credit card account.<br><b>Additional Details:</b> The yearly percentage rate charged when a balance is held on a credit card. This rate of interest is applied every month on the outstanding credit card balance.<br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: creditCard<br><b>Endpoints</b>:<br><ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    apr?: number // double
    /**
     * <br><b>Credit Card:</b> Amount that is available to spend on the credit card. It is usually the Total credit line- Running balance- pending charges. <br><b>Loan:</b> The unused portion of  line of credit, on a revolving loan (such as a home-equity line of credit).<br><b>Additional Details:</b><br><b>Note:</b> The available credit amount at the account-level can differ from the available credit field at the statement-level, as the information in the aggregated card account data provides more up-to-date information.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: creditCard, loan<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    availableCredit?: /* Money */ Money
    /**
     * The balance in the account that is available at the beginning of the business day; it is equal to the ledger balance of the account.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: bank<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    currentBalance?: /* Money */ Money
    /**
     * Indicates if an account is aggregated from a site or it is a manual account i.e. account information manually provided by the user.<br><b>Aggregated / Manual</b>: Both <br><b>Applicable containers</b>: All containers<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    isManual?: boolean
    /**
     * The amount a mortgage company holds to pay a consumer's non-mortgage related expenses like insurance and property taxes. <br><b>Additional Details:</b><br><b>Note:</b> The escrow balance field is only applicable to the mortgage account type.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: loan<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    escrowBalance?: /* Money */ Money
    /**
     * The eligible next level of the rewards program.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: reward<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    nextLevel?: string
    /**
     * The classification of the account such as personal, corporate, etc.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: bank, creditCard, investment, reward, loan, insurance<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul><b>Applicable Values</b><br>
     */
    classification?:
      | 'OTHER'
      | 'PERSONAL'
      | 'CORPORATE'
      | 'SMALL_BUSINESS'
      | 'TRUST'
      | 'ADD_ON_CARD'
      | 'VIRTUAL_CARD'
    /**
     * The amount to be paid to close the loan account, i.e., the total amount required to meet a borrower's obligation on a loan.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: loan<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    loanPayoffAmount?: /* Money */ Money
    /**
     * The type of the interest rate, for example, fixed or variable.<br><b>Applicable containers</b>: loan<br><b>Aggregated / Manual</b>: Aggregated<br><b>Endpoints</b>:<br><ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul><b>Applicable Values</b><br>
     */
    interestRateType?: 'FIXED' | 'VARIABLE' | 'UNKNOWN' | 'OTHER'
    /**
     * The date by which the payoff amount should be paid.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: loan<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    loanPayByDate?: string
    /**
     * The amount stated on the face of a consumer's policy that will be paid in the event of his or her death or any other event as stated in the insurance policy. The face amount is also referred to as the sum insured or maturity value in India.<br><b>Note:</b> The face amount field is applicable only to life insurance.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: insurance<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    faceAmount?: /* Money */ Money
    /**
     * The date the insurance policy began.<br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: insurance<br><b>Endpoints</b>:<br><ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    policyFromDate?: string
    /**
     * The number of years for which premium payments have to be made in a policy.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: insurance<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    premiumPaymentTerm?: string
    /**
     * The duration for which the policy is valid or in effect. For example, one year, five years, etc.<br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: insurance<br><b>Endpoints</b>:<br><ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    policyTerm?: string
    /**
     * The type of repayment plan that the borrower prefers to repay the loan. <br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: loan<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul><b>Applicable Values:</b><br>
     */
    repaymentPlanType?:
      | 'STANDARD'
      | 'GRADUATED'
      | 'EXTENDED'
      | 'INCOME_BASED'
      | 'INCOME_CONTINGENT'
      | 'INCOME_SENSITIVE'
      | 'PAY_AS_YOU_EARN'
      | 'REVISED_PAY_AS_YOU_EARN'
    /**
     * The type of account that is aggregated.
     */
    aggregatedAccountType?: string
    /**
     * The balance in the account that is available for spending. For checking accounts with overdraft, available balance may include overdraft amount, if end site adds overdraft balance to available balance.<br><b>Applicable containers</b>: bank, investment<br><b>Aggregated / Manual</b>: Aggregated<br><b>Endpoints</b>:<br><ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    availableBalance?: /* Money */ Money
    /**
     * The status of the account that is updated by the consumer through an application or an API. Valid Values: AccountStatus<br><b>Additional Details:</b><br><b>ACTIVE:</b> All the added manual and aggregated accounts status will be made "ACTIVE" by default. <br><b>TO_BE_CLOSED:</b> If the aggregated accounts are not found or closed in the data provider site, Yodlee system marks the status as TO_BE_CLOSED<br><b>INACTIVE:</b> Users can update the status as INACTIVE to stop updating and to stop considering the account in other services<br><b>CLOSED:</b> Users can update the status as CLOSED, if the account is closed with the provider. <br><br><b>Aggregated / Manual</b>: Both <br><b>Applicable containers</b>: All containers<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul><b>Applicable Values</b><br>
     */
    accountStatus?:
      | 'ACTIVE'
      | 'INACTIVE'
      | 'TO_BE_CLOSED'
      | 'CLOSED'
      | 'DELETED'
    /**
     * Type of life insurance.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: insurance<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul><b>Applicable Values</b><br>
     */
    lifeInsuranceType?:
      | 'OTHER'
      | 'TERM_LIFE_INSURANCE'
      | 'UNIVERSAL_LIFE_INSURANCE'
      | 'WHOLE_LIFE_INSURANCE'
      | 'VARIABLE_LIFE_INSURANCE'
      | 'ULIP'
      | 'ENDOWMENT'
    /**
     * The financial cost that the policyholder pays to the insurance company to obtain an insurance cover.The premium is paid as a lump sum or in installments during the duration of the policy.<br><b>Applicable containers</b>: insurance<br><b>Aggregated / Manual</b>: Aggregated<br><b>Endpoints</b>:<br><ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    premium?: /* Money */ Money
    /**
     * The source through which the account(s) are added in the system.<br><b>Valid Values</b>: SYSTEM, USER<br><b>Applicable containers</b>: All Containers<br><b>Aggregated / Manual</b>: Both <br><b>Endpoints</b>:<br><ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul><b>Applicable Values</b><br>
     */
    aggregationSource?: 'SYSTEM' | 'USER'
    /**
     * Indicates if the account is marked as deleted.<b>Applicable containers</b>: All Containers<br><b>Aggregated / Manual</b>: Both <br><b>Endpoints</b>:<br><ul><li>GET dataExtracts/userData</li></ul>
     */
    isDeleted?: boolean
    /**
     * The overdraft limit for the account.<br><b>Note:</b> The overdraft limit is provided only for AUS, INDIA, UK, NZ locales.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: bank<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    overDraftLimit?: /* Money */ Money
    /**
     * The nickname of the account as provided by the consumer to identify an account. The account nickname can be used instead of the account name.<br><br><b>Aggregated / Manual</b>: Both <br><b>Applicable containers</b>: All containers<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    nickname?: string
    /**
     * The tenure for which the CD account is valid  or in case of loan, the number of years/months over which the loan amount  has to be repaid. <br><b>Additional Details:</b><br>  Bank: The Term field is only applicable for the account type CD.Loan: The period for which the loan agreement is in force. The period, before or at the end of which, the loan should either be repaid or renegotiated for another term.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: bank, loan<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    term?: string
    /**
     * <br><b>Bank:</b> The interest rate offered by a FI to its depositors on a bank account.<br><b>Loan:</b> Interest rate applied on the loan.<br><b>Additional Details:</b><br><b>Note:</b> The Interest Rate field is only applicable for the following account types: savings, checking, money market, and certificate of deposit.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: bank, loan<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    interestRate?: number // double
    /**
     * The death benefit amount on a life insurance policy and annuity. It is usually equal to the face amount of the policy, but sometimes can vary for a whole life and universal life insurance policies.<br><b>Note:</b> The death benefit amount field is applicable only to annuities and life insurance.<br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: insurance<br><b>Endpoints</b>:<br><ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    deathBenefit?: /* Money */ Money
    /**
     * The home address of the real estate account. The address entity for home address consists of state, zip and city only<br><br><b>Aggregated / Manual</b>: Manual<br><b>Applicable containers</b>: realEstate<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    address?: /* AccountAddress */ AccountAddress
    /**
     * The amount of cash value available in the consumer's life insurance policy account - except for term insurance policy - for withdrawals, loans, etc. This field is also used to capture the cash value on the home insurance policy.It is the standard that the insurance company generally prefer to reimburse the policyholder for his or her loss, i.e., the cash value is equal to the replacement cost minus depreciation. The cash value is also referred to as surrender value in India for life insurance policies.<br><b>Note:</b> The cash value field is applicable to all types of life insurance (except for term life) and home insurance.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: insurance<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    cashValue?: /* Money */ Money
    /**
     * The amount borrowed from the 401k account.<br><b>Note</b>: The 401k loan field is only applicable to the 401k account type.<br><b>Applicable containers</b>: investment<br><b>Aggregated / Manual</b>: Aggregated<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    $401kLoan?: /* Money */ Money
    /**
     * The home value of the real estate account.<br><br><b>Aggregated / Manual</b>: Manual<br><b>Applicable containers</b>: realEstate<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    homeValue?: /* Money */ Money
    /**
     * The account number as it appears on the site. (The POST accounts service response return this field as number)<br><b>Additional Details</b>:<b> Bank/ Loan/ Insurance/ Investment</b>:<br> The account number for the bank account as it appears at the site.<br><b>Credit Card</b>: The account number of the card account as it appears at the site,<br>i.e., the card number.The account number can be full or partial based on how it is displayed in the account summary page of the site.In most cases, the site does not display the full account number in the account summary page and additional navigation is required to aggregate it.<br><b>Applicable containers</b>: All Containers<br><b>Aggregated / Manual</b>: Both <br><b>Endpoints</b>:<br><ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>POST accounts</li><li>GET dataExtracts/userData</li></ul>
     */
    accountNumber?: string
    /**
     * The date on which the account is created in the Yodlee system.<br><b>Additional Details:</b> It is the date when the user links or aggregates the account(s) that are held with the provider to the Yodlee system.<br><br><b>Aggregated / Manual</b>: Both <br><b>Applicable containers</b>: All containers<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    createdDate?: string
    /**
     * Interest paid from the start of the year to date.<br><b>Applicable containers</b>: loan<br><b>Aggregated / Manual</b>: Aggregated<br><b>Endpoints</b>:<br><ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    interestPaidYTD?: /* Money */ Money
    /**
     * The primary key of the provider account resource.<br><br><b>Aggregated / Manual</b>: Both <br><b>Applicable containers</b>: All containers<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    providerAccountId?: number // int64
    /**
     * Indicates if the account is selected by user for aggregation.<br><b>Applicable containers</b>: All Containers<br><b>Aggregated / Manual</b>: Both <br><b>Endpoints</b>:<br><ul><li>GET dataExtracts/userData</li></ul>
     */
    isSelectedForAggregation?: boolean
    /**
     * Property or possession offered to support a loan that can be seized on a default.<br><b>Applicable containers</b>: loan<br><b>Aggregated / Manual</b>: Aggregated<br><b>Endpoints</b>:<br><ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    collateral?: string
    /**
     * Logical grouping of dataset attributes into datasets such as Basic Aggregation Data, Account Profile and Documents.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: All containers<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    dataset?: /* AccountDataset */ AccountDataset[]
    /**
     * The amount that is currently owed on the credit card account.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: creditCard<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    runningBalance?: /* Money */ Money
    /**
     * A unique ID that the provider site has assigned to the account. The source ID is only available for the HELD accounts.<br><br><b>Applicable containers</b>: bank, creditCard, investment, insurance, loan, reward<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    sourceId?: string
    /**
     * The date on which the due amount has to be paid. <br><b>Additional Details:</b><br><b>Credit Card:</b> The monthly date by when the minimum payment is due to be paid on the credit card account. <br><b>Loan:</b> The date on or before which the due amount should be paid.<br><b>Note:</b> The due date at the account-level can differ from the due date field at the statement-level, as the information in the aggregated card account data provides an up-to-date information to the consumer.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: creditCard, loan, insurance<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    dueDate?: string
    /**
     * The frequency of the billing cycle of the account in case of card. The frequency in which premiums are paid in an insurance policy such as monthly, quarterly, and annually. The frequency in which due amounts are paid in a loan  account.<br><br><b>Aggregated / Manual</b>: Both <br><b>Applicable containers</b>: creditCard, insurance, loan<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul><b>Applicable Values</b><br>
     */
    frequency?:
      | 'DAILY'
      | 'ONE_TIME'
      | 'WEEKLY'
      | 'EVERY_2_WEEKS'
      | 'SEMI_MONTHLY'
      | 'MONTHLY'
      | 'QUARTERLY'
      | 'SEMI_ANNUALLY'
      | 'ANNUALLY'
      | 'EVERY_2_MONTHS'
      | 'EBILL'
      | 'FIRST_DAY_MONTHLY'
      | 'LAST_DAY_MONTHLY'
      | 'EVERY_4_WEEKS'
      | 'UNKNOWN'
      | 'OTHER'
    /**
     * The maturity amount on the CD is the amount(principal and interest) paid on or after the maturity date.<br><b>Additional Details:</b> The Maturity Amount field is only applicable for the account type CD(Fixed Deposits).<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: bank<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    maturityAmount?: /* Money */ Money
    /**
     * The providerAccountIds that share the account with the primary providerAccountId that was created when the user had added the account for the first time.<br><b>Additional Details</b>: This attribute is returned in the response only if the account deduplication feature is enabled and the same account is mapped to more than one provider account IDs indicating the account is owned by more than one user, for example, joint accounts.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: All Containers<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    associatedProviderAccountId?: number /* int64 */[]
    /**
     * The account to be considered as an asset or liability.<br><b>Applicable containers</b>: All Containers<br><b>Aggregated / Manual</b>: Both <br><b>Endpoints</b>:<br><ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    isAsset?: boolean
    /**
     * The principal or loan balance is the outstanding balance on a loan account, excluding the interest and fees. The principal balance is the original borrowed amount plus any applicable loan fees, minus any principal payments.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: loan<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    principalBalance?: /* Money */ Money
    /**
     * The maximum amount that can be withdrawn from an ATM using the credit card. Credit cards issuer allow cardholders to withdraw cash using their cards - the cash limit is a percent of the overall credit limit.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: creditCard<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    totalCashLimit?: /* Money */ Money
    /**
     * The date when a certificate of deposit (CD/FD) matures or the final payment date of a loan at which point the principal amount (including pending interest) is due to be paid.<br><b>Additional Details:</b> The date when a certificate of deposit (CD) matures, i.e., the money in the CD can be withdrawn without paying an early withdrawal penalty.The final payment date of a loan, i.e., the principal amount (including pending interest) is due to be paid.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: bank, loan<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    maturityDate?: string
    /**
     * The minimum amount due is the lowest amount of money that a consumer is required to pay each month.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: creditCard, insurance, loan<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    minimumAmountDue?: /* Money */ Money
    /**
     * Annual percentage yield (APY) is a normalized representation of an interest rate, based on a compounding period of one year. APY generally refers to the rate paid to a depositor by a financial institution on an account.<br><b>Applicable containers</b>: bank<br><b>Aggregated / Manual</b>: Aggregated<br><b>Endpoints</b>:<br><ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    annualPercentageYield?: number // double
    /**
     * The type of account that is aggregated, i.e., savings, checking, credit card, charge, HELOC, etc. The account type is derived based on the attributes of the account. <br><b>Valid Values:</b><br><b>Aggregated Account Type</b><br><b>bank</b><ul><li>CHECKING</li><li>SAVINGS</li><li>CD</li><li>PPF</li><li>RECURRING_DEPOSIT</li><li>FSA</li><li>MONEY_MARKET</li><li>IRA</li><li>PREPAID</li></ul><b>creditCard</b><ul><li>OTHER</li><li>CREDIT</li><li>STORE</li><li>CHARGE</li><li>OTHER</li></ul><b>investment (SN 1.0)</b><ul><li>BROKERAGE_MARGIN</li><li>HSA</li><li>IRA</li><li>BROKERAGE_CASH</li><li>401K</li><li>403B</li><li>TRUST</li><li>ANNUITY</li><li>SIMPLE</li><li>CUSTODIAL</li><li>BROKERAGE_CASH_OPTION</li><li>BROKERAGE_MARGIN_OPTION</li><li>INDIVIDUAL</li><li>CORPORATE</li><li>JTTIC</li><li>JTWROS</li><li>COMMUNITY_PROPERTY</li><li>JOINT_BY_ENTIRETY</li><li>CONSERVATORSHIP</li><li>ROTH</li><li>ROTH_CONVERSION</li><li>ROLLOVER</li><li>EDUCATIONAL</li><li>529_PLAN</li><li>457_DEFERRED_COMPENSATION</li><li>401A</li><li>PSP</li><li>MPP</li><li>STOCK_BASKET</li><li>LIVING_TRUST</li><li>REVOCABLE_TRUST</li><li>IRREVOCABLE_TRUST</li><li>CHARITABLE_REMAINDER</li><li>CHARITABLE_LEAD</li><li>CHARITABLE_GIFT_ACCOUNT</li><li>SEP</li><li>UTMA</li><li>UGMA</li><li>ESOPP</li><li>ADMINISTRATOR</li><li>EXECUTOR</li><li>PARTNERSHIP</li><li>SOLE_PROPRIETORSHIP</li><li>CHURCH</li><li>INVESTMENT_CLUB</li><li>RESTRICTED_STOCK_AWARD</li><li>CMA</li><li>EMPLOYEE_STOCK_PURCHASE_PLAN</li><li>PERFORMANCE_PLAN</li><li>BROKERAGE_LINK_ACCOUNT</li><li>MONEY_MARKET</li><li>SUPER_ANNUATION</li><li>REGISTERED_RETIREMENT_SAVINGS_PLAN</li><li>SPOUSAL_RETIREMENT_SAVINGS_PLAN</li><li>DEFERRED_PROFIT_SHARING_PLAN</li><li>NON_REGISTERED_SAVINGS_PLAN</li><li>REGISTERED_EDUCATION_SAVINGS_PLAN</li><li>GROUP_RETIREMENT_SAVINGS_PLAN</li><li>LOCKED_IN_RETIREMENT_SAVINGS_PLAN</li><li>RESTRICTED_LOCKED_IN_SAVINGS_PLAN</li><li>LOCKED_IN_RETIREMENT_ACCOUNT</li><li>REGISTERED_PENSION_PLAN</li><li>TAX_FREE_SAVINGS_ACCOUNT</li><li>LIFE_INCOME_FUND</li><li>REGISTERED_RETIREMENT_INCOME_FUND</li><li>SPOUSAL_RETIREMENT_INCOME_FUND</li><li>LOCKED_IN_REGISTERED_INVESTMENT_FUND</li><li>PRESCRIBED_REGISTERED_RETIREMENT_INCOME_FUND</li><li>GUARANTEED_INVESTMENT_CERTIFICATES</li><li>REGISTERED_DISABILITY_SAVINGS_PLAN</li><li>DIGITAL_WALLET</li><li>OTHER</li></ul><b>investment (SN 2.0)</b><ul><li>BROKERAGE_CASH</li><li>BROKERAGE_MARGIN</li><li>INDIVIDUAL_RETIREMENT_ACCOUNT_IRA</li><li>EMPLOYEE_RETIREMENT_ACCOUNT_401K</li><li>EMPLOYEE_RETIREMENT_SAVINGS_PLAN_403B</li><li>TRUST</li><li>ANNUITY</li><li>SIMPLE_IRA</li><li>CUSTODIAL_ACCOUNT</li><li>BROKERAGE_CASH_OPTION</li><li>BROKERAGE_MARGIN_OPTION</li><li>INDIVIDUAL</li><li>CORPORATE_INVESTMENT_ACCOUNT</li><li>JOINT_TENANTS_TENANCY_IN_COMMON_JTIC</li><li>JOINT_TENANTS_WITH_RIGHTS_OF_SURVIVORSHIP_JTWROS</li><li>JOINT_TENANTS_COMMUNITY_PROPERTY</li><li>JOINT_TENANTS_TENANTS_BY_ENTIRETY</li><li>CONSERVATOR</li><li>ROTH_IRA</li><li>ROTH_CONVERSION</li><li>ROLLOVER_IRA</li><li>EDUCATIONAL</li><li>EDUCATIONAL_SAVINGS_PLAN_529</li><li>DEFERRED_COMPENSATION_PLAN_457</li><li>MONEY_PURCHASE_RETIREMENT_PLAN_401A</li><li>PROFIT_SHARING_PLAN</li><li>MONEY_PURCHASE_PLAN</li><li>STOCK_BASKET_ACCOUNT</li><li>LIVING_TRUST</li><li>REVOCABLE_TRUST</li><li>IRREVOCABLE_TRUST</li><li>CHARITABLE_REMAINDER_TRUST</li><li>CHARITABLE_LEAD_TRUST</li><li>CHARITABLE_GIFT_ACCOUNT</li><li>SEP_IRA</li><li>UNIFORM_TRANSFER_TO_MINORS_ACT_UTMA</li><li>UNIFORM_GIFT_TO_MINORS_ACT_UGMA</li><li>EMPLOYEE_STOCK_OWNERSHIP_PLAN_ESOP</li><li>ADMINISTRATOR</li><li>EXECUTOR</li><li>PARTNERSHIP</li><li>PROPRIETORSHIP</li><li>CHURCH_ACCOUNT</li><li>INVESTMENT_CLUB</li><li>RESTRICTED_STOCK_AWARD</li><li>CASH_MANAGEMENT_ACCOUNT</li><li>EMPLOYEE_STOCK_PURCHASE_PLAN_ESPP</li><li>PERFORMANCE_PLAN</li><li>BROKERAGE_LINK_ACCOUNT</li><li>MONEY_MARKET_ACCOUNT</li><li>SUPERANNUATION</li><li>REGISTERED_RETIREMENT_SAVINGS_PLAN_RRSP</li><li>SPOUSAL_RETIREMENT_SAVINGS_PLAN_SRSP</li><li>DEFERRED_PROFIT_SHARING_PLAN_DPSP</li><li>NON_REGISTERED_SAVINGS_PLAN_NRSP</li><li>REGISTERED_EDUCATION_SAVINGS_PLAN_RESP</li><li>GROUP_RETIREMENT_SAVINGS_PLAN_GRSP</li><li>LOCKED_IN_RETIREMENT_SAVINGS_PLAN_LRSP</li><li>RESTRICTED_LOCKED_IN_SAVINGS_PLAN_RLSP</li><li>LOCKED_IN_RETIREMENT_ACCOUNT_LIRA</li><li>REGISTERED_PENSION_PLAN_RPP</li><li>TAX_FREE_SAVINGS_ACCOUNT_TFSA</li><li>LIFE_INCOME_FUND_LIF</li><li>REGISTERED_RETIREMENT_INCOME_FUND_RIF</li><li>SPOUSAL_RETIREMENT_INCOME_FUND_SRIF</li><li>LOCKED_IN_REGISTERED_INVESTMENT_FUND_LRIF</li><li>PRESCRIBED_REGISTERED_RETIREMENT_INCOME_FUND_PRIF</li><li>GUARANTEED_INVESTMENT_CERTIFICATES_GIC</li><li>REGISTERED_DISABILITY_SAVINGS_PLAN_RDSP</li><li>DEFINED_CONTRIBUTION_PLAN</li><li>DEFINED_BENEFIT_PLAN</li><li>EMPLOYEE_STOCK_OPTION_PLAN</li><li>NONQUALIFIED_DEFERRED_COMPENSATION_PLAN_409A</li><li>KEOGH_PLAN</li><li>EMPLOYEE_RETIREMENT_ACCOUNT_ROTH_401K</li><li>DEFERRED_CONTINGENT_CAPITAL_PLAN_DCCP</li><li>EMPLOYEE_BENEFIT_PLAN</li><li>EMPLOYEE_SAVINGS_PLAN</li><li>HEALTH_SAVINGS_ACCOUNT_HSA</li><li>COVERDELL_EDUCATION_SAVINGS_ACCOUNT_ESA</li><li>TESTAMENTARY_TRUST</li><li>ESTATE</li><li>GRANTOR_RETAINED_ANNUITY_TRUST_GRAT</li><li>ADVISORY_ACCOUNT</li><li>NON_PROFIT_ORGANIZATION_501C</li><li>HEALTH_REIMBURSEMENT_ARRANGEMENT_HRA</li><li>INDIVIDUAL_SAVINGS_ACCOUNT_ISA</li><li>CASH_ISA</li><li>STOCKS_AND_SHARES_ISA</li><li>INNOVATIVE_FINANCE_ISA</li><li>JUNIOR_ISA</li><li>EMPLOYEES_PROVIDENT_FUND_ORGANIZATION_EPFO</li><li>PUBLIC_PROVIDENT_FUND_PPF</li><li>EMPLOYEES_PENSION_SCHEME_EPS</li><li>NATIONAL_PENSION_SYSTEM_NPS</li><li>INDEXED_ANNUITY</li><li>ANNUITIZED_ANNUITY</li><li>VARIABLE_ANNUITY</li><li>ROTH_403B</li><li>SPOUSAL_IRA</li><li>SPOUSAL_ROTH_IRA</li><li>SARSEP_IRA</li><li>SUBSTANTIALLY_EQUAL_PERIODIC_PAYMENTS_SEPP</li><li>OFFSHORE_TRUST</li><li>IRREVOCABLE_LIFE_INSURANCE_TRUST</li><li>INTERNATIONAL_TRUST</li><li>LIFE_INTEREST_TRUST</li><li>EMPLOYEE_BENEFIT_TRUST</li><li>PRECIOUS_METAL_ACCOUNT</li><li>INVESTMENT_LOAN_ACCOUNT</li><li>GRANTOR_RETAINED_INCOME_TRUST</li><li>PENSION_PLAN</li><li>DIGITAL_WALLET</li><li>OTHER</li></ul><b>loan</b><ul><li>MORTGAGE</li><li>INSTALLMENT_LOAN</li><li>PERSONAL_LOAN</li><li>HOME_EQUITY_LINE_OF_CREDIT</li><li>LINE_OF_CREDIT</li><li>AUTO_LOAN</li><li>STUDENT_LOAN</li><li>HOME_LOAN</li></ul><b>insurance</b><ul><li>AUTO_INSURANCE</li><li>HEALTH_INSURANCE</li><li>HOME_INSURANCE</li><li>LIFE_INSURANCE</li><li>ANNUITY</li><li>TRAVEL_INSURANCE</li><li>INSURANCE</li></ul><b>realEstate</b><ul> <li>REAL_ESTATE</li></ul><b>reward</b><ul><li>REWARD_POINTS</li></ul><b>Manual Account Type</b><br><b>bank</b><ul><li>CHECKING</li><li>SAVINGS</li><li>CD</li><li>PREPAID</li></ul><b>credit</b><ul>  <li>CREDIT</li></ul><b>loan</b><ul>  <li>PERSONAL_LOAN</li><li>HOME_LOAN</li></ul><b>insurance</b><ul><li>INSURANCE</li><li>ANNUITY</li></ul><b>investment</b><ul><li>BROKERAGE_CASH</li></ul><br><br><b>Aggregated / Manual</b>: Both <br><b>Applicable containers</b>: All containers<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    accountType?: string
    /**
     * The date on which the loan is disbursed.<br><br><b>Aggregated / Manual</b>: Both <br><b>Applicable containers</b>: loan<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    originationDate?: string
    /**
     * The total vested balance that appears in an investment account. Such as the 401k account or the equity award account that includes employer provided funding. <br><b>Note:</b> The amount an employee can claim after he or she leaves the organization. The total vested balance field is only applicable to the retirement related accounts such as 401k, equity awards, etc.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: investment<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    totalVestedBalance?: /* Money */ Money
    /**
     * Information of different reward balances associated with the account.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: reward<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    rewardBalance?: /* RewardBalance */ RewardBalance[]
    /**
     * Indicates the status of the loan account. <br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: loan<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul><b>Applicable Values:</b><br>
     */
    sourceAccountStatus?:
      | 'IN_REPAYMENT'
      | 'DEFAULTED'
      | 'IN_SCHOOL'
      | 'IN_GRACE_PERIOD'
      | 'DELINQUENCY'
      | 'DEFERMENT'
      | 'FORBEARANCE'
    /**
     * List of Loan accountId(s) to which the real-estate account is linked<br><br><b>Aggregated / Manual</b>: Both <br><b>Applicable containers</b>: realEstate<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    linkedAccountIds?: number /* int64 */[]
    /**
     * Derived APR will be an estimated purchase APR based on consumers credit card transactions and credit card purchase.<br><b>Aggregated / Manual / Derived</b>: Derived<br><b>Applicable containers</b>: creditCard<br><b>Endpoints</b>:<br><ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    derivedApr?: number // double
    /**
     * The date on which the insurance policy coverage commences.<br><b>Applicable containers</b>: insurance<br><b>Aggregated / Manual</b>: Aggregated<br><b>Endpoints</b>:<br><ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    policyEffectiveDate?: string
    /**
     * The total unvested balance that appears in an investment account.Such as the 401k account or the equity award account that includes employer provided funding. <br><b>Note:</b> The amount the employer contributes is generally subject to vesting and remain unvested for a specific period of time or until fulfillment of certain conditions. The total unvested balance field is only applicable to the retirement related accounts such as 401k, equity awards, etc.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: investment<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    totalUnvestedBalance?: /* Money */ Money
    /**
     * Indicates the contract value of the annuity.<br><b>Note:</b> The annuity balance field is applicable only to annuities.<br><b>Applicable containers</b>: insurance, investment<br><b>Aggregated / Manual</b>: Both <br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    annuityBalance?: /* Money */ Money
    /**
     * The account name as it appears at the site.<br>(The POST accounts service response return this field as name)<br><b>Applicable containers</b>: All Containers<br><b>Aggregated / Manual</b>: Both <br><b>Endpoints</b>:<br><ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    accountName?: string
    /**
     * The maximum amount of credit a financial institution extends to a consumer through a line of credit or a revolving loan like HELOC. <br><b>Additional Details:</b><br><b>Note:</b> The credit limit field is applicable only to LOC and HELOC account types.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: loan<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    totalCreditLimit?: /* Money */ Money
    /**
     * The status of the policy.<br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: insurance<br><b>Endpoints</b>:<br><ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul><b>Applicable Values</b><br>
     */
    policyStatus?: 'ACTIVE' | 'INACTIVE' | 'OTHER'
    /**
     * The sum of the current market values of short positions held in a brokerage account.<br><b>Note:</b> The short balance balance field is only applicable to brokerage related accounts.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: investment<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    shortBalance?: /* Money */ Money
    /**
     * The financial institution that provides the loan.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: loan<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    lender?: string
    /**
     * Indicates the last amount contributed by the employee to the 401k account.<br><b>Note:</b> The last employee contribution amount field is derived from the transaction data and not aggregated from the FI site. The field is only applicable to the 401k account type.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: investment<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    lastEmployeeContributionAmount?: /* Money */ Money
    /**
     * Identifier of the provider site. The primary key of provider resource. <br><br><b>Aggregated / Manual</b>: Both <br><b>Applicable containers</b>: All containers<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    providerId?: string
    /**
     * The date on which the payment for the previous or current billing cycle is done.<br><b>Additional Details:</b> If the payment is already done for the current billing cycle, then the field indicates the payment date of the current billing cycle. If payment is yet to be done for the current billing cycle, then the field indicates the date on which the payment was made for any of the previous billing cycles. The last payment date at the account-level can differ from the last payment date at the statement-level, as the information in the aggregated card account data provides an up-to-date information to the consumer.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: creditCard, loan, insurance<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    lastPaymentDate?: string
    /**
     * Primary reward unit for this reward program. E.g. miles, points, etc.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: reward<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    primaryRewardUnit?: string
    /**
     * Last/Previous payment amount on the account.  Portion of the principal and interest paid on previous month or period to satisfy a loan.<br><b>Additional Details:</b> If the payment is already done for the current billing cycle, then the field indicates the payment of the current billing cycle. If payment is yet to be done for the current billing cycle, then the field indicates the payment that was made for any of the previous billing cycles.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: creditCard, loan, insurance<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    lastPaymentAmount?: /* Money */ Money
    /**
     * The sum of the future payments due to be paid to the insurance company during a policy year. It is the policy rate minus the payments made till date.<br><b>Note:</b> The remaining balance field is applicable only to auto insurance and home insurance.<br><b>Applicable containers</b>: insurance<br><b>Aggregated / Manual</b>: Aggregated<br><b>Endpoints</b>:<br><ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    remainingBalance?: /* Money */ Money
    /**
     * <b>Applicable containers</b>: reward, bank, creditCard, investment, loan, insurance, realEstate, otherLiabilities<br><b>Endpoints</b>:<ul><li>GET accounts </li><li>GET accounts/{accountId}</li><li>POST accounts</ul><li>GET dataExtracts/userData</li><b>Applicable Values</b><br>
     */
    userClassification?: 'BUSINESS' | 'PERSONAL'
    /**
     * Bank and branch identification information.<br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: bank, investment, loan<br><b>Endpoints</b>:<br><ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    bankTransferCode?: /* BankTransferCode */ BankTransferCode[]
    /**
     * The date on which the insurance policy expires or matures.<br><b>Additional Details:</b> The due date at the account-level can differ from the due date field at the statement-level, as the information in the aggregated card account data provides an up-to-date information to the consumer.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: insurance<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    expirationDate?: string
    /**
     * The coverage-related details of the account.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: insurance,investment<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    coverage?: /* Coverage */ Coverage[]
    /**
     * Annual percentage rate applied to cash withdrawals on the card.<br><br><b>Account Type</b>: Aggregated<br><b>Applicable containers</b>: creditCard<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    cashApr?: number // double
    /**
     * Indicates the migration status of the account from screen-scraping provider to the Open Banking provider. <br><br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    oauthMigrationStatus?:
      | 'IN_PROGRESS'
      | 'TO_BE_MIGRATED'
      | 'COMPLETED'
      | 'MIGRATED'
    /**
     * The name or identification of the account owner, as it appears at the FI site. <br><b>Note:</b> The account holder name can be full or partial based on how it is displayed in the account summary page of the FI site. In most cases, the FI site does not display the full account holder name in the account summary page.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: bank, creditCard, investment, insurance, loan, reward<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    displayedName?: string
    /**
     * The providerAccountId that is deleted and merged into the destinationProviderAccountId as part of the many-to-one OAuth migration process.<br><b>Endpoints</b>:<ul><li>GET dataExtracts/userData</li></ul>
     */
    sourceProviderAccountId?: number // int64
    /**
     * The amount due to be paid for the account.<br><b>Additional Details:</b><b>Credit Card:</b> The total amount due for the purchase of goods or services that must be paid by the due date.<br><b>Loan:</b> The amount due to be paid on the due date.<br><b>Note:</b> The amount due at the account-level can differ from the amount due at the statement-level, as the information in the aggregated card account data provides more up-to-date information.<br><b>Applicable containers</b>: creditCard, loan, insurance<br><b>Aggregated / Manual</b>: Both <br><b>Endpoints</b>:<br><ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    amountDue?: /* Money */ Money
    /**
     * Current level of the reward program the user is associated with. E.g. Silver, Jade etc.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: reward<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    currentLevel?: string
    /**
     * The amount of loan that the lender has provided.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: loan<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    originalLoanAmount?: /* Money */ Money
    /**
     * The date to which the policy exists.<br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: insurance<br><b>Endpoints</b>:<br><ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    policyToDate?: string
    /**
     * The loan payoff details such as date by which the payoff amount should be paid, loan payoff amount, and the outstanding balance on the loan account.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: loan<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    loanPayoffDetails?: /* LoanPayoffDetails */ LoanPayoffDetails
    /**
     * The type of service. E.g., Bank, Credit Card, Investment, Insurance, etc.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: All containers<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul><b>Applicable Values</b><br>
     */
    CONTAINER?:
      | 'bank'
      | 'creditCard'
      | 'investment'
      | 'insurance'
      | 'loan'
      | 'reward'
      | 'bill'
      | 'realEstate'
      | 'otherAssets'
      | 'otherLiabilities'
    /**
     * The date on which the last employee contribution was made to the 401k account.<br><b>Note:</b> The last employee contribution date field is derived from the transaction data and not aggregated from the FI site. The field is only applicable to the 401k account type.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: investment<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    lastEmployeeContributionDate?: string
    /**
     * The last payment made for the account.<br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: bill<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    lastPayment?: /* Money */ Money
    /**
     * The monthly or periodic payment on a loan that is recurring in nature. The recurring payment amount is usually same as the amount due, unless late fees or other charges are added eventually changing the amount due for a particular month.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: loan<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    recurringPayment?: /* Money */ Money
  }
  /**
   * DataExtractsEvent
   */
  export interface DataExtractsEvent {
    data?: /* DataExtractsEventData */ DataExtractsEventData
    info?: string
  }
  /**
   * DataExtractsEventData
   */
  export interface DataExtractsEventData {
    fromDate?: string
    userData?: /* DataExtractsEventUserData */ DataExtractsEventUserData[]
    userCount?: number // int32
    toDate?: string
  }
  /**
   * DataExtractsEventLinks
   */
  export interface DataExtractsEventLinks {
    methodType?: string
    rel?: string
    href?: string
  }
  /**
   * DataExtractsEventResponse
   */
  export interface DataExtractsEventResponse {
    event?: /* DataExtractsEvent */ DataExtractsEvent
  }
  /**
   * DataExtractsEventUserData
   */
  export interface DataExtractsEventUserData {
    links?: /* DataExtractsEventLinks */ DataExtractsEventLinks[]
    user?: /* DataExtractsUser */ DataExtractsUser
  }
  /**
   * DataExtractsHolding
   */
  export interface DataExtractsHolding {
    /**
     * The symbol of the security.<br><br><b>Applicable containers</b>: investment<br>
     */
    symbol?: string
    /**
     * The quantity of the employee stock options that are already exercised or bought by the employee.<br><b>Note</b>: Once the employee stock options is exercised, they are either converted to cash value or equity positions depending on the FI. The exercised quantity field is only applicable to employee stock options.<br><br><b>Applicable containers</b>: investment<br>
     */
    exercisedQuantity?: number // double
    /**
     * The CUSIP (Committee on Uniform Securities Identification Procedures) identifies most the financial instruments in the United States and Canada.<br><br><b>Applicable containers</b>: investment<br>
     */
    cusipNumber?: string
    /**
     * The quantity of units or shares that are already vested on a vest date.<br><b>Note</b>: The vested quantity field is only applicable to employee stock options, restricted stock units/awards, performance units, etc.<br><br><b>Applicable containers</b>: investment<br>
     */
    vestedQuantity?: number // double
    /**
     * The description (name) for the holding (E.g., Cisco Systems)<br>For insurance container, the field is only applicable for insurance annuity and variable life insurance types. <br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    description?: string
    /**
     * Indicates the estimated market value of the unvested units.<br><b>Note</b>: FIs usually calculates the unvested value as the market price unvested quantity. The unvested value field is only applicable to employee stock options, restricted stock units/awards, performance units, etc.<br><br><b>Applicable containers</b>: investment<br>
     */
    unvestedValue?: /* Money */ Money
    /**
     * Indicates the security style of holding identified through the security service.<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    securityStyle?: string
    /**
     * Indicates the estimated market value of the vested units.<br><b>Note</b>: FIs usually calculates the vested value as the market price vested quantity. The vested value field is only applicable to employee stock options, restricted stock units/awards, performance units, etc.<br><br><b>Applicable containers</b>: investment<br>
     */
    vestedValue?: /* Money */ Money
    /**
     * The type of the option position (i.e., put or call).<br><b>Note</b>: The option type field is only applicable to options.<br><br><b>Applicable containers</b>: investment<br><b>Applicable Values</b><br>
     */
    optionType?: 'put' | 'call' | 'unknown' | 'other'
    /**
     * The date when the information was last updated in the system.<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    lastUpdated?: string
    /**
     * Indicates the security match status id of the investment option identified during security normalization.<br><br><b>Applicable containers</b>: investment<br>
     */
    matchStatus?: string
    /**
     * Type of holding<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    holdingType?:
      | 'stock'
      | 'mutualFund'
      | 'bond'
      | 'CD'
      | 'option'
      | 'moneyMarketFund'
      | 'other'
      | 'remic'
      | 'future'
      | 'commodity'
      | 'currency'
      | 'unitInvestmentTrust'
      | 'employeeStockOption'
      | 'insuranceAnnuity'
      | 'unknown'
      | 'preferredStock'
      | 'ETF'
      | 'warrants'
      | 'digitalAsset'
    /**
     * The stated maturity date of a bond or CD.<br><br><b>Applicable containers</b>: investment<br>
     */
    maturityDate?: string
    /**
     * The current price of the security.<br><b>Note</b>: Only for bonds the price field indicates the normalized price and not the price aggregated from the site. For insurance container, the field is only applicable for insurance annuity and variable life insurance types.<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    price?: /* Money */ Money
    /**
     * The fixed duration for which the bond or CD is issued.<br><b>Note</b>: The term field is only applicable to CD.<br><br><b>Applicable containers</b>: investment<br>
     */
    term?: string
    /**
     * The quantity of tradeable units in a contract.<br><b>Note</b>: The contract quantity field is only applicable to commodity and currency.<br><br><b>Applicable containers</b>: investment<br>
     */
    contractQuantity?: number // double
    /**
     * Unique identifier for the security added in the system. This is the primary key of the holding resource.<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    id?: number // int64
    /**
     * Indicates that the holding is a short trading.<br><br><b>Applicable containers</b>: investment<br>
     */
    isShort?: boolean
    /**
     * The total market value of the security. For insurance container, the field is only applicable for insurance annuity and variable life insurance types.<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    value?: /* Money */ Money
    /**
     * The date on which an option, right or warrant expires.<br><b>Note</b>: The expiration date field is only applicable to options and employee stock options.<br><br><b>Applicable containers</b>: investment<br>
     */
    expirationDate?: string
    /**
     * The interest rate on a CD.<br><b>Note</b>: The interest rate field is only applicable to CD.<br><br><b>Applicable containers</b>: investment<br>
     */
    interestRate?: number // double
    /**
     * The quantity held for the holding.<br><b>Note</b>: Only for bonds the quantity field indicates the normalized quantity and not the quantity aggregated from the site. The quantity field is only applicable to restricted stock units/awards, performance units, currency, and commodity.<br>For insurance container, the field is only applicable for insurance annuity and variable life insurance types.<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    quantity?: number // double
    /**
     * The accruedInterest of the  holding.<br><br><b>Applicable containers</b>: investment<br>
     */
    accruedInterest?: /* Money */ Money
    /**
     * The date on which equity awards like ESOP, RSU, etc., are issued or granted.<br><b>Note</b>: The grant date field is only applicable to employee stock options, restricted stock units/awards, performance units, etc.<br><br><b>Applicable containers</b>: investment<br>
     */
    grantDate?: string
    /**
     * The SEDOL (Stock Exchange Daily Official List) is a set of security identifiers used in the United Kingdom and Ireland for clearing purposes.<br><b>Note</b>: The SEDOL field is only applicable to the trade related transactions<br><br><b>Applicable containers</b>: investment<br>
     */
    sedol?: string
    /**
     * The number of vested shares that can be exercised by the employee. It is usually equal to the vested quantity.<br><b>Note</b>: The vested shares exercisable field is only applicable to employee stock options, restricted stock units/awards, performance units, etc.<br><br><b>Applicable containers</b>: investment<br>
     */
    vestedSharesExercisable?: number // double
    /**
     * The difference between the current market value of a stock and the strike price of the employee stock option, when the market value of the shares are greater than the stock price.<br><b>Note</b>: The spread field is only applicable to employee stock options.<br><br><b>Applicable containers</b>: investment<br>
     */
    spread?: /* Money */ Money
    /**
     * Unique identifier of the account to which the security is linked.<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    accountId?: number // int64
    /**
     * The enrichedDescription is the security description of the normalized holding<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    enrichedDescription?: string
    /**
     * The stated interest rate for a bond.<br><br><b>Applicable containers</b>: investment<br>
     */
    couponRate?: number // double
    /**
     * The date on which the holding is created in the Yodlee system.<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    createdDate?: string
    /**
     * The accruedIncome of the  holding.<br><br><b>Applicable containers</b>: investment<br>
     */
    accruedIncome?: /* Money */ Money
    /**
     * Indicates the security type of holding identified through the security service.<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    securityType?: string
    /**
     * Unique identifier for the user's association with the provider.<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    providerAccountId?: number // int64
    /**
     * Indicates the number of unvested quantity or units.<br><b>Note</b>: The unvested quantity field is only applicable to employee stock options, restricted stock units/awards, performance units, etc.<br><br><b>Applicable containers</b>: investment<br>
     */
    unvestedQuantity?: number // double
    /**
     * In a one-off security purchase, the cost basis is the quantity acquired multiplied by the price per unit paid plus any commission paid. In case, the same position is acquired in different lots on different days at different prices, the sum total of the cost incurred is divided by the total units acquired to arrive at the average cost basis.<br><br><b>Applicable containers</b>: investment<br>
     */
    costBasis?: /* Money */ Money
    /**
     * The date on which a RSU, RSA, or an employee stock options become vested.<br><b>Note</b>: The vesting date field is only applicable to employee stock options, restricted stock units/awards, performance units, etc.<br><br><b>Applicable containers</b>: investment<br>
     */
    vestingDate?: string
    /**
     * The ISIN (International Securities Identification Number) is used worldwide to identify specific securities. It is equivalent to CUSIP for international markets.<br><br><b>Note</b>: The ISIN field is only applicable to the trade related transactions<br><br><b>Applicable containers</b>: investment<br>
     */
    isin?: string
    /**
     * The strike (exercise) price for the option position.<br><b>Note</b>: The strike price field is only applicable to options and employee stock options.<br><br><b>Applicable containers</b>: investment<br>
     */
    strikePrice?: /* Money */ Money
  }
  /**
   * DataExtractsProviderAccount
   */
  export interface DataExtractsProviderAccount {
    /**
     * The providerAccountId that is retained as part of the many-to-one OAuth migration process.<br><b>Endpoints</b>:<ul><li>GET dataExtracts/userData</li></ul>
     */
    destinationProviderAccountId?: number // int64
    /**
     * Indicates the migration status of the provider account from screen-scraping provider to the Open Banking provider. <br><br><b>Endpoints</b>:<ul><li>GET providerAccounts</li><li>GET providerAccounts/{providerAccountId}</li><li>PUT providerAccounts/{providerAccountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    oauthMigrationStatus?:
      | 'IN_PROGRESS'
      | 'TO_BE_MIGRATED'
      | 'COMPLETED'
      | 'MIGRATED'
    /**
     * Indicates whether account is a manual or aggregated provider account.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts</li><li>POST providerAccounts</li><li>PUT providerAccounts/{providerAccountId}</li><li>GET providerAccounts/{providerAccountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    isManual?: boolean
    /**
     * Indicate when the providerAccount is last updated successfully.<br><br><b>Account Type</b>: Aggregated<br><b>Endpoints</b>:<ul><li>GET dataExtracts/userData</li></ul>
     */
    lastUpdated?: string
    /**
     * The date on when the provider account is created in the system.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts</li><li>POST providerAccounts</li><li>PUT providerAccounts/{providerAccountId}</li><li>GET providerAccounts/{providerAccountId}</li></ul>
     */
    createdDate?: string
    /**
     * The source through which the providerAccount is added in the system.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts</li><li>POST providerAccounts</li><li>PUT providerAccounts/{providerAccountId}</li><li>GET providerAccounts/{providerAccountId}</li><li>GET dataExtracts/userData</li></ul><b>Applicable Values</b><br>
     */
    aggregationSource?: 'SYSTEM' | 'USER'
    /**
     * Indicates if the provider account is deleted from the system.<b>Applicable containers</b>: All Containers<br><b>Aggregated / Manual</b>: Both <br><b>Endpoints</b>:<br><ul><li>GET dataExtracts/userData</li></ul>
     */
    isDeleted?: boolean
    /**
     * Unique identifier for the provider resource. This denotes the provider for which the provider account id is generated by the user.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts</li><li>POST providerAccounts</li><li>PUT providerAccounts/{providerAccountId}</li><li>GET providerAccounts/{providerAccountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    providerId?: number // int64
    /**
     * Unique id generated to indicate the request.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts</li><li>POST providerAccounts</li><li>PUT providerAccounts/{providerAccountId}</li><li>GET providerAccounts/{providerAccountId}</li></ul>
     */
    requestId?: string
    /**
     * The providerAccountIds that are deleted and merged into the destinationProviderAccountId as part of the many-to-one OAuth migration process.<br><b>Endpoints</b>:<ul><li>GET dataExtracts/userData</li></ul>
     */
    sourceProviderAccountIds?: number /* int64 */[]
    /**
     * Unique identifier for the provider account resource. This is created during account addition.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts</li><li>POST providerAccounts</li><li>PUT providerAccounts/{providerAccountId}</li><li>GET providerAccounts/{providerAccountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    id?: number // int64
    /**
     * Logical grouping of dataset attributes into datasets such as Basic Aggregation Data, Account Profile and Documents.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts</li><li>POST providerAccounts</li><li>PUT providerAccounts/{providerAccountId}</li><li>GET providerAccounts/{providerAccountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    dataset?: /* AccountDataset */ AccountDataset[]
    /**
     * The status of last update attempted for the account. <br><br><b>Endpoints</b>:<ul><li>GET providerAccounts</li><li>POST providerAccounts</li><li>PUT providerAccounts/{providerAccountId}</li><li>GET providerAccounts/{providerAccountId}</li><li>GET dataExtracts/userData</li></ul><b>Applicable Values</b><br>
     */
    status?:
      | 'LOGIN_IN_PROGRESS'
      | 'USER_INPUT_REQUIRED'
      | 'IN_PROGRESS'
      | 'PARTIAL_SUCCESS'
      | 'SUCCESS'
      | 'FAILED'
      | 'MIGRATION_IN_PROGRESS'
  }
  /**
   * DataExtractsTransaction
   */
  export interface DataExtractsTransaction {
    /**
     * The value provided will be either postDate or transactionDate. postDate takes higher priority than transactionDate, except for the investment container as only transactionDate is available. The availability of postDate or transactionDate depends on the provider site.<br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>
     */
    date?: string
    /**
     * A unique ID that the provider site has assigned to the transaction. The source ID is only available for the pre-populated accounts.<br>Pre-populated accounts are the accounts that the FI customers shares with Yodlee, so that the user does not have to add or aggregate those accounts.
     */
    sourceId?: string
    /**
     * The symbol of the security being traded.<br><b>Note</b>: The settle date field applies only to trade-related transactions. <br><br><b>Applicable containers</b>: investment<br>
     */
    symbol?: string
    /**
     * The CUSIP (Committee on Uniform Securities Identification Procedures) identifies the financial instruments in the United States and Canada.<br><b><br><b>Note</b></b>: The CUSIP number field applies only to trade related transactions.<br><br><b>Applicable containers</b>: investment<br>
     */
    cusipNumber?: string
    /**
     * The high level category assigned to the transaction. The supported values are provided by the GET transactions/categories. <br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>
     */
    highLevelCategoryId?: number // int64
    /**
     * The id of the detail category that is assigned to the transaction. The supported values are provided by GET transactions/categories.<br><br><b>Applicable containers</b>: bank,creditCard<br>
     */
    detailCategoryId?: number // int64
    /**
     * Description details<br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>
     */
    description?: /* Description */ Description
    /**
     * Additional notes provided by the user for a particular  transaction through application or API services. <br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>
     */
    memo?: string
    /**
     * It is the date on which the transaction is finalized, that is, the date the ownership of the security is transferred to the buyer. The settlement date is usually few days after the transaction date.<br><br><b>Applicable containers</b>: investment<br>
     */
    settleDate?: string
    /**
     * The nature of the transaction, i.e., deposit, refund, payment, etc.<br><b>Note</b>: The transaction type field is available only for the United States, Canada, United Kingdom, and India based provider sites. <br><br><b>Applicable containers</b>: bank,creditCard,investment<br>
     */
    type?: string
    /**
     * The intermediary of the transaction.<br><br><b>Applicable containers</b>:  bank,creditCard,investment,loan<br>
     */
    intermediary?: string[]
    /**
     * Indicates if the transaction appears as a debit or a credit transaction in the account. <br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br><b>Applicable Values</b><br>
     */
    baseType?: 'CREDIT' | 'DEBIT'
    /**
     * Indicates the source of the category, i.e., categories derived by the system or assigned/provided by the consumer. This is the source field of the transaction category resource. The supported values are provided by the GET transactions/categories.<br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br><b>Applicable Values</b><br>
     */
    categorySource?: 'SYSTEM' | 'USER'
    /**
     * The portion of the principal in the transaction amount. The transaction amount can be the amount due, payment amount, minimum amount, repayment, etc.<br><br><b>Applicable containers</b>: loan<br>
     */
    principal?: /* Money */ Money
    lastUpdated?: string
    /**
     * Indicates if the transaction is marked as deleted.<b>Applicable containers</b>: All Containers<br><b>Aggregated / Manual</b>: Both <br><b>Endpoints</b>:<br><ul><li>GET dataExtracts/userData</li></ul>
     */
    isDeleted?: boolean
    /**
     * The portion of interest in the transaction amount. The transaction amount can be the amount due, payment amount, minimum amount, repayment, etc.<br><br><b>Applicable containers</b>: loan<br>
     */
    interest?: /* Money */ Money
    /**
     * The price of the security for the transaction.<br><b>Note</b>: The price field applies only to the trade related transactions. <br><br><b>Applicable containers</b>: investment<br>
     */
    price?: /* Money */ Money
    /**
     * A commission or brokerage associated with a transaction.<br><br><br><b>Additional Details</b>:The commission only applies to trade-related transactions.<b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>
     */
    commission?: /* Money */ Money
    /**
     * An unique identifier for the transaction. The combination of the id and account container are unique in the system. <br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>
     */
    id?: number // int64
    /**
     * Indicates the merchantType of the transaction.e.g:-BILLERS,SUBSCRIPTION,OTHERS <br><br><b>Applicable containers</b>: bank,creditCard,investment,loan<br>
     */
    merchantType?: string
    /**
     * The amount of the transaction as it appears at the FI site. <br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>
     */
    amount?: /* Money */ Money
    /**
     * The checkNumber of the transaction.<br><br><b>Applicable containers</b>: bank<br>
     */
    checkNumber?: string
    /**
     * Indicates if the transaction is happened online or in-store. <br><br><b>Applicable containers</b>: bank,creditCard,investment,loan<br>
     */
    isPhysical?: boolean
    /**
     * The quantity associated with the transaction.<br><b>Note</b>: The quantity field applies only to trade-related transactions.<br><br><b>Applicable containers</b>: investment<br>
     */
    quantity?: number // double
    /**
     * It is an identification number that is assigned to financial instruments such as stocks and bonds trading in Switzerland.<br><br><b>Applicable containers</b>: investment<br>
     */
    valoren?: string
    /**
     * Indicates if the transaction is aggregated from the FI site or the consumer has manually created the transaction using the application or an API. <br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>
     */
    isManual?: boolean
    /**
     * The name of the merchant associated with the transaction.<br><b>Note</b>: The merchant name field is available only in the United States, Canada, United Kingdom, and India.<br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>
     */
    merchant?: /* Merchant */ Merchant
    /**
     * SEDOL stands for Stock Exchange Daily Official List, a list of security identifiers used in the United Kingdom and Ireland for clearing purposes.<br><br><b>Applicable containers</b>: investment<br>
     */
    sedol?: string
    /**
     * The date the transaction happens in the account. <br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>
     */
    transactionDate?: string
    /**
     * The categoryType of the category assigned to the transaction. This is the type field of the transaction category resource. The supported values are provided by the GET transactions/categories.<br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>
     */
    categoryType?:
      | 'TRANSFER'
      | 'DEFERRED_COMPENSATION'
      | 'UNCATEGORIZE'
      | 'INCOME'
      | 'EXPENSE'
    /**
     * The account from which the transaction was made. This is basically the primary key of the account resource. <br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>
     */
    accountId?: number // int64
    createdDate?: string
    /**
     * The source through which the transaction is added to the Yodlee system.<br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loann<br><b>Applicable Values:</b><br>
     */
    sourceType?: 'AGGREGATED' | 'MANUAL'
    /**
     * The account's container.<br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br><b>Applicable Values</b><br>
     */
    CONTAINER?:
      | 'bank'
      | 'creditCard'
      | 'investment'
      | 'insurance'
      | 'loan'
      | 'reward'
      | 'bill'
      | 'realEstate'
      | 'otherAssets'
      | 'otherLiabilities'
    /**
     * The date on which the transaction is posted to the account.<br><br><b>Applicable containers</b>: bank,creditCard,insurance,loan<br>
     */
    postDate?: string
    /**
     * The parentCategoryId of the category assigned to the transaction.<br><b>Note</b>: This field will be provided in the response if the transaction is assigned to a user-created category. <br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>
     */
    parentCategoryId?: number // int64
    /**
     * The transaction subtype field provides a detailed transaction type. For example, purchase is a transaction type and the transaction subtype field indicates if the purchase was made using a debit or credit card.<br><b>Note</b>: The transaction subtype field is available only in the United States, Canada, United Kingdom, and India.<br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>
     */
    subType?:
      | 'OVERDRAFT_CHARGE'
      | 'ONLINE_PURCHASE'
      | 'TAX_PAYMENT'
      | 'PAYMENT_BY_CHECK'
      | 'ATM_CASH_WITHDRAWAL'
      | 'SERVICE_CHARGE'
      | 'RETURNED_CHECK_CHARGE'
      | 'STOP_PAYMENT_CHARGE'
      | 'CONVENIENCE_FEE'
      | 'AUTO_LOAN'
      | 'HOME_LOAN_MORTGAGE'
      | 'RECURRING_SUBSCRIPTION_PAYMENT'
      | 'INTEREST'
      | 'PAYMENT'
      | 'PURCHASE'
      | 'REFUND'
      | 'TRANSFER'
      | 'FINANCE_CHARGE'
      | 'OTHER_CHARGES_FEES'
      | 'ANNUAL_FEE'
      | 'DEPOSIT'
      | 'DIRECT_DEPOSIT_SALARY'
      | 'INVESTMENT_INCOME_CASH'
      | 'SSA'
      | 'REWARDS'
      | 'TAX_REFUND'
      | 'CREDIT_CARD_PAYMENT'
      | 'INSURANCE_PAYMENT'
      | 'UTILITIES_PAYMENT'
      | 'CHILD_SUPPORT'
      | 'LOAN'
      | 'PERSONAL_LOAN'
      | 'STUDENT_LOAN'
      | 'REIMBURSEMENT'
      | 'BALANCE_TRANSFER'
      | 'OVERDRAFT_PROTECTION'
      | 'CREDIT'
      | 'NSF_FEES'
    /**
     * The name of the category assigned to the transaction. This is the category field of the transaction category resource. The supported values are provided by the GET transactions/categories.<br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>
     */
    category?: string
    /**
     * The running balance in an account indicates the balance of the account after every transaction.<br><br><b>Applicable containers</b>: bank,creditCard,investment<br>
     */
    runningBalance?: /* Money */ Money
    /**
     * The id of the category assigned to the transaction. This is the id field of the transaction category resource. The supported values are provided by the GET transactions/categories.<br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>
     */
    categoryId?: number // int64
    /**
     * For transactions involving securities, this captures the securities description.<br><br><b>Applicable containers</b>: investment<br>
     */
    holdingDescription?: string
    /**
     * International Securities Identification Number (ISIN) standard is used worldwide to identify specific securities.<br><br><b>Applicable containers</b>: investment<br>
     */
    isin?: string
    /**
     * The status of the transaction: pending or posted.<br><b>Note</b>: Most FI sites only display posted transactions. If the FI site displays transaction status, same will be aggregated.  <br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br><b>Applicable Values</b><br>
     */
    status?: 'POSTED' | 'PENDING' | 'SCHEDULED' | 'FAILED' | 'CLEARED'
  }
  /**
   * DataExtractsUser
   */
  export interface DataExtractsUser {
    loginName?: string
  }
  /**
   * DataExtractsUserData
   */
  export interface DataExtractsUserData {
    holding?: /* DataExtractsHolding */ DataExtractsHolding[]
    totalTransactionsCount?: number // int64
    user?: /* DataExtractsUser */ DataExtractsUser
    account?: /* DataExtractsAccount */ DataExtractsAccount[]
    transaction?: /* DataExtractsTransaction */ DataExtractsTransaction[]
    providerAccount?: /* DataExtractsProviderAccount */ DataExtractsProviderAccount[]
  }
  /**
   * DataExtractsUserDataResponse
   */
  export interface DataExtractsUserDataResponse {
    userData?: /* DataExtractsUserData */ DataExtractsUserData[]
  }
  /**
   * DerivedCategorySummary
   */
  export interface DerivedCategorySummary {
    /**
     * The total of credit transactions for the category.<br><br><b>Applicable containers</b>: creditCard, bank, investment<br>
     */
    creditTotal?: /* Money */ Money
    /**
     * Credit and debit summary per date.<br><br><b>Applicable containers</b>: creditCard, bank, investment<br>
     */
    details?: /* DerivedCategorySummaryDetails */ DerivedCategorySummaryDetails[]
    /**
     * Link of the API services that corresponds to the value derivation.<br><br><b>Applicable containers</b>: creditCard, bank, investment<br>
     */
    links?: /* DerivedTransactionsLinks */ DerivedTransactionsLinks
    /**
     * The name of the category.<br><br><b>Applicable containers</b>: creditCard, bank, investment<br>
     */
    categoryName?: string
    /**
     * Id of the category. This information is provided by transactions/categories service.<br><br><b>Applicable containers</b>: creditCard, bank, investment<br>
     */
    categoryId?: number // int64
    /**
     * The total of debit transactions for the category.<br><br><b>Applicable containers</b>: creditCard, bank, investment<br>
     */
    debitTotal?: /* Money */ Money
  }
  /**
   * DerivedCategorySummaryDetails
   */
  export interface DerivedCategorySummaryDetails {
    /**
     * Date on which the credit and debit transactions had occured.<br><br><b>Applicable containers</b>: creditCard, bank, investment<br>
     */
    date?: string
    /**
     * Total of credit transaction amounts that had occured on the date.<br><br><b>Applicable containers</b>: creditCard, bank, investment<br>
     */
    creditTotal?: /* Money */ Money
    /**
     * Total of debit transaction amounts that had occured on the date.<br><br><b>Applicable containers</b>: creditCard, bank, investment<br>
     */
    debitTotal?: /* Money */ Money
  }
  /**
   * DerivedHolding
   */
  export interface DerivedHolding {
    /**
     * The symbol of the security.<br><br><b>Applicable containers</b>: investment<br>
     */
    symbol?: string
    /**
     * The quantity of the employee stock options that are already exercised or bought by the employee.<br><b>Note</b>: Once the employee stock options is exercised, they are either converted to cash value or equity positions depending on the FI. The exercised quantity field is only applicable to employee stock options.<br><br><b>Applicable containers</b>: investment<br>
     */
    exercisedQuantity?: number // double
    /**
     * The CUSIP (Committee on Uniform Securities Identification Procedures) identifies most the financial instruments in the United States and Canada.<br><br><b>Applicable containers</b>: investment<br>
     */
    cusipNumber?: string
    /**
     * Asset classification applied to the holding. <br><br><b>Applicable containers</b>: investment<br>
     */
    assetClassification?: /* AssetClassification */ AssetClassification
    /**
     * The quantity of units or shares that are already vested on a vest date.<br><b>Note</b>: The vested quantity field is only applicable to employee stock options, restricted stock units/awards, performance units, etc.<br><br><b>Applicable containers</b>: investment<br>
     */
    vestedQuantity?: number // double
    /**
     * The description (name) for the holding (E.g., Cisco Systems)<br>For insurance container, the field is only applicable for insurance annuity and variable life insurance types. <br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    description?: string
    /**
     * Indicates the estimated market value of the unvested units.<br><b>Note</b>: FIs usually calculates the unvested value as the market price unvested quantity. The unvested value field is only applicable to employee stock options, restricted stock units/awards, performance units, etc.<br><br><b>Applicable containers</b>: investment<br>
     */
    unvestedValue?: /* Money */ Money
    /**
     * Indicates the security style of holding identified through the security service.<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    securityStyle?: string
    /**
     * Indicates the estimated market value of the vested units.<br><b>Note</b>: FIs usually calculates the vested value as the market price vested quantity. The vested value field is only applicable to employee stock options, restricted stock units/awards, performance units, etc.<br><br><b>Applicable containers</b>: investment<br>
     */
    vestedValue?: /* Money */ Money
    /**
     * The type of the option position (i.e., put or call).<br><b>Note</b>: The option type field is only applicable to options.<br><br><b>Applicable containers</b>: investment<br><b>Applicable Values</b><br>
     */
    optionType?: 'put' | 'call' | 'unknown' | 'other'
    /**
     * The date when the information was last updated in the system.<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    lastUpdated?: string
    /**
     * Indicates the security match status id of the investment option identified during security normalization.<br><br><b>Applicable containers</b>: investment<br>
     */
    matchStatus?: string
    /**
     * Type of holding<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    holdingType?:
      | 'stock'
      | 'mutualFund'
      | 'bond'
      | 'CD'
      | 'option'
      | 'moneyMarketFund'
      | 'other'
      | 'remic'
      | 'future'
      | 'commodity'
      | 'currency'
      | 'unitInvestmentTrust'
      | 'employeeStockOption'
      | 'insuranceAnnuity'
      | 'unknown'
      | 'preferredStock'
      | 'ETF'
      | 'warrants'
      | 'digitalAsset'
    /**
     * The stated maturity date of a bond or CD.<br><br><b>Applicable containers</b>: investment<br>
     */
    maturityDate?: string
    /**
     * The current price of the security.<br><b>Note</b>: Only for bonds the price field indicates the normalized price and not the price aggregated from the site. For insurance container, the field is only applicable for insurance annuity and variable life insurance types.<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    price?: /* Money */ Money
    /**
     * The fixed duration for which the bond or CD is issued.<br><b>Note</b>: The term field is only applicable to CD.<br><br><b>Applicable containers</b>: investment<br>
     */
    term?: string
    /**
     * The quantity of tradeable units in a contract.<br><b>Note</b>: The contract quantity field is only applicable to commodity and currency.<br><br><b>Applicable containers</b>: investment<br>
     */
    contractQuantity?: number // double
    /**
     * Unique identifier for the security added in the system. This is the primary key of the holding resource.<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    id?: number // int64
    /**
     * Indicates that the holding is a short trading.<br><br><b>Applicable containers</b>: investment<br>
     */
    isShort?: boolean
    /**
     * The total market value of the security. For insurance container, the field is only applicable for insurance annuity and variable life insurance types.<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    value?: /* Money */ Money
    /**
     * The date on which an option, right or warrant expires.<br><b>Note</b>: The expiration date field is only applicable to options and employee stock options.<br><br><b>Applicable containers</b>: investment<br>
     */
    expirationDate?: string
    /**
     * The interest rate on a CD.<br><b>Note</b>: The interest rate field is only applicable to CD.<br><br><b>Applicable containers</b>: investment<br>
     */
    interestRate?: number // double
    /**
     * The quantity held for the holding.<br><b>Note</b>: Only for bonds the quantity field indicates the normalized quantity and not the quantity aggregated from the site. The quantity field is only applicable to restricted stock units/awards, performance units, currency, and commodity.<br>For insurance container, the field is only applicable for insurance annuity and variable life insurance types.<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    quantity?: number // double
    /**
     * The accruedInterest of the  holding.<br><br><b>Applicable containers</b>: investment<br>
     */
    accruedInterest?: /* Money */ Money
    /**
     * The date on which equity awards like ESOP, RSU, etc., are issued or granted.<br><b>Note</b>: The grant date field is only applicable to employee stock options, restricted stock units/awards, performance units, etc.<br><br><b>Applicable containers</b>: investment<br>
     */
    grantDate?: string
    /**
     * The SEDOL (Stock Exchange Daily Official List) is a set of security identifiers used in the United Kingdom and Ireland for clearing purposes.<br><b>Note</b>: The SEDOL field is only applicable to the trade related transactions<br><br><b>Applicable containers</b>: investment<br>
     */
    sedol?: string
    /**
     * The number of vested shares that can be exercised by the employee. It is usually equal to the vested quantity.<br><b>Note</b>: The vested shares exercisable field is only applicable to employee stock options, restricted stock units/awards, performance units, etc.<br><br><b>Applicable containers</b>: investment<br>
     */
    vestedSharesExercisable?: number // double
    /**
     * The difference between the current market value of a stock and the strike price of the employee stock option, when the market value of the shares are greater than the stock price.<br><b>Note</b>: The spread field is only applicable to employee stock options.<br><br><b>Applicable containers</b>: investment<br>
     */
    spread?: /* Money */ Money
    /**
     * Unique identifier of the account to which the security is linked.<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    accountId?: number // int64
    /**
     * The enrichedDescription is the security description of the normalized holding<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    enrichedDescription?: string
    /**
     * The stated interest rate for a bond.<br><br><b>Applicable containers</b>: investment<br>
     */
    couponRate?: number // double
    /**
     * The date on which the holding is created in the Yodlee system.<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    createdDate?: string
    /**
     * The accruedIncome of the  holding.<br><br><b>Applicable containers</b>: investment<br>
     */
    accruedIncome?: /* Money */ Money
    /**
     * Indicates the security type of holding identified through the security service.<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    securityType?: string
    /**
     * Unique identifier for the user's association with the provider.<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    providerAccountId?: number // int64
    /**
     * Indicates the number of unvested quantity or units.<br><b>Note</b>: The unvested quantity field is only applicable to employee stock options, restricted stock units/awards, performance units, etc.<br><br><b>Applicable containers</b>: investment<br>
     */
    unvestedQuantity?: number // double
    /**
     * In a one-off security purchase, the cost basis is the quantity acquired multiplied by the price per unit paid plus any commission paid. In case, the same position is acquired in different lots on different days at different prices, the sum total of the cost incurred is divided by the total units acquired to arrive at the average cost basis.<br><br><b>Applicable containers</b>: investment<br>
     */
    costBasis?: /* Money */ Money
    /**
     * The date on which a RSU, RSA, or an employee stock options become vested.<br><b>Note</b>: The vesting date field is only applicable to employee stock options, restricted stock units/awards, performance units, etc.<br><br><b>Applicable containers</b>: investment<br>
     */
    vestingDate?: string
    /**
     * The ISIN (International Securities Identification Number) is used worldwide to identify specific securities. It is equivalent to CUSIP for international markets.<br><br><b>Note</b>: The ISIN field is only applicable to the trade related transactions<br><br><b>Applicable containers</b>: investment<br>
     */
    isin?: string
    /**
     * The strike (exercise) price for the option position.<br><b>Note</b>: The strike price field is only applicable to options and employee stock options.<br><br><b>Applicable containers</b>: investment<br>
     */
    strikePrice?: /* Money */ Money
  }
  /**
   * DerivedHoldingSummaryResponse
   */
  export interface DerivedHoldingSummaryResponse {
    holdingSummary?: /* DerivedHoldingsSummary */ DerivedHoldingsSummary[]
    link?: /* DerivedHoldingsLinks */ DerivedHoldingsLinks
  }
  /**
   * DerivedHoldingsAccount
   */
  export interface DerivedHoldingsAccount {
    /**
     * The primary key of the account resource and the unique identifier for the account.<br>Required Feature Enablement: Asset classification feature.<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    id?: number // int64
    /**
     * The investment accounts cash balance.<br>Required Feature Enablement: Asset classification feature.<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    value?: /* Money */ Money
  }
  /**
   * DerivedHoldingsLinks
   */
  export interface DerivedHoldingsLinks {
    holdings?: string
  }
  /**
   * DerivedHoldingsSummary
   */
  export interface DerivedHoldingsSummary {
    /**
     * Securities that belong to the asset classification type and contributed to the summary value.<br><b>Required Feature Enablement</b>: Asset classification feature.<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    holding?: /* DerivedHolding */ DerivedHolding[]
    /**
     * The classification type of the security. The supported asset classification type and the values are provided in the /holdings/assetClassificationList.<br><b>Required Feature Enablement</b>: Asset classification feature.<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    classificationType?: string
    /**
     * The classification value that corresponds to the classification type of the holding. The supported asset classification type and the values are provided in the /holdings/assetClassificationList.<br><b>Required Feature Enablement</b>: Asset classification feature.<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    classificationValue?: string
    /**
     * Summary value of the securities.<br><b>Required Feature Enablement</b>: Asset classification feature.<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    value?: /* Money */ Money
    /**
     * Accounts that contribute to the classification. <br><b>Required Feature Enablement</b>: Asset classification feature.<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    account?: /* DerivedHoldingsAccount */ DerivedHoldingsAccount[]
  }
  /**
   * DerivedNetworth
   */
  export interface DerivedNetworth {
    /**
     * The date as of when the networth information is provided.<br><br><b>Applicable containers</b>: bank, creditcard, investment, insurance, realEstate, loan<br>
     */
    date?: string
    /**
     * The liability amount that the user owes.<br><br><b>Applicable containers</b>: bank, creditcard, investment, insurance, realEstate, loan<br>
     */
    liability?: /* Money */ Money
    /**
     * Balances of the accounts over the period of time.<br><br><b>Applicable containers</b>: bank, creditcard, investment, insurance, realEstate, loan<br>
     */
    historicalBalances?: /* DerivedNetworthHistoricalBalance */ DerivedNetworthHistoricalBalance[]
    /**
     * Networth of the user.<br><br><b>Applicable containers</b>: bank, creditcard, investment, insurance, realEstate, loan<br>
     */
    networth?: /* Money */ Money
    /**
     * The asset value that the user owns.<br><br><b>Applicable containers</b>: bank, creditcard, investment, insurance, realEstate, loan<br>
     */
    asset?: /* Money */ Money
  }
  /**
   * DerivedNetworthHistoricalBalance
   */
  export interface DerivedNetworthHistoricalBalance {
    /**
     * Date for which the account balance was provided.  This balance could be a carryforward, calculated or a scraped balance. AdditIonal Details: scraped: Balance shown in the provider site. This balance gets stored in Yodlee system during system/user account updates. carryForward : Balance carried forward from the scraped balance to the days for which the balance was not available in the system. Balance may not be available for all the days in the system due to MFA information required, error in the site, credential changes, etc. calculated: Balances that gets calculated for the days that are prior to the account added date.<br><br><b>Account Type</b>: Aggregated and Manual<br><b>Applicable containers</b>: bank, creditCard, investment, insurance, realEstate, loan<br><b>Endpoints</b>:<ul><li>GET accounts/historicalBalances</li><li>GET derived/networth</li></ul>
     */
    date?: string
    accountId?: number // int64
    /**
     * Indicates whether the balance is an asset or liability.<br><br><b>Account Type</b>: Aggregated and Manual<br><b>Applicable containers</b>: bank, creditCard, investment, insurance, realEstate, loan<br><b>Endpoints</b>:<ul><li>GET accounts/historicalBalances</li></ul>
     */
    isAsset?: boolean
    /**
     * Balance amount of the account.<br><br><b>Account Type</b>: Aggregated and Manual<br><b>Applicable containers</b>: bank, creditCard, investment, insurance, realEstate, loan<br><b>Endpoints</b>:<ul><li>GET accounts/historicalBalances</li></ul>
     */
    balance?: /* Money */ Money
    /**
     * Date as of when the balance is last  updated due to the auto account updates or user triggered updates. This balance will be carry forward for the days where there is no balance available in the system. <br><br><b>Account Type</b>: Aggregated and Manual<br><b>Applicable containers</b>: bank, creditCard, investment, insurance, realEstate, loan<br><b>Endpoints</b>:<ul><li>GET accounts/historicalBalances</li></ul>
     */
    asOfDate?: string
    /**
     * The source of balance information.<br><br><b>Account Type</b>: Aggregated and Manual<br><b>Applicable containers</b>: bank, creditCard, investment, insurance, realEstate, loan<br><b>Endpoints</b>:<ul><li>GET accounts/historicalBalances</li></ul><b>Applicable Values</b><br>
     */
    dataSourceType?: 'S' | 'C' | 'CF'
  }
  /**
   * DerivedNetworthResponse
   */
  export interface DerivedNetworthResponse {
    networth?: /* DerivedNetworth */ DerivedNetworth[]
  }
  /**
   * DerivedTransactionSummaryResponse
   */
  export interface DerivedTransactionSummaryResponse {
    links?: /* DerivedTransactionsLinks */ DerivedTransactionsLinks
    transactionSummary?: /* DerivedTransactionsSummary */ DerivedTransactionsSummary[]
  }
  /**
   * DerivedTransactionsLinks
   */
  export interface DerivedTransactionsLinks {
    /**
     * Link of the transaction API service that corresponds to the value derivation.<br><br><b>Applicable containers</b>: creditCard, bank, investment<br>
     */
    transactions?: string
  }
  /**
   * DerivedTransactionsSummary
   */
  export interface DerivedTransactionsSummary {
    /**
     * Type of categories provided by transactions/categories service.<br><br><b>Applicable containers</b>: creditCard, bank, investment<br><b>Applicable Values</b><br>
     */
    categoryType?:
      | 'TRANSFER'
      | 'DEFERRED_COMPENSATION'
      | 'UNCATEGORIZE'
      | 'INCOME'
      | 'EXPENSE'
    /**
     * Summary of transaction amouts at category level.<br><br><b>Applicable containers</b>: creditCard, bank, investment<br>
     */
    categorySummary?: /* DerivedCategorySummary */ DerivedCategorySummary[]
    /**
     * The total of credit transactions for the category type.<br><br><b>Applicable containers</b>: creditCard, bank, investment<br>
     */
    creditTotal?: /* Money */ Money
    /**
     * Link of the API services that corresponds to the value derivation.<br><br><b>Applicable containers</b>: creditCard, bank, investment<br>
     */
    links?: /* DerivedTransactionsLinks */ DerivedTransactionsLinks
    /**
     * The total of debit transactions for the category type.<br><br><b>Applicable containers</b>: creditCard, bank, investment<br>
     */
    debitTotal?: /* Money */ Money
  }
  /**
   * Description
   */
  export interface Description {
    /**
     * The description will provide the actual name of the security.<br><br><b>Applicable containers</b>: investment<br>
     */
    security?: string
    /**
     * Original transaction description as it appears at the FI site.<br><br><b>Applicable containers</b>: creditCard, insurance, loan<br>
     */
    original?: string
    /**
     * The transaction description that appears at the FI site may not be self-explanatory, i.e., the source, purpose of the transaction may not be evident. Yodlee attempts to simplify and make the transaction meaningful to the consumer, and this simplified transaction description is provided in the simple description field.Note: The simple description field is available only in the United States, Canada, United Kingdom, and India.<br><br><b>Applicable containers</b>: creditCard, insurance, loan<br>
     */
    simple?: string
    /**
     * The description of the transaction as defined by the consumer. The consumer can define or provide more details of the transaction in this field.<br><br><b>Applicable containers</b>: creditCard, insurance, loan<br>
     */
    consumer?: string
  }
  /**
   * DetailCategory
   */
  export interface DetailCategory {
    /**
     * The name of the detail category<br><br><b>Applicable containers</b>: creditCard, investment, insurance, loan<br>
     */
    name?: string
    /**
     * The unique identifier of the detail category.<br><br><b>Applicable containers</b>: creditCard, investment, insurance, loan<br>
     */
    id?: number // int64
  }
  /**
   * Document
   */
  export interface Document {
    /**
     * The unique identifier for the account. The account ID to which the document is linked.<br><br><b>Applicable containers</b>: bank, investment, creditCard, loan, insurance<br>
     */
    accountID?: number // int64
    /**
     * Indicates the date and time the document was last updated.<br><br><b>Applicable containers</b>: bank, investment, creditCard, loan, insurance<br>
     */
    lastUpdated?: string
    /**
     * Indicates the type of the tax form.<br><br><b>Applicable containers</b>: bank, investment, creditCard, loan, insurance<br>
     */
    formType?: string
    /**
     * Indicates the type of the document.<br><br><b>Applicable containers</b>: bank, investment, creditCard, loan, insurance<br>
     */
    docType?: 'STMT' | 'TAX' | 'EBILL'
    /**
     * Indicates the name of the document.<br><br><b>Applicable containers</b>: bank, investment, creditCard, loan, insurance<br>
     */
    name?: string
    /**
     * The document's primary key and unique identifier.<br><br><b>Applicable containers</b>: bank, investment, creditCard, loan, insurance<br>
     */
    id?: string
    /**
     * Indicates the source of the document download.<br><br><b>Applicable containers</b>: bank, investment, creditCard, loan, insurance<br>
     */
    source?: string
    /**
     * Indicates the status of the document download.<br><br><b>Applicable containers</b>: bank, investment, creditCard, loan, insurance<br>
     */
    status?: string
  }
  /**
   * DocumentDownload
   */
  export interface DocumentDownload {
    /**
     * Contents of the document in Base64 format.<br><br><b>Applicable containers</b>: bank, investment, creditCard, loan, insurance<br>
     */
    docContent?: string
    /**
     * The document's primary key and unique identifier.<br><br><b>Applicable containers</b>: bank, investment, creditCard, loan, insurance<br>
     */
    id?: string
  }
  /**
   * DocumentDownloadResponse
   */
  export interface DocumentDownloadResponse {
    document?: /* DocumentDownload */ DocumentDownload[]
  }
  /**
   * DocumentResponse
   */
  export interface DocumentResponse {
    document?: /* Document */ Document[]
  }
  /**
   * Email
   */
  export interface Email {
    type?: 'PRIMARY' | 'SECONDARY' | 'PERSONAL' | 'WORK' | 'OTHERS'
    value?: string
  }
  /**
   * EnrichDataAccount
   */
  export interface EnrichDataAccount {
    /**
     * The amount that is available for an ATM withdrawal, i.e., the cash available after deducting the amount that is already withdrawn from the total cash limit. (totalCashLimit-cashAdvance= availableCash)<br><b>Additional Details:</b> The available cash amount at the account-level can differ from the available cash at the statement-level, as the information in the aggregated card account data provides more up-to-date information.<br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: creditCard<br><b>Endpoints</b>:<br><ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li><li>POST dataEnrich/userData</li></ul>
     */
    availableCash?: /* Money */ Money
    /**
     * The type of service. E.g., Bank, Credit Card, Investment, Insurance, etc.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: All containers<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li><li>POST dataEnrich/userData</li></ul><b>Applicable Values</b><br>
     */
    container?:
      | 'bank'
      | 'creditCard'
      | 'investment'
      | 'insurance'
      | 'loan'
      | 'reward'
      | 'bill'
      | 'realEstate'
      | 'otherAssets'
      | 'otherLiabilities'
    /**
     * <br><b>Credit Card:</b> Amount that is available to spend on the credit card. It is usually the Total credit line- Running balance- pending charges. <br><b>Loan:</b> The unused portion of  line of credit, on a revolving loan (such as a home-equity line of credit).<br><b>Additional Details:</b><br><b>Note:</b> The available credit amount at the account-level can differ from the available credit field at the statement-level, as the information in the aggregated card account data provides more up-to-date information.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: creditCard, loan<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li><li>POST dataEnrich/userData</li></ul>
     */
    availableCredit?: /* Money */ Money
    /**
     * The account name as it appears at the site.<br>(The POST accounts service response return this field as name)<br><b>Applicable containers</b>: All Containers<br><b>Aggregated / Manual</b>: Both <br><b>Endpoints</b>:<br><ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li><li>POST dataEnrich/userData</li></ul>
     */
    accountName?: string
    /**
     * The type of account that is aggregated, i.e., savings, checking, credit card, charge, HELOC, etc. The account type is derived based on the attributes of the account. <br><b>Valid Values:</b><br><b>Aggregated Account Type</b><br><b>bank</b><ul><li>CHECKING</li><li>SAVINGS</li><li>CD</li><li>PPF</li><li>RECURRING_DEPOSIT</li><li>FSA</li><li>MONEY_MARKET</li><li>IRA</li><li>PREPAID</li></ul><b>creditCard</b><ul><li>OTHER</li><li>CREDIT</li><li>STORE</li><li>CHARGE</li><li>OTHER</li></ul><b>investment (SN 1.0)</b><ul><li>BROKERAGE_MARGIN</li><li>HSA</li><li>IRA</li><li>BROKERAGE_CASH</li><li>401K</li><li>403B</li><li>TRUST</li><li>ANNUITY</li><li>SIMPLE</li><li>CUSTODIAL</li><li>BROKERAGE_CASH_OPTION</li><li>BROKERAGE_MARGIN_OPTION</li><li>INDIVIDUAL</li><li>CORPORATE</li><li>JTTIC</li><li>JTWROS</li><li>COMMUNITY_PROPERTY</li><li>JOINT_BY_ENTIRETY</li><li>CONSERVATORSHIP</li><li>ROTH</li><li>ROTH_CONVERSION</li><li>ROLLOVER</li><li>EDUCATIONAL</li><li>529_PLAN</li><li>457_DEFERRED_COMPENSATION</li><li>401A</li><li>PSP</li><li>MPP</li><li>STOCK_BASKET</li><li>LIVING_TRUST</li><li>REVOCABLE_TRUST</li><li>IRREVOCABLE_TRUST</li><li>CHARITABLE_REMAINDER</li><li>CHARITABLE_LEAD</li><li>CHARITABLE_GIFT_ACCOUNT</li><li>SEP</li><li>UTMA</li><li>UGMA</li><li>ESOPP</li><li>ADMINISTRATOR</li><li>EXECUTOR</li><li>PARTNERSHIP</li><li>SOLE_PROPRIETORSHIP</li><li>CHURCH</li><li>INVESTMENT_CLUB</li><li>RESTRICTED_STOCK_AWARD</li><li>CMA</li><li>EMPLOYEE_STOCK_PURCHASE_PLAN</li><li>PERFORMANCE_PLAN</li><li>BROKERAGE_LINK_ACCOUNT</li><li>MONEY_MARKET</li><li>SUPER_ANNUATION</li><li>REGISTERED_RETIREMENT_SAVINGS_PLAN</li><li>SPOUSAL_RETIREMENT_SAVINGS_PLAN</li><li>DEFERRED_PROFIT_SHARING_PLAN</li><li>NON_REGISTERED_SAVINGS_PLAN</li><li>REGISTERED_EDUCATION_SAVINGS_PLAN</li><li>GROUP_RETIREMENT_SAVINGS_PLAN</li><li>LOCKED_IN_RETIREMENT_SAVINGS_PLAN</li><li>RESTRICTED_LOCKED_IN_SAVINGS_PLAN</li><li>LOCKED_IN_RETIREMENT_ACCOUNT</li><li>REGISTERED_PENSION_PLAN</li><li>TAX_FREE_SAVINGS_ACCOUNT</li><li>LIFE_INCOME_FUND</li><li>REGISTERED_RETIREMENT_INCOME_FUND</li><li>SPOUSAL_RETIREMENT_INCOME_FUND</li><li>LOCKED_IN_REGISTERED_INVESTMENT_FUND</li><li>PRESCRIBED_REGISTERED_RETIREMENT_INCOME_FUND</li><li>GUARANTEED_INVESTMENT_CERTIFICATES</li><li>REGISTERED_DISABILITY_SAVINGS_PLAN</li><li>DIGITAL_WALLET</li><li>OTHER</li></ul><b>investment (SN 2.0)</b><ul><li>BROKERAGE_CASH</li><li>BROKERAGE_MARGIN</li><li>INDIVIDUAL_RETIREMENT_ACCOUNT_IRA</li><li>EMPLOYEE_RETIREMENT_ACCOUNT_401K</li><li>EMPLOYEE_RETIREMENT_SAVINGS_PLAN_403B</li><li>TRUST</li><li>ANNUITY</li><li>SIMPLE_IRA</li><li>CUSTODIAL_ACCOUNT</li><li>BROKERAGE_CASH_OPTION</li><li>BROKERAGE_MARGIN_OPTION</li><li>INDIVIDUAL</li><li>CORPORATE_INVESTMENT_ACCOUNT</li><li>JOINT_TENANTS_TENANCY_IN_COMMON_JTIC</li><li>JOINT_TENANTS_WITH_RIGHTS_OF_SURVIVORSHIP_JTWROS</li><li>JOINT_TENANTS_COMMUNITY_PROPERTY</li><li>JOINT_TENANTS_TENANTS_BY_ENTIRETY</li><li>CONSERVATOR</li><li>ROTH_IRA</li><li>ROTH_CONVERSION</li><li>ROLLOVER_IRA</li><li>EDUCATIONAL</li><li>EDUCATIONAL_SAVINGS_PLAN_529</li><li>DEFERRED_COMPENSATION_PLAN_457</li><li>MONEY_PURCHASE_RETIREMENT_PLAN_401A</li><li>PROFIT_SHARING_PLAN</li><li>MONEY_PURCHASE_PLAN</li><li>STOCK_BASKET_ACCOUNT</li><li>LIVING_TRUST</li><li>REVOCABLE_TRUST</li><li>IRREVOCABLE_TRUST</li><li>CHARITABLE_REMAINDER_TRUST</li><li>CHARITABLE_LEAD_TRUST</li><li>CHARITABLE_GIFT_ACCOUNT</li><li>SEP_IRA</li><li>UNIFORM_TRANSFER_TO_MINORS_ACT_UTMA</li><li>UNIFORM_GIFT_TO_MINORS_ACT_UGMA</li><li>EMPLOYEE_STOCK_OWNERSHIP_PLAN_ESOP</li><li>ADMINISTRATOR</li><li>EXECUTOR</li><li>PARTNERSHIP</li><li>PROPRIETORSHIP</li><li>CHURCH_ACCOUNT</li><li>INVESTMENT_CLUB</li><li>RESTRICTED_STOCK_AWARD</li><li>CASH_MANAGEMENT_ACCOUNT</li><li>EMPLOYEE_STOCK_PURCHASE_PLAN_ESPP</li><li>PERFORMANCE_PLAN</li><li>BROKERAGE_LINK_ACCOUNT</li><li>MONEY_MARKET_ACCOUNT</li><li>SUPERANNUATION</li><li>REGISTERED_RETIREMENT_SAVINGS_PLAN_RRSP</li><li>SPOUSAL_RETIREMENT_SAVINGS_PLAN_SRSP</li><li>DEFERRED_PROFIT_SHARING_PLAN_DPSP</li><li>NON_REGISTERED_SAVINGS_PLAN_NRSP</li><li>REGISTERED_EDUCATION_SAVINGS_PLAN_RESP</li><li>GROUP_RETIREMENT_SAVINGS_PLAN_GRSP</li><li>LOCKED_IN_RETIREMENT_SAVINGS_PLAN_LRSP</li><li>RESTRICTED_LOCKED_IN_SAVINGS_PLAN_RLSP</li><li>LOCKED_IN_RETIREMENT_ACCOUNT_LIRA</li><li>REGISTERED_PENSION_PLAN_RPP</li><li>TAX_FREE_SAVINGS_ACCOUNT_TFSA</li><li>LIFE_INCOME_FUND_LIF</li><li>REGISTERED_RETIREMENT_INCOME_FUND_RIF</li><li>SPOUSAL_RETIREMENT_INCOME_FUND_SRIF</li><li>LOCKED_IN_REGISTERED_INVESTMENT_FUND_LRIF</li><li>PRESCRIBED_REGISTERED_RETIREMENT_INCOME_FUND_PRIF</li><li>GUARANTEED_INVESTMENT_CERTIFICATES_GIC</li><li>REGISTERED_DISABILITY_SAVINGS_PLAN_RDSP</li><li>DEFINED_CONTRIBUTION_PLAN</li><li>DEFINED_BENEFIT_PLAN</li><li>EMPLOYEE_STOCK_OPTION_PLAN</li><li>NONQUALIFIED_DEFERRED_COMPENSATION_PLAN_409A</li><li>KEOGH_PLAN</li><li>EMPLOYEE_RETIREMENT_ACCOUNT_ROTH_401K</li><li>DEFERRED_CONTINGENT_CAPITAL_PLAN_DCCP</li><li>EMPLOYEE_BENEFIT_PLAN</li><li>EMPLOYEE_SAVINGS_PLAN</li><li>HEALTH_SAVINGS_ACCOUNT_HSA</li><li>COVERDELL_EDUCATION_SAVINGS_ACCOUNT_ESA</li><li>TESTAMENTARY_TRUST</li><li>ESTATE</li><li>GRANTOR_RETAINED_ANNUITY_TRUST_GRAT</li><li>ADVISORY_ACCOUNT</li><li>NON_PROFIT_ORGANIZATION_501C</li><li>HEALTH_REIMBURSEMENT_ARRANGEMENT_HRA</li><li>INDIVIDUAL_SAVINGS_ACCOUNT_ISA</li><li>CASH_ISA</li><li>STOCKS_AND_SHARES_ISA</li><li>INNOVATIVE_FINANCE_ISA</li><li>JUNIOR_ISA</li><li>EMPLOYEES_PROVIDENT_FUND_ORGANIZATION_EPFO</li><li>PUBLIC_PROVIDENT_FUND_PPF</li><li>EMPLOYEES_PENSION_SCHEME_EPS</li><li>NATIONAL_PENSION_SYSTEM_NPS</li><li>INDEXED_ANNUITY</li><li>ANNUITIZED_ANNUITY</li><li>VARIABLE_ANNUITY</li><li>ROTH_403B</li><li>SPOUSAL_IRA</li><li>SPOUSAL_ROTH_IRA</li><li>SARSEP_IRA</li><li>SUBSTANTIALLY_EQUAL_PERIODIC_PAYMENTS_SEPP</li><li>OFFSHORE_TRUST</li><li>IRREVOCABLE_LIFE_INSURANCE_TRUST</li><li>INTERNATIONAL_TRUST</li><li>LIFE_INTEREST_TRUST</li><li>EMPLOYEE_BENEFIT_TRUST</li><li>PRECIOUS_METAL_ACCOUNT</li><li>INVESTMENT_LOAN_ACCOUNT</li><li>GRANTOR_RETAINED_INCOME_TRUST</li><li>PENSION_PLAN</li><li>DIGITAL_WALLET</li><li>OTHER</li></ul><b>bill</b><ul><li>TELEPHONE</li><li>UTILITY</li><li>CABLE</li><li>WIRELESS</li><li>BILLS</li></ul><b>loan</b><ul><li>MORTGAGE</li><li>INSTALLMENT_LOAN</li><li>PERSONAL_LOAN</li><li>HOME_EQUITY_LINE_OF_CREDIT</li><li>LINE_OF_CREDIT</li><li>AUTO_LOAN</li><li>STUDENT_LOAN</li><li>HOME_LOAN</li></ul><b>insurance</b><ul><li>AUTO_INSURANCE</li><li>HEALTH_INSURANCE</li><li>HOME_INSURANCE</li><li>LIFE_INSURANCE</li><li>ANNUITY</li><li>TRAVEL_INSURANCE</li><li>INSURANCE</li></ul><b>realEstate</b><ul> <li>REAL_ESTATE</li></ul><b>reward</b><ul><li>REWARD_POINTS</li></ul><b>Manual Account Type</b><br><b>bank</b><ul><li>CHECKING</li><li>SAVINGS</li><li>CD</li><li>PREPAID</li></ul><b>credit</b><ul>  <li>CREDIT</li></ul><b>loan</b><ul>  <li>PERSONAL_LOAN</li><li>HOME_LOAN</li></ul><b>bill</b><ul><li>BILLS</li></ul><b>insurance</b><ul><li>INSURANCE</li><li>ANNUITY</li></ul><b>investment</b><ul><li>BROKERAGE_CASH</li></ul><br><br><b>Aggregated / Manual</b>: Both <br><b>Applicable containers</b>: All containers<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li><li>POST dataEnrich/userData</li></ul>
     */
    accountType?: string
    /**
     * The balance in the account that is available at the beginning of the business day; it is equal to the ledger balance of the account.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: bank<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    currentBalance?: /* Money */ Money
    /**
     * The name or identification of the account owner, as it appears at the FI site. <br><b>Note:</b> The account holder name can be full or partial based on how it is displayed in the account summary page of the FI site. In most cases, the FI site does not display the full account holder name in the account summary page.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: bank, creditCard, investment, insurance, loan, bill, reward<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li><li>POST dataEnrich/userData</li></ul>
     */
    displayedName?: string
    /**
     * The date on which the due amount has to be paid. <br><b>Additional Details:</b><br><b>Credit Card:</b> The monthly date by when the minimum payment is due to be paid on the credit card account. <br><b>Loan:</b> The date on or before which the due amount should be paid.<br><b>Note:</b> The due date at the account-level can differ from the due date field at the statement-level, as the information in the aggregated card account data provides an up-to-date information to the consumer.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: creditCard, loan, insurance, bill<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li><li>POST dataEnrich/userData</li></ul>
     */
    dueDate?: string
    /**
     * The account number as it appears on the site. (The POST accounts service response return this field as number)<br><b>Additional Details</b>:<b> Bank/ Loan/ Insurance/ Investment/Bill</b>:<br> The account number for the bank account as it appears at the site.<br><b>Credit Card</b>: The account number of the card account as it appears at the site,<br>i.e., the card number.The account number can be full or partial based on how it is displayed in the account summary page of the site.In most cases, the site does not display the full account number in the account summary page and additional navigation is required to aggregate it.<br><b>Applicable containers</b>: All Containers<br><b>Aggregated / Manual</b>: Both <br><b>Endpoints</b>:<br><ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>POST accounts</li><li>GET dataExtracts/userData</li><li>POST dataEnrich/userData</li></ul>
     */
    accountNumber?: string
    accountHolderName?: string
    /**
     * The status of the account that is updated by the consumer through an application or an API. Valid Values: AccountStatus<br><b>Additional Details:</b><br><b>ACTIVE:</b> All the added manual and aggregated accounts status will be made "ACTIVE" by default. <br><b>TO_BE_CLOSED:</b> If the aggregated accounts are not found or closed in the data provider site, Yodlee system marks the status as TO_BE_CLOSED<br><b>INACTIVE:</b> Users can update the status as INACTIVE to stop updating and to stop considering the account in other services<br><b>CLOSED:</b> Users can update the status as CLOSED, if the account is closed with the provider. <br><br><b>Aggregated / Manual</b>: Both <br><b>Applicable containers</b>: All containers<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li><li>POST dataEnrich/userData</li></ul><b>Applicable Values</b><br>
     */
    accountStatus?:
      | 'ACTIVE'
      | 'INACTIVE'
      | 'TO_BE_CLOSED'
      | 'CLOSED'
      | 'DELETED'
    /**
     * The amount due to be paid for the account.<br><b>Additional Details:</b><b>Credit Card:</b> The total amount due for the purchase of goods or services that must be paid by the due date.<br><b>Loan:</b> The amount due to be paid on the due date.<br><b>Note:</b> The amount due at the account-level can differ from the amount due at the statement-level, as the information in the aggregated card account data provides more up-to-date information.<br><b>Applicable containers</b>: creditCard, loan, insurance, bill<br><b>Aggregated / Manual</b>: Both <br><b>Endpoints</b>:<br><ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li><li>POST dataEnrich/userData</li></ul>
     */
    amountDue?: /* Money */ Money
    /**
     * The loginName of the User.<br><br><b>Applicable containers</b>: bank,creditCard<br>
     */
    userLoginName?: string
    asOfDate?: string
    /**
     * The minimum amount due is the lowest amount of money that a consumer is required to pay each month.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: creditCard, insurance, bill, loan<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li><li>POST dataEnrich/userData</li></ul>
     */
    minimumAmountDue?: /* Money */ Money
  }
  /**
   * EnrichDataRequest
   */
  export interface EnrichDataRequest {
    userData?: /* EnrichUserData */ EnrichUserData
  }
  /**
   * EnrichDataTransaction
   */
  export interface EnrichDataTransaction {
    /**
     * The account's container.<br><br><b>Applicable containers</b>: bank,creditCard<br><b>Applicable Values</b><br>
     */
    container?:
      | 'bank'
      | 'creditCard'
      | 'investment'
      | 'insurance'
      | 'loan'
      | 'reward'
      | 'bill'
      | 'realEstate'
      | 'otherAssets'
      | 'otherLiabilities'
    /**
     * A unique ID that the provider site has assigned to the transaction. The source ID is only available for the pre-populated accounts.<br>Pre-populated accounts are the accounts that the FI customers shares with Yodlee, so that the user does not have to add or aggregate those accounts.
     */
    sourceId?: string
    /**
     * The amount of the transaction as it appears at the FI site. <br><br><b>Applicable containers</b>: bank,creditCard<br>
     */
    amount?: /* Money */ Money
    /**
     * Description details<br><br><b>Applicable containers</b>: bank,creditCard<br>
     */
    description?: /* Description */ Description
    /**
     * The date on which the transaction is posted to the account.<br><br><b>Applicable containers</b>: bank,creditCard<br>
     */
    postDate?: string
    /**
     * The loginName of the User.<br><br><b>Applicable containers</b>: bank,creditCard<br>
     */
    userLoginName?: string
    /**
     * The account number as it appears on the site. (The POST accounts service response return this field as number)<br><b>Additional Details</b>:<b> Bank/ Loan/ Insurance/ Investment/Bill</b>:<br> The account number for the bank account as it appears at the site.<br><b>Credit Card</b>: The account number of the card account as it appears at the site,<br>i.e., the card number.The account number can be full or partial based on how it is displayed in the account summary page of the site.In most cases, the site does not display the full account number in the account summary page and additional navigation is required to aggregate it.<br><b>Applicable containers</b>: All Containers<br><b>Aggregated / Manual</b>: Both <br><b>Endpoints</b>:<br><ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>POST accounts</li><li>POST dataExtracts/userData</li><li>POST dataEnrich/userData</li></ul>
     */
    accountNumber?: string
    /**
     * The date the transaction happens in the account. <br><br><b>Applicable containers</b>: bank,creditCard<br>
     */
    transactionDate?: string
    /**
     * Indicates if the transaction appears as a debit or a credit transaction in the account. <br><br><b>Applicable containers</b>: bank,creditCard<br><b>Applicable Values</b><br>
     */
    baseType?: 'CREDIT' | 'DEBIT'
    status?: 'POSTED' | 'PENDING' | 'SCHEDULED' | 'FAILED' | 'CLEARED'
  }
  /**
   * EnrichDataUser
   */
  export interface EnrichDataUser {
    preferences?: /* UserRequestPreferences */ UserRequestPreferences
    address?: /* UserAddress */ UserAddress
    loginName: string // [^\s]+
    name?: /* Name */ Name
    email: string
    segmentName?: string
  }
  /**
   * EnrichUserData
   */
  export interface EnrichUserData {
    user: /* EnrichDataUser */ EnrichDataUser[]
    account: /* EnrichDataAccount */ EnrichDataAccount[]
    transaction: /* EnrichDataTransaction */ EnrichDataTransaction[]
  }
  /**
   * EnrichedTransaction
   */
  export interface EnrichedTransaction {
    /**
     * The account's container.<br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br><b>Applicable Values</b><br>
     */
    container?:
      | 'bank'
      | 'creditCard'
      | 'investment'
      | 'insurance'
      | 'loan'
      | 'reward'
      | 'bill'
      | 'realEstate'
      | 'otherAssets'
      | 'otherLiabilities'
    /**
     * A unique ID that the provider site has assigned to the transaction. The source ID is only available for the pre-populated accounts.<br>Pre-populated accounts are the accounts that the FI customers shares with Yodlee, so that the user does not have to add or aggregate those accounts.
     */
    sourceId?: string
    /**
     * City of the merchant.<br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>
     */
    merchantCity?: string
    /**
     * The high level category assigned to the transaction. The supported values are provided by the GET transactions/categories. <br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>
     */
    highLevelCategoryId?: number // int64
    /**
     * The id of the detail category that is assigned to the transaction. The supported values are provided by GET transactions/categories.<br><br><b>Applicable containers</b>: bank,creditCard<br>
     */
    detailCategoryId?: number // int64
    /**
     * The nature of the transaction, i.e., deposit, refund, payment, etc.<br><b>Note</b>: The transaction type field is available only for the United States, Canada, United Kingdom, and India based provider sites. <br><br><b>Applicable containers</b>: bank,creditCard,investment<br>
     */
    type?:
      | 'CREDIT'
      | 'DEBIT'
      | 'BUY'
      | 'SELL'
      | 'DIVIDEND_PAYMENT'
      | 'DIVIDEND_REINVESTMENT'
      | 'MISCELLANEOUS_INCOME'
      | 'INTEREST_INCOME'
      | 'INTEREST_REINVESTMENT'
      | 'LONG_TERM_CAPITAL_GAINS_DISTRIBUTION'
      | 'REINVEST_LONG_TERM_CAPITAL_GAINS'
      | 'SHORT_TERM_CAPITAL_GAINS_DISTRIBUTION'
      | 'REINVEST_SHORT_TERM_CAPITAL_GAINS'
      | 'SHARES_IN'
      | 'SHARES_OUT'
      | 'TRANSFER_CASH_IN'
      | 'TRANSFER_CASH_OUT'
      | 'STOCK_SPLIT'
      | 'RETURN_OF_CAPITAL'
      | 'MISCELLANEOUS_EXPENSE'
      | 'TRANSFER_SHARES_IN'
      | 'TRANSFER_SHARES_OUT'
      | 'MARGIN_INTEREST_EXPENSE'
      | 'REMINDER'
      | 'CORPORATE_ACQUISITION'
      | 'STOCK_DIVIDEND'
      | 'SHORT_SELL'
      | 'BOND_CALL'
      | 'BOND_MATURES'
      | 'BUY_TO_COVER'
      | 'BUY_OPTION'
      | 'SELL_OPTION'
      | 'EXERCISE_OPTION'
      | 'ASSIGN_OPTION'
      | 'EXPIRE_OPTION'
      | 'OTHER'
      | 'SWEEP'
      | 'CAPITAL_GAINS_REINVESTED'
      | '_1035_EXCHANGE'
      | '_401K_CONTRIBUTION'
      | '_401K_EMPLOYER_CONTRIBUTION'
      | 'LOAN_DISTRIBUTION'
      | 'LOAN_PAYMENT'
      | 'PENALTY'
      | 'ACCOUNT_FEE'
      | 'ACCOUNT_MAINTENANCE_FEE'
      | 'ACCUMULATION'
      | 'ACH_OUT'
      | 'ADJUSTED_BUY'
      | 'ADJUSTED_SELL'
      | 'ADMINISTRATIVE_FEE'
      | 'ANNUITY_CREDIT'
      | 'ATM_FEE'
      | 'ATM_WITHDRAWAL'
      | 'ATM_WITHDRAWAL_FEE'
      | 'ATM_WITHDRAWAL_FEE_CREDIT'
      | 'AUTOMATIC_INVESTMENT'
      | 'BAD_CHECK'
      | 'BILL_PAY'
      | 'BILL_PAY_IN'
      | 'BILL_PAY_OUT'
      | 'BUY_ACCRUED_INTEREST'
      | 'BUY_TO_CLOSE'
      | 'BUY_TO_OPEN'
      | 'CAPITAL_GAINS_RECIEVED'
      | 'CHARGE'
      | 'CHARGE_CREDIT'
      | 'CHECK'
      | 'CHECKBOOK_REORDER_FEE'
      | 'CREDIT_IN_LIEU_OF_FRACTIONAL_SHARE'
      | 'CS_ADJUSTMENT'
      | 'DEATH_BENEFIT_PAYOUT'
      | 'DEFERRED_COMPENSATION_CONTRIBUTION'
      | 'DEFERRED_COMPENSATION_DISTRIBUTION'
      | 'DEPOSIT'
      | 'DIRECT_DEPOSIT'
      | 'EDUCATIONAL_PLAN_CONTRIBUTION'
      | 'ESOP_ALLOCATION'
      | 'FEDERAL_TAX_FREE_DIVIDEND'
      | 'FEDEX_FEE'
      | 'FED_TAX_WITHHELD'
      | 'FOREIGN_TAX'
      | 'FOREIGN_TAX_CREDIT'
      | 'FRACTIONAL_SHARE_LIQUIDATION'
      | 'FUND_EXCHANGE'
      | 'FUND_EXPENSE'
      | 'IRA_CONTRIBUTION'
      | 'IRA_DISTRIBUTION'
      | 'IRA_NON_QUALIFIED_DISTRIBUTION'
      | 'MERGER'
      | 'MISC_CREDIT'
      | 'MISC_JRL_CASHTO_MARGIN'
      | 'MISC_JRL_MARGIN_TO_CASH'
      | 'MMF_DIVIDEND'
      | 'MMF_IN'
      | 'MMF_LIQ'
      | 'MMF_REIN'
      | 'MMF_SWEEP'
      | 'MMF_TRANSACTION'
      | 'MONEY_FUNDS_JOURNAL_CASH_TO_MARGIN'
      | 'MONEY_FUNDS_JOURNAL_MARGIN_TO_CASH'
      | 'MORTALITY_AND_EXPENSE_RISK_CHARGE'
      | 'NAME_CHANGE'
      | 'NSF_FEE'
      | 'ORDER_OUT'
      | 'ORDER_OUT_FEE'
      | 'OTHER_ANNUITY_FEE'
      | 'PAYOUT'
      | 'REORGANIZATION_CHARGE'
      | 'RETURNED_CHECK_FEE'
      | 'ROLLOVER_CONTRIBUTION'
      | 'ROTH_CONTRIBUTION'
      | 'RTQ_FEE'
      | 'SELL_ACCRUED_INTEREST'
      | 'SELL_TO_CLOSE'
      | 'SELL_TO_OPEN'
      | 'SEP_CONTRIBUTION'
      | 'SIMPLE_PLAN_CONTRIBUTION'
      | 'SPINOFF'
      | 'STATE_TAX_FREE_DIVIDEND'
      | 'STATE_TAX_WITHHELD'
      | 'STAX'
      | 'STOCK_FUND_OPTION_JOURNAL_CASH_TO_MARGIN'
      | 'STOCK_FUND_OPTION_JOURNAL_MARGIN_TO_CASH'
      | 'STOCK_OPTION_EXERCISE'
      | 'STOCK_OPTION_WITHHOLDING'
      | 'SURRENDER_CHARGE'
      | 'SYMBOL_CHANGE'
      | 'TAX_FREE_DIVIDEND'
      | 'WIRE_FEE'
      | 'WIRE_FUNDS_IN'
      | 'WIRE_FUNDS_OUT'
      | 'WORTHLESS_SECURITIES'
      | '_529_PLAN_CONTRIBUTION'
      | 'ADJUSTED_ASSIGN'
      | 'REVERSAL'
      | 'DVP'
      | 'RVP'
      | 'ADJUSTMENT'
      | 'ADJUSTED_CREDIT'
      | 'ADJUSTED_DEBIT'
      | 'TENDERED'
      | 'ESOP_ALLOCATION_1'
      | 'EXCESS_CONTRIBUTION'
      | 'RECHARACTERIZATION'
      | 'CONVERSION'
      | 'ROLLOVER_TO_QUAL'
      | 'FEDERAL_TAX_FREE_INTEREST_INCOME'
      | 'STATE_TAX_FREE_INTEREST_INCOME'
      | 'FORFEITURE'
      | 'WITHDRAWAL'
      | 'LOAN_WITHDRAWAL'
      | 'BALANCE_FORWARD'
      | 'GENERIC_CONTRIBUTION'
      | 'CAPITAL_CALLS'
      | 'DISTRIBUTIONS_OUT'
      | 'PRINCIPAL_PAYMENT'
    /**
     * State of the merchant.<br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>
     */
    merchantState?: string
    /**
     * An unique identifier for the transaction. The combination of the id and account container are unique in the system. <br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>
     */
    transactionId?: number // int64
    /**
     * The name of the merchant.<br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>
     */
    merchantName?: string
    /**
     * Identifier of the merchant.<br><br><b>Applicable containers</b>: bank,creditCard<br>
     */
    merchantId?: string
    /**
     * The transaction description that appears at the FI site may not be self-explanatory, i.e., the source, purpose of the transaction may not be evident. Yodlee attempts to simplify and make the transaction meaningful to the consumer, and this simplified transaction description is provided in the simple description field.Note: The simple description field is available only in the United States, Canada, United Kingdom, and India.<br><br><b>Applicable containers</b>: bill, creditCard, insurance, loan<br>
     */
    simpleDescription?: string
    /**
     * The transaction subtype field provides a detailed transaction type. For example, purchase is a transaction type and the transaction subtype field indicates if the purchase was made using a debit or credit card.<br><b>Note</b>: The transaction subtype field is available only in the United States, Canada, United Kingdom, and India.<br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>
     */
    subType?:
      | 'OVERDRAFT_CHARGE'
      | 'ONLINE_PURCHASE'
      | 'TAX_PAYMENT'
      | 'PAYMENT_BY_CHECK'
      | 'ATM_CASH_WITHDRAWAL'
      | 'SERVICE_CHARGE'
      | 'RETURNED_CHECK_CHARGE'
      | 'STOP_PAYMENT_CHARGE'
      | 'CONVENIENCE_FEE'
      | 'AUTO_LOAN'
      | 'HOME_LOAN_MORTGAGE'
      | 'RECURRING_SUBSCRIPTION_PAYMENT'
      | 'INTEREST'
      | 'PAYMENT'
      | 'PURCHASE'
      | 'REFUND'
      | 'TRANSFER'
      | 'FINANCE_CHARGE'
      | 'OTHER_CHARGES_FEES'
      | 'ANNUAL_FEE'
      | 'DEPOSIT'
      | 'DIRECT_DEPOSIT_SALARY'
      | 'INVESTMENT_INCOME_CASH'
      | 'SSA'
      | 'REWARDS'
      | 'TAX_REFUND'
      | 'CREDIT_CARD_PAYMENT'
      | 'INSURANCE_PAYMENT'
      | 'UTILITIES_PAYMENT'
      | 'CHILD_SUPPORT'
      | 'LOAN'
      | 'PERSONAL_LOAN'
      | 'STUDENT_LOAN'
      | 'REIMBURSEMENT'
      | 'BALANCE_TRANSFER'
      | 'OVERDRAFT_PROTECTION'
      | 'CREDIT'
      | 'NSF_FEES'
    /**
     * Country of the merchant.<br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>
     */
    merchantCountry?: string
    /**
     * The id of the category assigned to the transaction. This is the id field of the transaction category resource. The supported values are provided by the GET transactions/categories.<br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>
     */
    categoryId?: number // int64
  }
  /**
   * EnrichedTransactionResponse
   */
  export interface EnrichedTransactionResponse {
    enrichedTransaction?: /* EnrichedTransaction */ EnrichedTransaction[]
  }
  /**
   * EvaluateAccountAddress
   */
  export interface EvaluateAccountAddress {
    zip?: string
    country?: string
    address3?: string
    address2?: string
    city?: string
    sourceType?: string
    address1?: string
    street: string
    state?: string
    type?:
      | 'HOME'
      | 'BUSINESS'
      | 'POBOX'
      | 'RETAIL'
      | 'OFFICE'
      | 'SMALL_BUSINESS'
      | 'COMMUNICATION'
      | 'PERMANENT'
      | 'STATEMENT_ADDRESS'
      | 'PAYMENT'
      | 'PAYOFF'
      | 'UNKNOWN'
  }
  /**
   * EvaluateAddressRequest
   */
  export interface EvaluateAddressRequest {
    address: /* EvaluateAccountAddress */ EvaluateAccountAddress
  }
  /**
   * EvaluateAddressResponse
   */
  export interface EvaluateAddressResponse {
    address?: /* AccountAddress */ AccountAddress[]
    isValidAddress?: boolean
  }
  /**
   * Field
   */
  export interface Field {
    /**
     * Image displayed at the endsite.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li></ul>
     */
    image?: string
    /**
     * The prefix string that has to be displayed before the field value.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li><li>GET providers/{providerId}</li></ul>
     */
    prefix?: string
    /**
     * The minimum length of the login form field.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li><li>GET providers/{providerId}</li></ul>
     */
    minLength?: number // int64
    /**
     * Indicates whether the field is editable or not.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li><li>GET providers/{providerId}</li></ul>
     */
    valueEditable?: string
    /**
     * Indicates if a field is an optional field or a mandatory field.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li><li>GET providers/{providerId}</li></ul>
     */
    isOptional?: boolean
    /**
     * The suffix string that has to be displayed next to the field value.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li><li>GET providers/{providerId}</li></ul>
     */
    suffix?: string
    /**
     * This indicates the display type of the field. For example, text box, image, etc. <br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li><li>GET providers/{providerId}</li></ul><b>Applicable Values</b><br>
     */
    type?:
      | 'text'
      | 'password'
      | 'options'
      | 'checkbox'
      | 'radio'
      | 'image'
      | 'option'
    /**
     * Indicates that the answer to the security question already exists in the Yodlee system.Persuading the user to provide the answer to the security question again during the edit-credential flow can be avoided.<br><br><br><b>Endpoints</b>:<ul><li>GET providerAccounts?include=questions</li><li>GET providerAccounts/{providerAccountId}? include=questions</li></ul>
     */
    isValueProvided?: boolean
    /**
     * Name of the field.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li><li>GET providers/{providerId}</li></ul>
     */
    name?: string
    /**
     * Identifier for the field.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li><li>GET providers/{providerId}</li></ul>
     */
    id?: string
    /**
     * Value expected from the user for the field. This will be blank and is expected to be filled and sent back when submitting the login or MFA information.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li><li>GET providers/{providerId}</li></ul>
     */
    value?: string
    /**
     * The maximum length of the login form field.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li><li>GET providers/{providerId}</li></ul>
     */
    maxLength?: number // int64
    /**
     * Provides the different values that are available for the user to choose. This field is applicable for drop-down or radio field types.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li><li>GET providers/{providerId}</li></ul>
     */
    option?: /* Option */ Option[]
  }
  /**
   * FieldOperation
   */
  export interface FieldOperation {
    /**
     * Field for which the clause is created.<br><br><b>Applicable containers</b>: bank, creditCard, investment, insurance, loan<br><b>Applicable Values</b>:<ul><li>amount</li><li>description</li></ul><b>Applicable Values</b><br>
     */
    field?: 'amount' | 'description'
    /**
     * Operation for which the clause is created.<br><br><b>Applicable containers</b>: bank, creditCard, investment, insurance, loan<br><b>Applicable values (depends on the value of field)</b>:<ul><li>field is <b>description</b> -> operation can be<ol><li>stringEquals</li><li>stringContains</li></ol></li><li>field is <b>amount</b> -> operation can be<ol><li>numberEquals</li><li>numberLessThan</li><li>numberLessThanEquals</li><li>numberGreaterThan</li><li>numberGreaterThanEquals</li></ol></li></ul><b>Applicable Values</b><br>
     */
    operation?:
      | 'numberEquals'
      | 'numberLessThan'
      | 'numberLessThanEquals'
      | 'numberGreaterThan'
      | 'numberGreaterThanEquals'
      | 'stringEquals'
      | 'stringContains'
    /**
     * The value would be the amount value in case of amount based rule clause or the string value in case of description based rule clause.<br><br><b>Applicable containers</b>: bank, creditCard, investment, insurance, loan<br><b>Applicable Values</b>:<ul><li>field is <b>description</b> -> value should be <b>min of 3 and max of 50 characters</b></li><li>field is <b>amount</b> -> value should be <b> min value of 0 and a max value of 99999999999.99</b></li></ul>
     */
    value?: Record<string, any>
  }
  /**
   * FullAccountNumberList
   */
  export interface FullAccountNumberList {
    /**
     * Payment Account Number of given account.<br><br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul>
     */
    paymentAccountNumber?: string
    /**
     * Unmasked account number of given account.<br><br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul>
     */
    unmaskedAccountNumber?: string
  }
  /**
   * HistoricalBalance
   */
  export interface HistoricalBalance {
    /**
     * Date for which the account balance was provided.  This balance could be a carryforward, calculated or a scraped balance.<br><b>Additional Details</b>:<br><b>Scraped</b>: Balance shown in the provider site. This balance gets stored in Yodlee system during system/user account updates.<br><b>CarryForward</b>: Balance carried forward from the scraped balance to the days for which the balance was not available in the system. Balance may not be available for all the days in the system due to MFA information required, error in the site, credential changes, etc.<br><b>calculated</b>: Balances that gets calculated for the days that are prior to the account added date.  <br><br><b>Aggregated / Manual</b>: Both <br><b>Applicable containers</b>: bank, creditCard, investment, insurance, realEstate, loan<br><b>Endpoints</b>:<ul><li>GET accounts/historicalBalances</li><li>GET derived/networth</li></ul>
     */
    date?: string
    /**
     * Indicates whether the balance is an asset or liability.<br><br><b>Aggregated / Manual</b>: Both <br><b>Applicable containers</b>: bank, creditCard, investment, insurance, realEstate, loan<br><b>Endpoints</b>:<ul><li>GET accounts/historicalBalances</li></ul>
     */
    isAsset?: boolean
    /**
     * Balance amount of the account.<br><br><b>Aggregated / Manual</b>: Both <br><b>Applicable containers</b>: bank, creditCard, investment, insurance, realEstate, loan<br><b>Endpoints</b>:<ul><li>GET accounts/historicalBalances</li></ul>
     */
    balance?: /* Money */ Money
    /**
     * Date as of when the balance is last updated due to the auto account updates or user triggered updates. This balance will be carry forward for the days where there is no balance available in the system. <br><br><b>Aggregated / Manual</b>: Both <br><b>Applicable containers</b>: bank, creditCard, investment, insurance, realEstate, loan<br><b>Endpoints</b>:<ul><li>GET accounts/historicalBalances</li></ul>
     */
    asOfDate?: string
    /**
     * The source of balance information.<br><br><b>Aggregated / Manual</b>: Both <br><b>Applicable containers</b>: bank, creditCard, investment, insurance, realEstate, loan<br><b>Endpoints</b>:<ul><li>GET accounts/historicalBalances</li></ul><b>Applicable Values</b><br>
     */
    dataSourceType?: 'S' | 'C' | 'CF'
  }
  /**
   * HolderProfileResponse
   */
  export interface HolderProfileResponse {
    /**
     * The holder profile entity encapsulates all the user's details, such as the corresponding accounts and the userâ€™s profile data under it
     */
    holderProfile?: /* VerificationHolderProfile */ VerificationHolderProfile[]
  }
  /**
   * Holding
   */
  export interface Holding {
    /**
     * The symbol of the security.<br><br><b>Applicable containers</b>: investment<br>
     */
    symbol?: string
    /**
     * The quantity of the employee stock options that are already exercised or bought by the employee.<br><b>Note</b>: Once the employee stock options is exercised, they are either converted to cash value or equity positions depending on the FI. The exercised quantity field is only applicable to employee stock options.<br><br><b>Applicable containers</b>: investment<br>
     */
    exercisedQuantity?: number // double
    /**
     * The CUSIP (Committee on Uniform Securities Identification Procedures) identifies most the financial instruments in the United States and Canada.<br><br><b>Applicable containers</b>: investment<br>
     */
    cusipNumber?: string
    /**
     * Asset classification applied to the holding. <br><br><b>Applicable containers</b>: investment<br>
     */
    assetClassification?: /* AssetClassification */ AssetClassification[]
    /**
     * The quantity of units or shares that are already vested on a vest date.<br><b>Note</b>: The vested quantity field is only applicable to employee stock options, restricted stock units/awards, performance units, etc.<br><br><b>Applicable containers</b>: investment<br>
     */
    vestedQuantity?: number // double
    /**
     * The description (name) for the holding (E.g., Cisco Systems)<br>For insurance container, the field is only applicable for insurance annuity and variable life insurance types. <br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    description?: string
    /**
     * Indicates the estimated market value of the unvested units.<br><b>Note</b>: FIs usually calculates the unvested value as the market price unvested quantity. The unvested value field is only applicable to employee stock options, restricted stock units/awards, performance units, etc.<br><br><b>Applicable containers</b>: investment<br>
     */
    unvestedValue?: /* Money */ Money
    /**
     * Indicates the security style of holding identified through the security service.<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    securityStyle?: string
    /**
     * Indicates the estimated market value of the vested units.<br><b>Note</b>: FIs usually calculates the vested value as the market price vested quantity. The vested value field is only applicable to employee stock options, restricted stock units/awards, performance units, etc.<br><br><b>Applicable containers</b>: investment<br>
     */
    vestedValue?: /* Money */ Money
    /**
     * The type of the option position (i.e., put or call).<br><b>Note</b>: The option type field is only applicable to options.<br><br><b>Applicable containers</b>: investment<br><b>Applicable Values</b><br>
     */
    optionType?: 'put' | 'call' | 'unknown' | 'other'
    /**
     * The date when the information was last updated in the system.<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    lastUpdated?: string
    /**
     * Indicates the security match status id of the investment option identified during security normalization.<br><br><b>Applicable containers</b>: investment<br>
     */
    matchStatus?: string
    /**
     * Type of holding<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    holdingType?:
      | 'stock'
      | 'mutualFund'
      | 'bond'
      | 'CD'
      | 'option'
      | 'moneyMarketFund'
      | 'other'
      | 'remic'
      | 'future'
      | 'commodity'
      | 'currency'
      | 'unitInvestmentTrust'
      | 'employeeStockOption'
      | 'insuranceAnnuity'
      | 'unknown'
      | 'preferredStock'
      | 'ETF'
      | 'warrants'
      | 'digitalAsset'
    /**
     * The stated maturity date of a bond or CD.<br><br><b>Applicable containers</b>: investment<br>
     */
    maturityDate?: string
    /**
     * The current price of the security.<br><b>Note</b>: Only for bonds the price field indicates the normalized price and not the price aggregated from the site. For insurance container, the field is only applicable for insurance annuity and variable life insurance types.<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    price?: /* Money */ Money
    /**
     * The fixed duration for which the bond or CD is issued.<br><b>Note</b>: The term field is only applicable to CD.<br><br><b>Applicable containers</b>: investment<br>
     */
    term?: string
    /**
     * The quantity of tradeable units in a contract.<br><b>Note</b>: The contract quantity field is only applicable to commodity and currency.<br><br><b>Applicable containers</b>: investment<br>
     */
    contractQuantity?: number // double
    /**
     * Unique identifier for the security added in the system. This is the primary key of the holding resource.<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    id?: number // int64
    /**
     * Indicates that the holding is a short trading.<br><br><b>Applicable containers</b>: investment<br>
     */
    isShort?: boolean
    /**
     * The total market value of the security. For insurance container, the field is only applicable for insurance annuity and variable life insurance types.<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    value?: /* Money */ Money
    /**
     * The date on which an option, right or warrant expires.<br><b>Note</b>: The expiration date field is only applicable to options and employee stock options.<br><br><b>Applicable containers</b>: investment<br>
     */
    expirationDate?: string
    /**
     * The interest rate on a CD.<br><b>Note</b>: The interest rate field is only applicable to CD.<br><br><b>Applicable containers</b>: investment<br>
     */
    interestRate?: number // double
    /**
     * The quantity held for the holding.<br><b>Note</b>: Only for bonds the quantity field indicates the normalized quantity and not the quantity aggregated from the site. The quantity field is only applicable to restricted stock units/awards, performance units, currency, and commodity.<br>For insurance container, the field is only applicable for insurance annuity and variable life insurance types.<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    quantity?: number // double
    /**
     * The accruedInterest of the  holding.<br><br><b>Applicable containers</b>: investment<br>
     */
    accruedInterest?: /* Money */ Money
    /**
     * The date on which equity awards like ESOP, RSU, etc., are issued or granted.<br><b>Note</b>: The grant date field is only applicable to employee stock options, restricted stock units/awards, performance units, etc.<br><br><b>Applicable containers</b>: investment<br>
     */
    grantDate?: string
    /**
     * The SEDOL (Stock Exchange Daily Official List) is a set of security identifiers used in the United Kingdom and Ireland for clearing purposes.<br><b>Note</b>: The SEDOL field is only applicable to the trade related transactions<br><br><b>Applicable containers</b>: investment<br>
     */
    sedol?: string
    /**
     * The number of vested shares that can be exercised by the employee. It is usually equal to the vested quantity.<br><b>Note</b>: The vested shares exercisable field is only applicable to employee stock options, restricted stock units/awards, performance units, etc.<br><br><b>Applicable containers</b>: investment<br>
     */
    vestedSharesExercisable?: number // double
    /**
     * The difference between the current market value of a stock and the strike price of the employee stock option, when the market value of the shares are greater than the stock price.<br><b>Note</b>: The spread field is only applicable to employee stock options.<br><br><b>Applicable containers</b>: investment<br>
     */
    spread?: /* Money */ Money
    /**
     * Unique identifier of the account to which the security is linked.<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    accountId?: number // int64
    /**
     * The enrichedDescription is the security description of the normalized holding<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    enrichedDescription?: string
    /**
     * The stated interest rate for a bond.<br><br><b>Applicable containers</b>: investment<br>
     */
    couponRate?: number // double
    /**
     * The date on which the holding is created in the Yodlee system.<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    createdDate?: string
    /**
     * The accruedIncome of the  holding.<br><br><b>Applicable containers</b>: investment<br>
     */
    accruedIncome?: /* Money */ Money
    /**
     * Indicates the security type of holding identified through the security service.<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    securityType?: string
    /**
     * Unique identifier for the user's association with the provider.<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    providerAccountId?: number // int64
    /**
     * Indicates the number of unvested quantity or units.<br><b>Note</b>: The unvested quantity field is only applicable to employee stock options, restricted stock units/awards, performance units, etc.<br><br><b>Applicable containers</b>: investment<br>
     */
    unvestedQuantity?: number // double
    /**
     * In a one-off security purchase, the cost basis is the quantity acquired multiplied by the price per unit paid plus any commission paid. In case, the same position is acquired in different lots on different days at different prices, the sum total of the cost incurred is divided by the total units acquired to arrive at the average cost basis.<br><br><b>Applicable containers</b>: investment<br>
     */
    costBasis?: /* Money */ Money
    /**
     * The date on which a RSU, RSA, or an employee stock options become vested.<br><b>Note</b>: The vesting date field is only applicable to employee stock options, restricted stock units/awards, performance units, etc.<br><br><b>Applicable containers</b>: investment<br>
     */
    vestingDate?: string
    /**
     * The ISIN (International Securities Identification Number) is used worldwide to identify specific securities. It is equivalent to CUSIP for international markets.<br><br><b>Note</b>: The ISIN field is only applicable to the trade related transactions<br><br><b>Applicable containers</b>: investment<br>
     */
    isin?: string
    /**
     * The strike (exercise) price for the option position.<br><b>Note</b>: The strike price field is only applicable to options and employee stock options.<br><br><b>Applicable containers</b>: investment<br>
     */
    strikePrice?: /* Money */ Money
  }
  /**
   * HoldingAssetClassificationListResponse
   */
  export interface HoldingAssetClassificationListResponse {
    assetClassificationList?: /* AssetClassificationList */ AssetClassificationList[]
  }
  /**
   * HoldingResponse
   */
  export interface HoldingResponse {
    holding?: /* Holding */ Holding[]
  }
  /**
   * HoldingSecuritiesResponse
   */
  export interface HoldingSecuritiesResponse {
    holding?: /* SecurityHolding */ SecurityHolding[]
  }
  /**
   * HoldingTypeListResponse
   */
  export interface HoldingTypeListResponse {
    holdingType?: Array<| 'stock'
      | 'mutualFund'
      | 'bond'
      | 'CD'
      | 'option'
      | 'moneyMarketFund'
      | 'other'
      | 'remic'
      | 'future'
      | 'commodity'
      | 'currency'
      | 'unitInvestmentTrust'
      | 'employeeStockOption'
      | 'insuranceAnnuity'
      | 'unknown'
      | 'preferredStock'
      | 'ETF'
      | 'warrants'
      | 'digitalAsset'>
  }
  /**
   * Identifier
   */
  export interface Identifier {
    /**
     * Type of Identifier
     */
    type?: 'NIE' | 'DNI' | 'EIN' | 'BN' | 'AADHAR' | 'NIN' | 'NRIC'
    /**
     * Value of the identifier
     */
    value?: string
  }
  /**
   * Institution
   */
  export interface Institution {
    /**
     * The language in which the provider details are provided. For example, a site supports two languages English and French. English being the primary language, the provider response will be provided in French depending on the user's locale. The language follows the two letter ISO code.<br><br><b>Endpoints</b>:<ul><li>GET institutions</li></ul>
     */
    languageISOCode?: string
    /**
     * Favicon link of the provider.<br><br><b>Endpoints</b>:<ul><li>GET institutions</li></ul>
     */
    favicon?: string
    /**
     * Country to which the provider belongs.<br><br><b>Endpoints</b>:<ul><li>GET institutions</li></ul>
     */
    countryISOCode?: string
    /**
     * Indicates that the site has been added by the user at least once.<br><br><b>Endpoints</b>:<ul><li>GET institutions</li></ul>
     */
    isAddedByUser?: string
    /**
     * Indicates the priority for which the service is invoked.<br><br><b>Endpoints</b>:<ul><li>GET institutions</li></ul><b>Applicable Values</b><br>
     */
    PRIORITY?: 'POPULAR' | 'SUGGESTED' | 'COBRAND' | 'SEARCH' | 'ALL'
    /**
     * The primary language of the site.<br><br><b>Endpoints</b>:<ul><li>GET institutions</li></ul>
     */
    primaryLanguageISOCode?: string
    /**
     * The base URL of the provider's site.<br><br><b>Endpoints</b>:<ul><li>GET institutions</li></ul>
     */
    baseUrl?: string
    /**
     * The login URL of the provider's site.<br><br><b>Endpoints</b>:<ul><li>GET institutions</li></ul>
     */
    loginUrl?: string
    /**
     * providerId<br><br><b>Endpoints</b>:<ul><li>GET institutions</li></ul>
     */
    providerId?: number /* int64 */[]
    /**
     * The name of a provider site.<br><br><b>Endpoints</b>:<ul><li>GET institutions</li></ul>
     */
    name?: string
    /**
     * The logo link of the provider institution. The link will return the logo in the PNG format.<br><br><b>Endpoints</b>:<ul><li>GET institutions</li></ul>
     */
    logo?: string
    /**
     * Unique identifier for the provider site.(e.g., financial institution sites, biller sites, lender sites, etc.).<br><br><b>Endpoints</b>:<ul><li>GET institutions</li></ul>
     */
    id?: number // int64
    /**
     * Determines when the provider information was updated by Yodlee. If the customer caches the data, the cache is recommended to be refreshed based on this field.<br><br><b>Endpoints</b>:<ul><li>GET institutions</li></ul>
     */
    lastModified?: string
  }
  /**
   * InstitutionResponse
   */
  export interface InstitutionResponse {
    institution?: /* Institution */ Institution[]
  }
  /**
   * LoanPayoffDetails
   */
  export interface LoanPayoffDetails {
    /**
     * The date by which the payoff amount should be paid.<br><br><b>Account Type</b>: Aggregated<br><b>Applicable containers</b>: loan<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul>
     */
    payByDate?: string
    /**
     * The loan payoff amount.<br><br><b>Account Type</b>: Aggregated<br><b>Applicable containers</b>: loan<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul>
     */
    payoffAmount?: /* Money */ Money
    /**
     * The outstanding balance on the loan account. The outstanding balance amount may differ from the payoff amount. It is usually the sum of outstanding principal, unpaid interest, and fees, if any.<br><br><b>Account Type</b>: Aggregated<br><b>Applicable containers</b>: loan<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul>
     */
    outstandingBalance?: /* Money */ Money
  }
  /**
   * LoginForm
   */
  export interface LoginForm {
    /**
     * The title for the MFA information demanded from the user.This is the title displayed in the provider site.This field is applicable for MFA form types only. <br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li></ul>
     */
    mfaInfoTitle?: string
    /**
     * The help that can be displayed to the customer in the login form.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li><li>GET providers/{providerId}</li></ul>
     */
    help?: string
    /**
     * The forget password URL of the provider site.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li><li>GET providers/{providerId}</li></ul>
     */
    forgetPasswordURL?: string
    /**
     * The type of the forms for which the user information is required.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li><li>GET providers/{providerId}</li></ul><b>Applicable Values</b><br>
     */
    formType?: 'login' | 'questionAndAnswer' | 'token' | 'image'
    /**
     * The text displayed in the provider site while requesting the user's MFA information. This field is applicable for MFA form types only. <br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li></ul>
     */
    mfaInfoText?: string
    /**
     * The help that can be displayed to the customer in the login form.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li><li>GET providers/{providerId}</li></ul>
     */
    loginHelp?: string
    /**
     * The amount of time before which the user is expected to provide MFA information. This field is applicable for MFA form types only. This would be an useful information that could be displayed to the users. <br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li><li>GET providers/{providerId}</li></ul>
     */
    mfaTimeout?: number // int64
    /**
     * The identifier of the login form.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li><li>GET providers/{providerId}</li></ul>
     */
    id?: number // int64
    /**
     * This indicates one row in the form. The row will have one label. But it may have single or multiple fields.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li><li>GET providers/{providerId}</li></ul>
     */
    row?: /* Row */ Row[]
  }
  /**
   * Merchant
   */
  export interface Merchant {
    /**
     * The website of the merchant.<br><br><b>Applicable containers</b>: bank,creditCard,investment,loan<br>
     */
    website?: string
    /**
     * The address of the merchant associated with the transaction is populated in the merchant address field.<br><b>Note</b>: The merchant address field is not available by default and customers will have to specifically request the merchant's address (that includes city, state, and ZIP of the merchant). The merchant address field is available only for merchants in the United States.<br><br><b>Applicable containers</b>: bank,creditCard<br>
     */
    address?: /* AccountAddress */ AccountAddress
    /**
     * The merchant contact information like phone and email.<br><br><b>Applicable containers</b>: bank,creditCard,investment,loan<br>
     */
    contact?: /* Contact */ Contact
    /**
     * The business categories of the merchant.<br><br><b>Applicable containers</b>: bank,creditCard<br><b>Applicable Values</b><br>
     */
    categoryLabel?: string[]
    /**
     * The merchant geolocation coordinates like latitude and longitude.<br><br><b>Applicable containers</b>: bank,creditCard,loan<br>
     */
    coordinates?: /* Coordinates */ Coordinates
    /**
     * The name of the merchant.<br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>
     */
    name?: string
    /**
     * Identifier of the merchant.<br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>
     */
    id?: string
    /**
     * The source through which merchant information is retrieved.<br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br><b>Applicable Values</b><br>
     */
    source?: 'YODLEE' | 'FACTUAL'
    /**
     * The logoURL of the merchant.<br><br><b>Applicable containers</b>: bank,creditCard,investment,loan<br>
     */
    logoURL?: string
  }
  /**
   * Money
   */
  export interface Money {
    amount: number // double
    convertedAmount?: number // double
    currency?:
      | 'USD'
      | 'AUD'
      | 'BRL'
      | 'CAD'
      | 'EUR'
      | 'GBP'
      | 'HKD'
      | 'IDR'
      | 'INR'
      | 'JPY'
      | 'NZD'
      | 'SGD'
      | 'ZAR'
      | 'CNY'
      | 'VND'
      | 'MYR'
      | 'CHF'
      | 'AED'
      | 'AFA'
      | 'ALL'
      | 'AMD'
      | 'ANG'
      | 'AOA'
      | 'ARS'
      | 'AWG'
      | 'AZM'
      | 'BAM'
      | 'BBD'
      | 'BDT'
      | 'BGL'
      | 'BHD'
      | 'BIF'
      | 'BMD'
      | 'BND'
      | 'BOB'
      | 'BSD'
      | 'BTN'
      | 'BWP'
      | 'BYR'
      | 'BZD'
      | 'CDF'
      | 'CLP'
      | 'COP'
      | 'CRC'
      | 'CUP'
      | 'CVE'
      | 'CYP'
      | 'CZK'
      | 'DJF'
      | 'DKK'
      | 'DOP'
      | 'DZD'
      | 'EEK'
      | 'EGP'
      | 'ERN'
      | 'ETB'
      | 'FJD'
      | 'FKP'
      | 'GEL'
      | 'GGP'
      | 'GHC'
      | 'GIP'
      | 'GMD'
      | 'GNF'
      | 'GTQ'
      | 'GYD'
      | 'HNL'
      | 'HRK'
      | 'HTG'
      | 'HUF'
      | 'ILS'
      | 'IMP'
      | 'IQD'
      | 'IRR'
      | 'ISK'
      | 'JEP'
      | 'JMD'
      | 'JOD'
      | 'KES'
      | 'KGS'
      | 'KHR'
      | 'KMF'
      | 'KPW'
      | 'KRW'
      | 'KWD'
      | 'KYD'
      | 'KZT'
      | 'LAK'
      | 'LBP'
      | 'LKR'
      | 'LRD'
      | 'LSL'
      | 'LTL'
      | 'LVL'
      | 'LYD'
      | 'MAD'
      | 'MDL'
      | 'MGF'
      | 'MKD'
      | 'MMK'
      | 'MNT'
      | 'MOP'
      | 'MRO'
      | 'MTL'
      | 'MUR'
      | 'MVR'
      | 'MWK'
      | 'MXN'
      | 'MZM'
      | 'NAD'
      | 'NGN'
      | 'NIO'
      | 'NOK'
      | 'NPR'
      | 'OMR'
      | 'PAB'
      | 'PEN'
      | 'PGK'
      | 'PHP'
      | 'PKR'
      | 'PLN'
      | 'PYG'
      | 'QAR'
      | 'ROL'
      | 'RUR'
      | 'RWF'
      | 'SAR'
      | 'SBD'
      | 'SCR'
      | 'SDD'
      | 'SEK'
      | 'SHP'
      | 'SIT'
      | 'SKK'
      | 'SLL'
      | 'SOS'
      | 'SPL'
      | 'SRG'
      | 'STD'
      | 'SVC'
      | 'SYP'
      | 'SZL'
      | 'THB'
      | 'TJR'
      | 'TMM'
      | 'TND'
      | 'TOP'
      | 'TRL'
      | 'TTD'
      | 'TVD'
      | 'TWD'
      | 'TZS'
      | 'UAH'
      | 'UGX'
      | 'UYU'
      | 'UZS'
      | 'VEB'
      | 'VUV'
      | 'WST'
      | 'XAF'
      | 'XAG'
      | 'XAU'
      | 'XCD'
      | 'XDR'
      | 'XOF'
      | 'XPD'
      | 'XPF'
      | 'XPT'
      | 'YER'
      | 'YUM'
      | 'ZMK'
      | 'ZWD'
      | 'ADP'
      | 'ATS'
      | 'BEF'
      | 'BUK'
      | 'CSD'
      | 'CSK'
      | 'DDM'
      | 'DEM'
      | 'ECS'
      | 'ESP'
      | 'FIM'
      | 'GRD'
      | 'GWP'
      | 'IEP'
      | 'ITL'
      | 'LUF'
      | 'MLF'
      | 'NLG'
      | 'PTE'
      | 'SUR'
      | 'TPE'
      | 'UAK'
      | 'XBA'
      | 'XBB'
      | 'XBC'
      | 'XBD'
      | 'XEU'
      | 'XFO'
      | 'XFU'
      | 'XGF'
      | 'XMK'
      | 'XRM'
      | 'XTS'
      | 'YDD'
      | 'YUD'
      | 'ZRN'
      | 'TJS'
      | 'RON'
      | 'BGN'
      | 'BTC'
      | 'XBT'
      | 'CNH'
      | 'RUB'
      | 'TRY'
      | 'GHS'
      | 'TMT'
      | 'ZMW'
      | 'VEF'
      | 'SSP'
      | 'ALK'
    convertedCurrency?:
      | 'USD'
      | 'AUD'
      | 'BRL'
      | 'CAD'
      | 'EUR'
      | 'GBP'
      | 'HKD'
      | 'IDR'
      | 'INR'
      | 'JPY'
      | 'NZD'
      | 'SGD'
      | 'ZAR'
      | 'CNY'
      | 'VND'
      | 'MYR'
      | 'CHF'
      | 'AED'
      | 'AFA'
      | 'ALL'
      | 'AMD'
      | 'ANG'
      | 'AOA'
      | 'ARS'
      | 'AWG'
      | 'AZM'
      | 'BAM'
      | 'BBD'
      | 'BDT'
      | 'BGL'
      | 'BHD'
      | 'BIF'
      | 'BMD'
      | 'BND'
      | 'BOB'
      | 'BSD'
      | 'BTN'
      | 'BWP'
      | 'BYR'
      | 'BZD'
      | 'CDF'
      | 'CLP'
      | 'COP'
      | 'CRC'
      | 'CUP'
      | 'CVE'
      | 'CYP'
      | 'CZK'
      | 'DJF'
      | 'DKK'
      | 'DOP'
      | 'DZD'
      | 'EEK'
      | 'EGP'
      | 'ERN'
      | 'ETB'
      | 'FJD'
      | 'FKP'
      | 'GEL'
      | 'GGP'
      | 'GHC'
      | 'GIP'
      | 'GMD'
      | 'GNF'
      | 'GTQ'
      | 'GYD'
      | 'HNL'
      | 'HRK'
      | 'HTG'
      | 'HUF'
      | 'ILS'
      | 'IMP'
      | 'IQD'
      | 'IRR'
      | 'ISK'
      | 'JEP'
      | 'JMD'
      | 'JOD'
      | 'KES'
      | 'KGS'
      | 'KHR'
      | 'KMF'
      | 'KPW'
      | 'KRW'
      | 'KWD'
      | 'KYD'
      | 'KZT'
      | 'LAK'
      | 'LBP'
      | 'LKR'
      | 'LRD'
      | 'LSL'
      | 'LTL'
      | 'LVL'
      | 'LYD'
      | 'MAD'
      | 'MDL'
      | 'MGF'
      | 'MKD'
      | 'MMK'
      | 'MNT'
      | 'MOP'
      | 'MRO'
      | 'MTL'
      | 'MUR'
      | 'MVR'
      | 'MWK'
      | 'MXN'
      | 'MZM'
      | 'NAD'
      | 'NGN'
      | 'NIO'
      | 'NOK'
      | 'NPR'
      | 'OMR'
      | 'PAB'
      | 'PEN'
      | 'PGK'
      | 'PHP'
      | 'PKR'
      | 'PLN'
      | 'PYG'
      | 'QAR'
      | 'ROL'
      | 'RUR'
      | 'RWF'
      | 'SAR'
      | 'SBD'
      | 'SCR'
      | 'SDD'
      | 'SEK'
      | 'SHP'
      | 'SIT'
      | 'SKK'
      | 'SLL'
      | 'SOS'
      | 'SPL'
      | 'SRG'
      | 'STD'
      | 'SVC'
      | 'SYP'
      | 'SZL'
      | 'THB'
      | 'TJR'
      | 'TMM'
      | 'TND'
      | 'TOP'
      | 'TRL'
      | 'TTD'
      | 'TVD'
      | 'TWD'
      | 'TZS'
      | 'UAH'
      | 'UGX'
      | 'UYU'
      | 'UZS'
      | 'VEB'
      | 'VUV'
      | 'WST'
      | 'XAF'
      | 'XAG'
      | 'XAU'
      | 'XCD'
      | 'XDR'
      | 'XOF'
      | 'XPD'
      | 'XPF'
      | 'XPT'
      | 'YER'
      | 'YUM'
      | 'ZMK'
      | 'ZWD'
      | 'ADP'
      | 'ATS'
      | 'BEF'
      | 'BUK'
      | 'CSD'
      | 'CSK'
      | 'DDM'
      | 'DEM'
      | 'ECS'
      | 'ESP'
      | 'FIM'
      | 'GRD'
      | 'GWP'
      | 'IEP'
      | 'ITL'
      | 'LUF'
      | 'MLF'
      | 'NLG'
      | 'PTE'
      | 'SUR'
      | 'TPE'
      | 'UAK'
      | 'XBA'
      | 'XBB'
      | 'XBC'
      | 'XBD'
      | 'XEU'
      | 'XFO'
      | 'XFU'
      | 'XGF'
      | 'XMK'
      | 'XRM'
      | 'XTS'
      | 'YDD'
      | 'YUD'
      | 'ZRN'
      | 'TJS'
      | 'RON'
      | 'BGN'
      | 'BTC'
      | 'XBT'
      | 'CNH'
      | 'RUB'
      | 'TRY'
      | 'GHS'
      | 'TMT'
      | 'ZMW'
      | 'VEF'
      | 'SSP'
      | 'ALK'
  }
  /**
   * Name
   */
  export interface Name {
    middle?: string
    last?: string
    fullName?: string
    first?: string
  }
  /**
   * Option
   */
  export interface Option {
    /**
     * The text that is displayed to the user for that option in the provider site.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li><li>GET providers/{providerId}</li></ul>
     */
    displayText?: string
    /**
     * The value that is associated with the option.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li><li>GET providers/{providerId}</li></ul>
     */
    optionValue?: string
    /**
     * The option that is selected by default in the provider site.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li><li>GET providers/{providerId}</li></ul>
     */
    isSelected?: boolean
  }
  /**
   * PaymentBankTransferCode
   */
  export interface PaymentBankTransferCode {
    /**
     * Value of the identifier
     */
    id?: string
    /**
     * Type of BankTransferCode
     */
    type?: 'ROUTING_NUMBER' | 'BSB' | 'IFSC' | 'SORT_CODE'
  }
  /**
   * PaymentIdentifier
   */
  export interface PaymentIdentifier {
    /**
     * Type of Identifier
     */
    type?: 'REFERENCE_NUMBER' | 'PLATFORM_CODE'
    /**
     * Value of the identifier
     */
    value?: string
  }
  /**
   * PaymentProfile
   */
  export interface PaymentProfile {
    /**
     * The additional information such as platform code or payment reference number that is required to make payments.<br><b>Additional Details:</b>The identifier field applies only to the student loan account type.<br><br><b>Account Type</b>: Aggregated<br><b>Applicable containers</b>: loan<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul>
     */
    identifier?: /* PaymentIdentifier */ PaymentIdentifier
    /**
     * The address of the lender to which the monthly payments or the loan payoff amount should be paid. <br><b>Additional Details:</b>The address field applies only to the student loan account type.<br><b>Account Type</b>: Aggregated<br><b>Applicable containers</b>: loan<br><b>Endpoints</b>:<br><ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul>
     */
    address?: /* AccountAddress */ AccountAddress[]
    /**
     * The additional information for payment bank transfer code.<br><br><b>Applicable containers</b>: loan<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul>
     */
    paymentBankTransferCode?: /* PaymentBankTransferCode */ PaymentBankTransferCode
  }
  /**
   * PhoneNumber
   */
  export interface PhoneNumber {
    /**
     * type of phone number
     */
    type?: 'HOME' | 'WORK' | 'LANDLINE' | 'MOBILE'
    /**
     * Phone Number
     */
    value?: string
  }
  /**
   * Profile
   */
  export interface Profile {
    /**
     * Identifiers available in the profile page of the account.<br><br><b>Account Type</b>: Aggregated<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul>
     */
    identifier?: /* Identifier */ Identifier[]
    /**
     * Address available in the profile page of the account.<br><br><b>Account Type</b>: Aggregated<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul>
     */
    address?: /* AccountAddress */ AccountAddress[]
    /**
     * Phone number available in the profile page of the account.<br><br><b>Account Type</b>: Aggregated<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul>
     */
    phoneNumber?: /* PhoneNumber */ PhoneNumber[]
    /**
     * Gender of the provider account holder.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Endpoints</b>:<ul><li>GET providerAccounts/profile</li></ul>
     */
    gender?: string
    /**
     * Name of the provider account holder.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Endpoints</b>:<ul><li>GET providerAccounts/profile</li></ul>
     */
    name?: /* Name */ Name
    /**
     * Email Id available in the profile page of the account.<br><br><b>Account Type</b>: Aggregated<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li></ul>
     */
    email?: /* Email */ Email[]
  }
  /**
   * ProviderAccount
   */
  export interface ProviderAccount {
    /**
     * Indicate when the providerAccount is last updated successfully.<br><br><b>Account Type</b>: Aggregated<br><b>Endpoints</b>:<ul><li>GET dataExtracts/userData</li></ul>
     */
    lastUpdated?: string
    /**
     * Consent Id generated through POST Consent.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts</li><li>POST providerAccounts</li><li>PUT providerAccounts/{providerAccountId}</li><li>GET providerAccounts/{providerAccountId}</li></ul>
     */
    consentId?: number // int64
    /**
     * User preference values for Auto-Refresh and DataExtracts Notification<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts</li><li>GET providerAccounts/{providerAccountId}</li></ul>
     */
    preferences?: /* ProviderAccountPreferences */ ProviderAccountPreferences
    /**
     * The date on when the provider account is created in the system.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts</li><li>POST providerAccounts</li><li>PUT providerAccounts/{providerAccountId}</li><li>GET providerAccounts/{providerAccountId}</li></ul>
     */
    createdDate?: string
    /**
     * The source through which the providerAccount is added in the system.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts</li><li>POST providerAccounts</li><li>PUT providerAccounts/{providerAccountId}</li><li>GET providerAccounts/{providerAccountId}</li><li>GET dataExtracts/userData</li></ul><b>Applicable Values</b><br>
     */
    aggregationSource?: 'SYSTEM' | 'USER'
    /**
     * Indicates the migration status of the provider account from screen-scraping provider to the Open Banking provider. <br><br><b>Endpoints</b>:<ul><li>GET providerAccounts</li><li>GET providerAccounts/{providerAccountId}</li><li>PUT providerAccounts/{providerAccountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    oauthMigrationStatus?:
      | 'IN_PROGRESS'
      | 'TO_BE_MIGRATED'
      | 'COMPLETED'
      | 'MIGRATED'
    /**
     * Unique identifier for the provider resource. This denotes the provider for which the provider account id is generated by the user.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts</li><li>POST providerAccounts</li><li>PUT providerAccounts/{providerAccountId}</li><li>GET providerAccounts/{providerAccountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    providerId?: number // int64
    /**
     * Unique id generated to indicate the request.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts</li><li>POST providerAccounts</li><li>PUT providerAccounts/{providerAccountId}</li><li>GET providerAccounts/{providerAccountId}</li></ul>
     */
    requestId?: string
    /**
     * Indicates whether account is a manual or aggregated provider account.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts</li><li>POST providerAccounts</li><li>PUT providerAccounts/{providerAccountId}</li><li>GET providerAccounts/{providerAccountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    isManual?: boolean
    /**
     * Unique identifier for the provider account resource. This is created during account addition.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts</li><li>POST providerAccounts</li><li>PUT providerAccounts/{providerAccountId}</li><li>GET providerAccounts/{providerAccountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    id?: number // int64
    /**
     * Logical grouping of dataset attributes into datasets such as Basic Aggregation Data, Account Profile and Documents.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts</li><li>POST providerAccounts</li><li>PUT providerAccounts/{providerAccountId}</li><li>GET providerAccounts/{providerAccountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    dataset?: /* AccountDataset */ AccountDataset[]
    /**
     * The status of last update attempted for the account. <br><br><b>Endpoints</b>:<ul><li>GET providerAccounts</li><li>POST providerAccounts</li><li>PUT providerAccounts/{providerAccountId}</li><li>GET providerAccounts/{providerAccountId}</li><li>GET dataExtracts/userData</li></ul><b>Applicable Values</b><br>
     */
    status?:
      | 'LOGIN_IN_PROGRESS'
      | 'USER_INPUT_REQUIRED'
      | 'IN_PROGRESS'
      | 'PARTIAL_SUCCESS'
      | 'SUCCESS'
      | 'FAILED'
      | 'MIGRATION_IN_PROGRESS'
  }
  /**
   * ProviderAccountDetail
   */
  export interface ProviderAccountDetail {
    /**
     * User preference values for Auto-Refresh and DataExtracts Notification<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts</li><li>GET providerAccounts/{providerAccountId}</li></ul>
     */
    preferences?: /* ProviderAccountPreferences */ ProviderAccountPreferences
    /**
     * Indicates the migration status of the provider account from screen-scraping provider to the Open Banking provider. <br><br><b>Endpoints</b>:<ul><li>GET providerAccounts</li><li>GET providerAccounts/{providerAccountId}</li><li>PUT providerAccounts/{providerAccountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    oauthMigrationStatus?:
      | 'IN_PROGRESS'
      | 'TO_BE_MIGRATED'
      | 'COMPLETED'
      | 'MIGRATED'
    /**
     * Indicates whether account is a manual or aggregated provider account.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts</li><li>POST providerAccounts</li><li>PUT providerAccounts/{providerAccountId}</li><li>GET providerAccounts/{providerAccountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    isManual?: boolean
    /**
     * Indicate when the providerAccount is last updated successfully.<br><br><b>Account Type</b>: Aggregated<br><b>Endpoints</b>:<ul><li>GET dataExtracts/userData</li></ul>
     */
    lastUpdated?: string
    /**
     * Consent Id generated through POST Consent.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts</li><li>POST providerAccounts</li><li>PUT providerAccounts/{providerAccountId}</li><li>GET providerAccounts/{providerAccountId}</li></ul>
     */
    consentId: number // int64
    /**
     * This entity gets returned in the response for only MFA based provider accounts during the add/update account polling process. This indicates that the MFA information is expected from the user to complete the process. This represents the structure of MFA form that is displayed to the user in the provider site.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts</li><li>POST providerAccounts</li><li>PUT providerAccounts/{providerAccountId}</li><li>GET providerAccounts/{providerAccountId}</li></ul>
     */
    loginForm?: /* LoginForm */ LoginForm[]
    /**
     * The date on when the provider account is created in the system.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts</li><li>POST providerAccounts</li><li>PUT providerAccounts/{providerAccountId}</li><li>GET providerAccounts/{providerAccountId}</li></ul>
     */
    createdDate?: string
    /**
     * The source through which the providerAccount is added in the system.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts</li><li>POST providerAccounts</li><li>PUT providerAccounts/{providerAccountId}</li><li>GET providerAccounts/{providerAccountId}</li><li>GET dataExtracts/userData</li></ul><b>Applicable Values</b><br>
     */
    aggregationSource?: 'SYSTEM' | 'USER'
    /**
     * Unique identifier for the provider resource. This denotes the provider for which the provider account id is generated by the user.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts</li><li>POST providerAccounts</li><li>PUT providerAccounts/{providerAccountId}</li><li>GET providerAccounts/{providerAccountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    providerId?: number // int64
    /**
     * Unique id generated to indicate the request.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts</li><li>POST providerAccounts</li><li>PUT providerAccounts/{providerAccountId}</li><li>GET providerAccounts/{providerAccountId}</li></ul>
     */
    requestId?: string
    /**
     * Unique identifier for the provider account resource. This is created during account addition.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts</li><li>POST providerAccounts</li><li>PUT providerAccounts/{providerAccountId}</li><li>GET providerAccounts/{providerAccountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    id?: number // int64
    /**
     * Logical grouping of dataset attributes into datasets such as Basic Aggregation Data, Account Profile and Documents.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts</li><li>POST providerAccounts</li><li>PUT providerAccounts/{providerAccountId}</li><li>GET providerAccounts/{providerAccountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    dataset?: /* AccountDataset */ AccountDataset[]
    /**
     * The status of last update attempted for the account. <br><br><b>Endpoints</b>:<ul><li>GET providerAccounts</li><li>POST providerAccounts</li><li>PUT providerAccounts/{providerAccountId}</li><li>GET providerAccounts/{providerAccountId}</li><li>GET dataExtracts/userData</li></ul><b>Applicable Values</b><br>
     */
    status?:
      | 'LOGIN_IN_PROGRESS'
      | 'USER_INPUT_REQUIRED'
      | 'IN_PROGRESS'
      | 'PARTIAL_SUCCESS'
      | 'SUCCESS'
      | 'FAILED'
      | 'MIGRATION_IN_PROGRESS'
  }
  /**
   * ProviderAccountDetailResponse
   */
  export interface ProviderAccountDetailResponse {
    providerAccount?: /* ProviderAccountDetail */ ProviderAccountDetail[]
  }
  /**
   * ProviderAccountPreferences
   */
  export interface ProviderAccountPreferences {
    /**
     * Indicates if the updates to the provider account should be part of the data extracts event notification or the data extract data retrieval service.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts?include=preferences</li><li>GET providerAccounts/{providerAccountId}?include=preferences</li></ul>
     */
    isDataExtractsEnabled?: boolean
    /**
     * LinkedproviderAccountd is a providerAccountId linked by the user to the primary provider account. <br>LinkedProviderAccountId and the providerAccountId belongs to the same institution.<br><br><b>Endpoints</b>:<ul><li>POST Provider Account</li><li>PUT Provider Account</li><li>GET Provider Accounts</li></ul>
     */
    linkedProviderAccountId?: number // int64
    /**
     * Indicates if auto-refreshes have to be triggered for the provider account.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts?include=preferences</li><li>GET providerAccounts/{providerAccountId}?include=preferences</li></ul>
     */
    isAutoRefreshEnabled?: boolean
  }
  /**
   * ProviderAccountPreferencesRequest
   */
  export interface ProviderAccountPreferencesRequest {
    /**
     * The preference set for the provider account. <br><br><b>Endpoints</b>:<ul><li>GET providerAccounts?include=preferences</li><li>GET providerAccounts/{providerAccountId}?include=preferences</li></ul>
     */
    preferences?: /* ProviderAccountPreferences */ ProviderAccountPreferences
  }
  /**
   * ProviderAccountProfile
   */
  export interface ProviderAccountProfile {
    /**
     * PII related data like address, name, phoneNumber, identifier and email.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/profile</li></ul>
     */
    profile?: /* Profile */ Profile[]
    /**
     * Unique identifier for profile<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/profile</li></ul>
     */
    id?: number // int64
  }
  /**
   * ProviderAccountRequest
   */
  export interface ProviderAccountRequest {
    /**
     * Consent Id generated for the request through POST Consent.<br><br><b>Endpoints</b>:<ul><li>POST Provider Account</li><li>PUT Provider Account</li></ul>
     */
    consentId?: number // int64
    preferences?: /* ProviderAccountPreferences */ ProviderAccountPreferences
    aggregationSource?: 'SYSTEM' | 'USER'
    field: /* Field */ Field[]
    datasetName?: Array<| 'BASIC_AGG_DATA'
      | 'ADVANCE_AGG_DATA'
      | 'ACCT_PROFILE'
      | 'DOCUMENT'>
    dataset?: /* ProvidersDataset */ ProvidersDataset[]
  }
  /**
   * ProviderAccountResponse
   */
  export interface ProviderAccountResponse {
    providerAccount?: /* ProviderAccount */ ProviderAccount[]
  }
  /**
   * ProviderAccountUserProfileResponse
   */
  export interface ProviderAccountUserProfileResponse {
    providerAccount?: /* ProviderAccountProfile */ ProviderAccountProfile[]
  }
  /**
   * ProviderDetail
   */
  export interface ProviderDetail {
    /**
     * The language in which the provider details are provided. For example, a site supports two languages English and French. English being the primary language, the provider response will be provided in French depending on the user's locale. The language follows the two letter ISO code.<br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul>
     */
    languageISOCode?: string
    /**
     * Favicon link of the provider.<br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul>
     */
    favicon?: string
    /**
     * AccountType supported by the provider, eg: Brokerage Cash, Current<br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul>
     */
    accountType?: Array<'CURRENT' | 'BROKERAGE_CASH'>
    /**
     * Country to which the provider belongs.<br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul>
     */
    countryISOCode?: string
    /**
     * Indicates that the site has been added by the user at least once.<br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul>
     */
    isAddedByUser?: string
    /**
     * Indicates the priority for which the service is invoked.<br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul><b>Applicable Values</b><br>
     */
    PRIORITY?: 'POPULAR' | 'SUGGESTED' | 'COBRAND' | 'SEARCH' | 'ALL'
    /**
     * The screen-scraping providers that are associated to the Open Banking provider ID.<br><br><b>Applicable containers</b>: All Containers<br><b>Endpoints</b>:<ul><li>GET providers</li><li>GET providers/{providerId}</li></ul>
     */
    associatedProviderIds?: number /* int64 */[]
    /**
     * The primary language of the site.<br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul>
     */
    primaryLanguageISOCode?: string
    /**
     * Text to guide user through linking an account that belongs to the site<br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul>
     */
    help?: string
    /**
     * The base URL of the provider's site.<br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul>
     */
    baseUrl?: string
    /**
     * Capability of the site<br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul><br><b>Note : </b> capability has been deprecated
     */
    capability?: /* Capability */ Capability[]
    /**
     * This entity represents the structure of the login or MFA form that is displayed to the user at the provider site. For performance reasons, this field is returned only when a single provider is requested in the request.<br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li></ul>
     */
    loginForm?: /* LoginForm */ LoginForm[]
    /**
     * Indicates if a provider site requires consent.<br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul>
     */
    isConsentRequired?: boolean
    /**
     * The login URL of the provider's site.<br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul>
     */
    loginUrl?: string
    /**
     * Indicates if a provider site is auto-refreshed.<br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul>
     */
    isAutoRefreshEnabled?: boolean
    /**
     * The name of a provider site.<br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul>
     */
    name?: string
    /**
     * The logo link of the provider institution. The link will return the logo in the PNG format.<br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul>
     */
    logo?: string
    /**
     * Unique identifier for the provider site(e.g., financial institution sites, biller sites, lender sites, etc.).<br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul>
     */
    id?: number // int64
    /**
     * Determines when the provider information was updated by Yodlee. If the customer caches the data, the cache is recommended to be refreshed based on this field.<br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul>
     */
    lastModified?: string
    /**
     * AuthParameter appears in the response only in case of token-based aggregation sites.<br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul>
     */
    authParameter?: Array<'authorizationCode' | 'idToken' | 'authResponse'>
    /**
     * The authentication type enabled at the provider site. <br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul><b>Applicable Values</b><br>
     */
    authType?: 'OAUTH' | 'CREDENTIALS' | 'MFA_CREDENTIALS'
    /**
     * Logical grouping of dataset attributes into datasets such as Basic Aggregation Data, Account Profile and Documents<br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul>
     */
    dataset?: /* ProvidersDataset */ ProvidersDataset[]
    /**
     * Determines if the provider is supported for the cobrand (customer), is in the beta stage, etc. <br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul>
     */
    status?: 'Supported' | 'Beta' | 'Unsupported'
  }
  /**
   * ProviderDetailResponse
   */
  export interface ProviderDetailResponse {
    provider?: /* ProviderDetail */ ProviderDetail[]
  }
  /**
   * ProviderResponse
   */
  export interface ProviderResponse {
    provider?: /* Providers */ Providers[]
  }
  /**
   * Providers
   */
  export interface Providers {
    /**
     * The language in which the provider details are provided. For example, a site supports two languages English and French. English being the primary language, the provider response will be provided in French depending on the user's locale. The language follows the two letter ISO code.<br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul>
     */
    languageISOCode?: string
    /**
     * The forget password URL of the provider site.<br><br><b>Endpoints</b>:<ul><li>GET providers</li></ul>
     */
    forgetPasswordUrl?: string
    /**
     * Favicon link of the provider.<br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul>
     */
    favicon?: string
    /**
     * AccountType supported by the provider, eg: Brokerage Cash, Current<br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul>
     */
    accountType?: Array<'CURRENT' | 'BROKERAGE_CASH'>
    /**
     * Country to which the provider belongs.<br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul>
     */
    countryISOCode?: string
    /**
     * Indicates that the site has been added by the user at least once.<br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul>
     */
    isAddedByUser?: string
    /**
     * Indicates the priority for which the service is invoked.<br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul><b>Applicable Values</b><br>
     */
    PRIORITY?: 'POPULAR' | 'SUGGESTED' | 'COBRAND' | 'SEARCH' | 'ALL'
    /**
     * The screen-scraping providers that are associated to the Open Banking provider ID.<br><br><b>Applicable containers</b>: All Containers<br><b>Endpoints</b>:<ul><li>GET providers</li><li>GET providers/{providerId}</li></ul>
     */
    associatedProviderIds?: number /* int64 */[]
    /**
     * Help text to guide the user to choose the correct provider site.<br><br><b>Endpoints</b>:<ul><li>GET providers</li></ul>
     */
    loginHelp?: string
    /**
     * The primary language of the site.<br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul>
     */
    primaryLanguageISOCode?: string
    /**
     * Text to guide user through linking an account that belongs to the site<br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul>
     */
    help?: string
    /**
     * The base URL of the provider's site.<br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul>
     */
    baseUrl?: string
    /**
     * Capability of the site<br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul><br><b>Note : </b> capability has been deprecated
     */
    capability?: /* Capability */ Capability[]
    /**
     * Indicates if a provider site requires consent.<br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul>
     */
    isConsentRequired?: boolean
    /**
     * The login URL of the provider's site.<br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul>
     */
    loginUrl?: string
    /**
     * Indicates if a provider site is auto-refreshed.<br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul>
     */
    isAutoRefreshEnabled?: boolean
    /**
     * The name of a provider site.<br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul>
     */
    name?: string
    /**
     * The logo link of the provider institution. The link will return the logo in the PNG format.<br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul>
     */
    logo?: string
    /**
     * Unique identifier for the provider site(e.g., financial institution sites, biller sites, lender sites, etc.).<br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul>
     */
    id?: number // int64
    /**
     * Determines when the provider information was updated by Yodlee. If the customer caches the data, the cache is recommended to be refreshed based on this field.<br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul>
     */
    lastModified?: string
    /**
     * AuthParameter appears in the response only in case of token-based aggregation sites.<br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul>
     */
    authParameter?: Array<'authorizationCode' | 'idToken' | 'authResponse'>
    /**
     * The authentication type enabled at the provider site. <br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul><b>Applicable Values</b><br>
     */
    authType?: 'OAUTH' | 'CREDENTIALS' | 'MFA_CREDENTIALS'
    /**
     * Logical grouping of dataset attributes into datasets such as Basic Aggregation Data, Account Profile and Documents<br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul>
     */
    dataset?: /* ProvidersDataset */ ProvidersDataset[]
    /**
     * Determines if the provider is supported for the cobrand (customer), is in the beta stage, etc. <br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul>
     */
    status?: 'Supported' | 'Beta' | 'Unsupported'
  }
  /**
   * ProvidersCount
   */
  export interface ProvidersCount {
    TOTAL?: /* TotalCount */ TotalCount
  }
  /**
   * ProvidersCountResponse
   */
  export interface ProvidersCountResponse {
    provider?: /* ProvidersCount */ ProvidersCount
  }
  /**
   * ProvidersDataset
   */
  export interface ProvidersDataset {
    /**
     * The name of the dataset requested from the provider site<br><br><b>Account Type</b>: Manual<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET providerAccounts</li><li>POST providerAccounts</li><li>PUT providerAccounts/{providerAccountId}</li><li>GET providerAccounts/{providerAccountId}</li><li>GET providers/{providerId}</li><li>GET providers</li></ul><b>Applicable Values</b><br>
     */
    name?: 'BASIC_AGG_DATA' | 'ADVANCE_AGG_DATA' | 'ACCT_PROFILE' | 'DOCUMENT'
    /**
     * The name of the dataset attribute suported by the provider.<br><br><b>Endpoints</b>:<ul><li>GET providers/{providerId}</li><li>GET providers</li></ul>
     */
    attribute?: /* Attribute */ Attribute[]
  }
  /**
   * RenewConsent
   */
  export interface RenewConsent {
    /**
     * Data Access Frequency explains the number of times that this consent can be used.<br> Otherwise called as consent frequency type.
     */
    dataAccessFrequency?: 'ONE_TIME' | 'RECURRING'
    /**
     * Renewal describes the sharing duration and reauthorization required.
     */
    renewal?: /* Renewal */ Renewal
    /**
     * Title for the consent form.
     */
    title: string
    /**
     * Application display name.
     */
    applicationDisplayName: string
    /**
     * Description for the title.
     */
    titleBody: string
    /**
     * Consent Id generated through POST Consent.
     */
    consentId: number // int64
    /**
     * Authorization url generated for the request through PUT Consent to reach endsite. <br>OR during get authorization url call. <br>This is created during account addition.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts</li></ul>
     */
    authorizationUrl?: string
    /**
     * Provider Id for which the consent needs to be generated.
     */
    providerId: number // int64
    /**
     * Status of the consent.
     */
    consentStatus:
      | 'ACTIVE'
      | 'CONSENT_GENERATED'
      | 'CONSENT_ACCEPTED'
      | 'CONSENT_AUTHORIZED'
      | 'CONSENT_MISMATCH'
      | 'PENDING'
      | 'EXPIRED'
      | 'REVOKED'
    /**
     * Unique identifier for the provider account resource. <br>This is created during account addition.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts</li><li>GET accounts</li><li>GET consents</li></ul>
     */
    providerAccountId?: number // int64
    /**
     * Scope describes about the consent permissions and their purpose.
     */
    scope: /* Scope */ Scope[]
    /**
     * Consent start date.
     */
    startDate: string
    /**
     * Consent expiry date.
     */
    expirationDate: string
  }
  /**
   * RenewConsentRequest
   */
  export interface RenewConsentRequest {
    /**
     * renewal entity from consent details service, containing default consent duration and reauthorization eligibility.<br><br><b>Endpoints</b>:<ul><li>PUT consents/{consentId}/renewal</li></ul>
     */
    renewal?: /* RenewalConsent */ RenewalConsent
  }
  /**
   * RenewConsentResponse
   */
  export interface RenewConsentResponse {
    consent?: /* RenewConsent */ RenewConsent
  }
  /**
   * Renewal
   */
  export interface Renewal {
    /**
     * Shows the duration in days of consent renewal
     */
    defaultRenewalDuration: number // int64
    /**
     * Shows if the consent renewal need reauthorization
     */
    isReauthorizationRequired: boolean
  }
  /**
   * RenewalConsent
   */
  export interface RenewalConsent {
    /**
     * Consent default renewal duration.<br><br><b>Endpoints</b>:<ul><li>PUT consents/{consentId}/renewal</li></ul>
     */
    defaultRenewalDuration?: string
    /**
     * Consent eligibility for reauthorization.<br><br><b>Endpoints</b>:<ul><li>PUT consents/{consentId}/renewal</li></ul>
     */
    isReauthorizationRequired?: boolean
  }
  /**
   * RewardBalance
   */
  export interface RewardBalance {
    /**
     * The date on which the balance expires.<br><br><b>Account Type</b>: Aggregated<br><b>Applicable containers</b>: reward<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    expiryDate?: string
    /**
     * The balance required to qualify for a reward such as retaining membership, business reward, etc.<br><br><b>Account Type</b>: Aggregated<br><b>Applicable containers</b>: reward<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    balanceToReward?: string
    /**
     * The type of reward balance.<br><br><b>Account Type</b>: Aggregated<br><b>Applicable containers</b>: reward<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul><b>Applicable Values</b><br>
     */
    balanceType?:
      | 'EXPIRING_BALANCE'
      | 'BALANCE_TO_LEVEL'
      | 'BALANCE_TO_REWARD'
      | 'BALANCE'
      | 'TOTAL_BALANCE'
    /**
     * The actual reward balance.<br><br><b>Account Type</b>: Aggregated<br><b>Applicable containers</b>: reward<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    balance?: number // double
    /**
     * The description for the reward balance as available at provider source.<br><br><b>Account Type</b>: Aggregated<br><b>Applicable containers</b>: reward<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    description?: string
    /**
     * The balance required to reach a reward level.<br><br><b>Account Type</b>: Aggregated<br><b>Applicable containers</b>: reward<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    balanceToLevel?: string
    /**
     * Unit of reward balance - miles, points, segments, dollars, credits.<br><br><b>Account Type</b>: Aggregated<br><b>Applicable containers</b>: reward<br><b>Endpoints</b>:<ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    units?: string
  }
  /**
   * Row
   */
  export interface Row {
    /**
     * Fields that belong to a particular choice are collected together using this field.<br><b>Recommendations</b>: All the field row choices label to be grouped and displayed as options to the customer. On choosing a particular choice field, we recommend displaying the fields relevant to them. First field choice could be selected by default.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li><li>GET providers/{providerId}</li></ul>
     */
    fieldRowChoice?: string
    /**
     * Details of fields that belong to the row.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li><li>GET providers/{providerId}</li></ul>
     */
    field?: /* Field */ Field[]
    /**
     * Form denotes the set of the fields that are related. <br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li><li>GET providers/{providerId}</li></ul>
     */
    form?: string
    /**
     * Unique identifier of the row.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li><li>GET providers/{providerId}</li></ul>
     */
    id?: string
    /**
     * The label text displayed for a row in the form.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts/{providerAccountId}</li><li>GET providers/{providerId}</li></ul>
     */
    label?: string
  }
  /**
   * RuleClause
   */
  export interface RuleClause {
    /**
     * Field for which the clause is created.<br><br><br><b>Valid Values</b>:amount,description<b>Applicable containers</b>: creditCard, investment, insurance, loan<br>
     */
    field?: 'amount' | 'description'
    /**
     * Unique identifier generated for every rule the user creates.<br><br><b>Applicable containers</b>: creditCard, investment, insurance, loan<br>
     */
    userDefinedRuleId?: number // int64
    /**
     * The value would be the amount value in case of amount based rule clause or the string value in case of description based rule clause.<br><br><b>Applicable containers</b>: creditCard, investment, insurance, loan<br>
     */
    fieldValue?: string
    /**
     * Operation for which the clause is created.<br><br><b>Applicable containers</b>: creditCard, investment, insurance, loan<br>
     */
    operation?:
      | 'numberEquals'
      | 'numberLessThan'
      | 'numberLessThanEquals'
      | 'numberGreaterThan'
      | 'numberGreaterThanEquals'
      | 'stringEquals'
      | 'stringContains'
    /**
     * Unique identifier generated for the rule clause.<br><br><b>Applicable containers</b>: creditCard, investment, insurance, loan<br>
     */
    ruleClauseId?: number // int64
  }
  /**
   * Scope
   */
  export interface Scope {
    /**
     * Title body that explains the purpose of the scope.
     */
    titleBody: string[]
    /**
     * Unique Dataset Cluster name for the consent group like <br/> ACCOUNT_DETAILS<br/> STATEMENT_DETAILS<br/> CONTACT_DETAILS<br/> TRANSACTION_DETAILS
     */
    scopeId:
      | 'ACCOUNT_DETAILS'
      | 'TRANSACTION_DETAILS'
      | 'STATEMENT_DETAILS'
      | 'CONTACT_DETAILS'
    /**
     * Permissions that are associated with the Consent group like<br/> BASIC_AGG_DATA.BASIC_ACCOUNT_INFO<br/> BASIC_AGG_DATA.ACCOUNT_DETAILS<br/> BASIC_AGG_DATA.STATEMENTS<br/> BASIC_AGG_DATA.TRANSACTIONS<br/> ACCT_PROFILE.HOLDER_NAME<br/> ACCT_PROFILE.FULL_ACCT_NUMBER<br/> ACCT_PROFILE.BANK_TRANSFER_CODE<br/> ACCT_PROFILE.HOLDER_DETAILS
     */
    datasetAttributes?: string[]
    /**
     * Title for the Data Cluster.
     */
    title: string
  }
  /**
   * Security
   */
  export interface Security {
    /**
     * Securities exchange provide the securities information at the corresponding exchanges. <br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    stockExchangeDetails?: /* StockExchangeDetail */ StockExchangeDetail[]
    /**
     * Price units corresponding to the security style. This is used to derive actual price of the security from market value.<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    issueTypeMultiplier?: number // double
    /**
     * The state in which the security is taxed.<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    stateTaxable?: boolean
    /**
     * Next call date of the security.<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    callDate?: string
    /**
     * cdsc fund flag of the security.<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    cdscFundFlag?: boolean
    /**
     * A CUSIP is a nine-character alphanumeric code that identifies a North American financial security for the purposes of facilitating clearing and settlement of trades.<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    cusip?: string
    /**
     * Flag indicating federal taxable.<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    federalTaxable?: boolean
    /**
     * Unique identifier for S&P rating on Envestnet platform.<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    sAndPRating?: string
    /**
     * Share class of the security.<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    shareClass?: string
    /**
     * Flag indicating a dummy security.<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    isEnvestnetDummySecurity?: boolean
    /**
     * The description (name) of the security. For example, Cisco Systems.<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    description?: string
    /**
     * Minimum purchase of security.<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    minimumPurchase?: number // int32
    /**
     * Indicates the type of security like stocks, mutual fund, etc. <br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    type?: string
    /**
     * First coupon date of security.<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    firstCouponDate?: string
    /**
     * Coupon Frequency.<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    frequency?: number // int32
    /**
     * The method in which interest is accrued or earned.<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    accrualMethod?: string
    /**
     * ISO 4217 currency code indicating income currency of the security.<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    incomeCurrency?: string
    /**
     * Maturity date of the security.<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    maturityDate?: string
    /**
     * Next call price of the security.<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    callPrice?: number // double
    /**
     * The unique identifier of the security.<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    id?: number // int64
    /**
     * Issue date of the security.<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    issueDate?: string
    /**
     * Identifier of the sector to which the security belongs to.<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    sector?: string
    /**
     * Agency factor of the security.<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    agencyFactor?: number // double
    /**
     * The rate of interest paid annually, expressed as a percentage of the bond's par or face value.<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    interestRate?: number // double
    /**
     * The last updated date of the security.<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    lastModifiedDate?: string
    /**
     * GICS Sector is a categorization the S&P assigns to all publically traded companies. <br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    gicsSector?: string
    /**
     * <b>true</b>:Closed for all investors , <b>false</b>: Open to all investors.<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    closedFlag?: boolean
    /**
     * The Stock Exchange Daily Official List (SEDOL) is a set of security identifiers used in the United Kingdom and Ireland for clearing purposes.<br><b>Note</b>: The SEDOL field is only applicable to the trade related transactions.<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    sedol?: string
    /**
     * GICS sector ID to which the security belongs to.<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    subSector?: string
    /**
     * Last coupon date of security.<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    lastCouponDate?: string
    /**
     * Indicates whether the security is a simulated security.<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    isSyntheticSecurity?: boolean
    /**
     * ISO 4217 currency code indicating trading currency of the security.<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    tradeCurrencyCode?: string
    /**
     * Indicates whether the security is a dummy security.<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    isDummySecurity?: boolean
    /**
     * Unique identifier for Moody rating on Envestnet platform.<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    moodyRating?: string
    /**
     * Classification of the style for the security.<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    style?: string
    /**
     * <b>1</b>- indicates Eligible,<b>0</b>- indicates firm is not eligible.<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    firmEligible?: string
    /**
     * Mutual Fund Family Name.<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    fundFamily?: string
    /**
     * The International Securities Identification Number (ISIN) is used worldwide to identify specific securities. It is equivalent to CUSIP for international markets.<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    isin?: string
  }
  /**
   * SecurityHolding
   */
  export interface SecurityHolding {
    security?: /* Security */ Security
    id?: string
  }
  /**
   * Statement
   */
  export interface Statement {
    /**
     * The APR applied to the balance on the credit card account, as available in the statement.<br><b>Note:</b> In case of variable APR, the APR available on the statement might differ from the APR available at the account-level.<br><br><b>Applicable containers</b>: creditCard, loan, insurance<br>
     */
    apr?: number // double
    /**
     * The APR applicable to cash withdrawals on the credit card account.<br><br><b>Applicable containers</b>: creditCard, loan, insurance<br>
     */
    cashApr?: number // double
    /**
     * The start date of the statement period.<br><br><b>Applicable containers</b>: creditCard, loan, insurance<br>
     */
    billingPeriodStart?: string
    /**
     * The date by when the minimum payment is due to be paid.<br><b>Note:</b> The due date that appears in the statement may differ from the due date at the account-level.<br><br><b>Applicable containers</b>: creditCard, loan, insurance<br>
     */
    dueDate?: string
    /**
     * The interest amount that is part of the amount due or the payment amount.<br><br><b>Applicable containers</b>: creditCard, loan, insurance<br>
     */
    interestAmount?: /* Money */ Money
    /**
     * The date on which the statement is generated.<br><br><b>Applicable containers</b>: creditCard, loan, insurance<br>
     */
    statementDate?: string
    /**
     * Cash Advance is the amount that is withdrawn from credit card over the counter or from an ATM up to the available credit/cash limit.<br><br><b>Applicable containers</b>: creditCard, loan, insurance<br>
     */
    cashAdvance?: /* Money */ Money
    /**
     * The end date of the statement period.<br><br><b>Applicable containers</b>: creditCard, loan, insurance<br>
     */
    billingPeriodEnd?: string
    /**
     * The principal amount that is part of the amount due or the payment amount.<br><br><b>Applicable containers</b>: creditCard, loan, insurance<br>
     */
    principalAmount?: /* Money */ Money
    /**
     * The outstanding principal balance on the loan account.<br><br><b>Applicable containers</b>: creditCard, loan, insurance<br>
     */
    loanBalance?: /* Money */ Money
    /**
     * The total amount owed at the end of the billing period.<br><br><b>Applicable containers</b>: creditCard, loan, insurance<br>
     */
    amountDue?: /* Money */ Money
    /**
     * Account to which the statement belongs to.<br><br><b>Applicable containers</b>: creditCard, loan, insurance<br>
     */
    accountId?: number // int64
    /**
     * The date when the account was last updated by Yodlee.<br><br><b>Applicable containers</b>: creditCard, loan, insurance<br>
     */
    lastUpdated?: string
    /**
     * The field is set to true if the statement is the latest generated statement.<br><br><b>Applicable containers</b>: creditCard, loan, insurance<br>
     */
    isLatest?: boolean
    /**
     * <b>Credit Card:</b> The minimum amount that the consumer has to pay every month on the credit card account. Data provides an up-to-date information to the consumer.<br><br><b>Applicable containers</b>: creditCard, loan, insurance<br>
     */
    minimumPayment?: /* Money */ Money
    /**
     * The date on which the last payment was done during the billing cycle.<br><br><b>Applicable containers</b>: creditCard, loan, insurance<br>
     */
    lastPaymentDate?: string
    /**
     * The last payment done for the previous billing cycle in the current statement period.<br><br><b>Applicable containers</b>: creditCard, loan, insurance<br>
     */
    lastPaymentAmount?: /* Money */ Money
    /**
     * Unique identifier for the statement.<br><br><b>Applicable containers</b>: creditCard, loan, insurance<br>
     */
    id?: number // int64
    /**
     * New charges on the statement (i.e., charges since last statement to end of the billing period). Applicable to line of credit loan type.<br><br><b>Applicable containers</b>: creditCard, loan, insurance<br>
     */
    newCharges?: /* Money */ Money
  }
  /**
   * StatementResponse
   */
  export interface StatementResponse {
    statement?: /* Statement */ Statement[]
  }
  /**
   * StockExchangeDetail
   */
  export interface StockExchangeDetail {
    /**
     * Ticker symbol representing particular securities listed on an exchange.<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    symbol?: string
    /**
     * Country codes are geocodes developed to represent countries and dependent areas.<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    countryCode?: string
    /**
     * ISO codes of currency.<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    currencyCode?: string
    /**
     * An Exchange code is a four-character code used to identify stock markets and other trading exchanges within global trading.<br><br><b>Applicable containers</b>: investment, insurance<br>
     */
    exchangeCode?: string
  }
  /**
   * TotalCount
   */
  export interface TotalCount {
    count?: number // int64
  }
  /**
   * Transaction
   */
  export interface Transaction {
    /**
     * The value provided will be either postDate or transactionDate. postDate takes higher priority than transactionDate, except for the investment container as only transactionDate is available. The availability of postDate or transactionDate depends on the provider site.<br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>
     */
    date?: string
    /**
     * A unique ID that the provider site has assigned to the transaction. The source ID is only available for the pre-populated accounts.<br>Pre-populated accounts are the accounts that the FI customers shares with Yodlee, so that the user does not have to add or aggregate those accounts.
     */
    sourceId?: string
    /**
     * The symbol of the security being traded.<br><b>Note</b>: The settle date field applies only to trade-related transactions. <br><br><b>Applicable containers</b>: investment<br>
     */
    symbol?: string
    /**
     * The CUSIP (Committee on Uniform Securities Identification Procedures) identifies the financial instruments in the United States and Canada.<br><b><br><b>Note</b></b>: The CUSIP number field applies only to trade related transactions.<br><br><b>Applicable containers</b>: investment<br>
     */
    cusipNumber?: string
    /**
     * The high level category assigned to the transaction. The supported values are provided by the GET transactions/categories. <br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>
     */
    highLevelCategoryId?: number // int64
    /**
     * The id of the detail category that is assigned to the transaction. The supported values are provided by GET transactions/categories.<br><br><b>Applicable containers</b>: bank,creditCard<br>
     */
    detailCategoryId?: number // int64
    /**
     * Description details<br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>
     */
    description?: /* Description */ Description
    /**
     * Additional notes provided by the user for a particular  transaction through application or API services. <br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>
     */
    memo?: string
    /**
     * It is the date on which the transaction is finalized, that is, the date the ownership of the security is transferred to the buyer. The settlement date is usually few days after the transaction date.<br><br><b>Applicable containers</b>: investment<br>
     */
    settleDate?: string
    /**
     * The nature of the transaction, i.e., deposit, refund, payment, etc.<br><b>Note</b>: The transaction type field is available only for the United States, Canada, United Kingdom, and India based provider sites. <br><br><b>Applicable containers</b>: bank,creditCard,investment<br>
     */
    type?: string
    /**
     * The intermediary of the transaction.<br><br><b>Applicable containers</b>:  bank,creditCard,investment,loan<br>
     */
    intermediary?: string[]
    /**
     * Indicates if the transaction appears as a debit or a credit transaction in the account. <br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br><b>Applicable Values</b><br>
     */
    baseType?: 'CREDIT' | 'DEBIT'
    /**
     * Indicates the source of the category, i.e., categories derived by the system or assigned/provided by the consumer. This is the source field of the transaction category resource. The supported values are provided by the GET transactions/categories.<br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br><b>Applicable Values</b><br>
     */
    categorySource?: 'SYSTEM' | 'USER'
    /**
     * The portion of the principal in the transaction amount. The transaction amount can be the amount due, payment amount, minimum amount, repayment, etc.<br><br><b>Applicable containers</b>: loan<br>
     */
    principal?: /* Money */ Money
    lastUpdated?: string
    /**
     * The portion of interest in the transaction amount. The transaction amount can be the amount due, payment amount, minimum amount, repayment, etc.<br><br><b>Applicable containers</b>: loan<br>
     */
    interest?: /* Money */ Money
    /**
     * The price of the security for the transaction.<br><b>Note</b>: The price field applies only to the trade related transactions. <br><br><b>Applicable containers</b>: investment<br>
     */
    price?: /* Money */ Money
    /**
     * A commission or brokerage associated with a transaction.<br><br><br><b>Additional Details</b>:The commission only applies to trade-related transactions.<b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>
     */
    commission?: /* Money */ Money
    /**
     * An unique identifier for the transaction. The combination of the id and account container are unique in the system. <br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>
     */
    id?: number // int64
    /**
     * Indicates the merchantType of the transaction.e.g:-BILLERS,SUBSCRIPTION,OTHERS <br><br><b>Applicable containers</b>: bank,creditCard,investment,loan<br>
     */
    merchantType?: string
    /**
     * The amount of the transaction as it appears at the FI site. <br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>
     */
    amount?: /* Money */ Money
    /**
     * The checkNumber of the transaction.<br><br><b>Applicable containers</b>: bank<br>
     */
    checkNumber?: string
    /**
     * Indicates if the transaction is happened online or in-store. <br><br><b>Applicable containers</b>: bank,creditCard,investment,loan<br>
     */
    isPhysical?: boolean
    /**
     * The quantity associated with the transaction.<br><b>Note</b>: The quantity field applies only to trade-related transactions.<br><br><b>Applicable containers</b>: investment<br>
     */
    quantity?: number // double
    /**
     * It is an identification number that is assigned to financial instruments such as stocks and bonds trading in Switzerland.<br><br><b>Applicable containers</b>: investment<br>
     */
    valoren?: string
    /**
     * Indicates if the transaction is aggregated from the FI site or the consumer has manually created the transaction using the application or an API. <br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>
     */
    isManual?: boolean
    /**
     * The name of the merchant associated with the transaction.<br><b>Note</b>: The merchant name field is available only in the United States, Canada, United Kingdom, and India.<br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>
     */
    merchant?: /* Merchant */ Merchant
    /**
     * SEDOL stands for Stock Exchange Daily Official List, a list of security identifiers used in the United Kingdom and Ireland for clearing purposes.<br><br><b>Applicable containers</b>: investment<br>
     */
    sedol?: string
    /**
     * The date the transaction happens in the account. <br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>
     */
    transactionDate?: string
    /**
     * The categoryType of the category assigned to the transaction. This is the type field of the transaction category resource. The supported values are provided by the GET transactions/categories.<br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>
     */
    categoryType?:
      | 'TRANSFER'
      | 'DEFERRED_COMPENSATION'
      | 'UNCATEGORIZE'
      | 'INCOME'
      | 'EXPENSE'
    /**
     * The account from which the transaction was made. This is basically the primary key of the account resource. <br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>
     */
    accountId?: number // int64
    createdDate?: string
    /**
     * The source through which the transaction is added to the Yodlee system.<br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loann<br><b>Applicable Values:</b><br>
     */
    sourceType?: 'AGGREGATED' | 'MANUAL'
    /**
     * The account's container.<br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br><b>Applicable Values</b><br>
     */
    CONTAINER?:
      | 'bank'
      | 'creditCard'
      | 'investment'
      | 'insurance'
      | 'loan'
      | 'reward'
      | 'bill'
      | 'realEstate'
      | 'otherAssets'
      | 'otherLiabilities'
    /**
     * The date on which the transaction is posted to the account.<br><br><b>Applicable containers</b>: bank,creditCard,insurance,loan<br>
     */
    postDate?: string
    /**
     * The parentCategoryId of the category assigned to the transaction.<br><b>Note</b>: This field will be provided in the response if the transaction is assigned to a user-created category. <br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>
     */
    parentCategoryId?: number // int64
    /**
     * The transaction subtype field provides a detailed transaction type. For example, purchase is a transaction type and the transaction subtype field indicates if the purchase was made using a debit or credit card.<br><b>Note</b>: The transaction subtype field is available only in the United States, Canada, United Kingdom, and India.<br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>
     */
    subType?:
      | 'OVERDRAFT_CHARGE'
      | 'ONLINE_PURCHASE'
      | 'TAX_PAYMENT'
      | 'PAYMENT_BY_CHECK'
      | 'ATM_CASH_WITHDRAWAL'
      | 'SERVICE_CHARGE'
      | 'RETURNED_CHECK_CHARGE'
      | 'STOP_PAYMENT_CHARGE'
      | 'CONVENIENCE_FEE'
      | 'AUTO_LOAN'
      | 'HOME_LOAN_MORTGAGE'
      | 'RECURRING_SUBSCRIPTION_PAYMENT'
      | 'INTEREST'
      | 'PAYMENT'
      | 'PURCHASE'
      | 'REFUND'
      | 'TRANSFER'
      | 'FINANCE_CHARGE'
      | 'OTHER_CHARGES_FEES'
      | 'ANNUAL_FEE'
      | 'DEPOSIT'
      | 'DIRECT_DEPOSIT_SALARY'
      | 'INVESTMENT_INCOME_CASH'
      | 'SSA'
      | 'REWARDS'
      | 'TAX_REFUND'
      | 'CREDIT_CARD_PAYMENT'
      | 'INSURANCE_PAYMENT'
      | 'UTILITIES_PAYMENT'
      | 'CHILD_SUPPORT'
      | 'LOAN'
      | 'PERSONAL_LOAN'
      | 'STUDENT_LOAN'
      | 'REIMBURSEMENT'
      | 'BALANCE_TRANSFER'
      | 'OVERDRAFT_PROTECTION'
      | 'CREDIT'
      | 'NSF_FEES'
    /**
     * The name of the category assigned to the transaction. This is the category field of the transaction category resource. The supported values are provided by the GET transactions/categories.<br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>
     */
    category?: string
    /**
     * The running balance in an account indicates the balance of the account after every transaction.<br><br><b>Applicable containers</b>: bank,creditCard,investment<br>
     */
    runningBalance?: /* Money */ Money
    /**
     * The id of the category assigned to the transaction. This is the id field of the transaction category resource. The supported values are provided by the GET transactions/categories.<br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br>
     */
    categoryId?: number // int64
    /**
     * For transactions involving securities, this captures the securities description.<br><br><b>Applicable containers</b>: investment<br>
     */
    holdingDescription?: string
    /**
     * International Securities Identification Number (ISIN) standard is used worldwide to identify specific securities.<br><br><b>Applicable containers</b>: investment<br>
     */
    isin?: string
    /**
     * The status of the transaction: pending or posted.<br><b>Note</b>: Most FI sites only display posted transactions. If the FI site displays transaction status, same will be aggregated.  <br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br><b>Applicable Values</b><br>
     */
    status?: 'POSTED' | 'PENDING' | 'SCHEDULED' | 'FAILED' | 'CLEARED'
  }
  /**
   * TransactionCategorizationRule
   */
  export interface TransactionCategorizationRule {
    /**
     * Details of rules. <br><br><b>Applicable containers</b>: creditCard, investment, insurance, loan<br>
     */
    ruleClauses?: /* RuleClause */ RuleClause[]
    /**
     * Unique identifier generated for every rule the user creates.<br><br><b>Applicable containers</b>: creditCard, investment, insurance, loan<br>
     */
    userDefinedRuleId?: number // int64
    /**
     * The level of the category for which the rule is created.<br><br><b>Applicable containers</b>: creditCard, insurance, loan<br>
     */
    categoryLevelId?: number // int32
    /**
     * Category id that is assigned to the transaction when the transaction matches the rule clause. This is the id field of the transaction category resource.<br><br><b>Applicable containers</b>: creditCard, investment, insurance, loan<br>
     */
    transactionCategorisationId?: number // int64
    /**
     * Unique identifier of the user.<br><br><b>Applicable containers</b>: creditCard, investment, insurance, loan<br>
     */
    memId?: number // int64
    /**
     * The order in which the rules get executed on transactions.<br><br><b>Applicable containers</b>: creditCard, investment, insurance, loan<br>
     */
    rulePriority?: number // int32
  }
  /**
   * TransactionCategorizationRuleInfo
   */
  export interface TransactionCategorizationRuleInfo {
    ruleClause: /* FieldOperation */ FieldOperation[]
    source?: 'SYSTEM' | 'USER'
    priority?: number // int32
    categoryId: number // int32
  }
  /**
   * TransactionCategorizationRuleRequest
   */
  export interface TransactionCategorizationRuleRequest {
    rule: /* TransactionCategorizationRuleInfo */ TransactionCategorizationRuleInfo
  }
  /**
   * TransactionCategorizationRuleResponse
   */
  export interface TransactionCategorizationRuleResponse {
    txnRules?: /* TransactionCategorizationRule */ TransactionCategorizationRule[]
  }
  /**
   * TransactionCategory
   */
  export interface TransactionCategory {
    /**
     * The name of the high level category. A group of similar transaction categories are clubbed together to form a high-level category.<br><br><b>Applicable containers</b>: creditCard, investment, insurance, loan<br>
     */
    highLevelCategoryName?: string
    /**
     * A attribute which will always hold the first value(initial name) of Yodlee defined highLevelCategoryName attribute.<br><br><b>Applicable containers</b>: creditCard, investment, insurance, loan<br>
     */
    defaultHighLevelCategoryName?: string
    /**
     * The unique identifier of the high level category.<br><br><b>Applicable containers</b>: creditCard, investment, insurance, loan<br>
     */
    highLevelCategoryId?: number // int64
    /**
     * Entity that provides detail category attributes<br><br><b>Applicable containers</b>: creditCard, investment, insurance, loan<br>
     */
    detailCategory?: /* DetailCategory */ DetailCategory[]
    /**
     * Unique identifier of the category.<br><br><b>Applicable containers</b>: creditCard, investment, insurance, loan<br>
     */
    id?: number // int64
    /**
     * Source used to identify whether the transaction category is user defined category or system created category.<br><br><b>Applicable containers</b>: creditCard, investment, insurance, loan<br><b>Applicable Values</b><br>
     */
    source?: 'SYSTEM' | 'USER'
    /**
     * The name of the category.<br><b>Note</b>: Transaction categorization is one of the core features offered by Yodlee and the categories are assigned to the transactions by the system. Transactions can be clubbed together by the category that is assigned to them.  <br><br><b>Applicable containers</b>: creditCard, investment, insurance, loan<br>
     */
    category?: string
    /**
     * Category Classification.<br><br><b>Applicable containers</b>: creditCard, investment, insurance, loan<br><b>Applicable Values</b><br>
     */
    classification?: 'PERSONAL' | 'BUSINESS'
    /**
     * Transaction categories and high-level categories are further mapped to five transaction category types. Customers, based on their needs can either use the transaction categories, the high-level categories, or the transaction category types. <br><br><b>Applicable containers</b>: creditCard, investment, insurance, loan<br><b>Applicable Values</b><br>
     */
    type?:
      | 'TRANSFER'
      | 'DEFERRED_COMPENSATION'
      | 'UNCATEGORIZE'
      | 'INCOME'
      | 'EXPENSE'
    /**
     * A attribute which will always hold the first value(initial name) of Yodlee defined category attribute.<br><br><b>Applicable containers</b>: creditCard, investment, insurance, loan<br>
     */
    defaultCategoryName?: string
  }
  /**
   * TransactionCategoryRequest
   */
  export interface TransactionCategoryRequest {
    parentCategoryId: number // int32
    source?: string
    categoryName?: string
  }
  /**
   * TransactionCategoryResponse
   */
  export interface TransactionCategoryResponse {
    transactionCategory?: /* TransactionCategory */ TransactionCategory[]
  }
  /**
   * TransactionCount
   */
  export interface TransactionCount {
    TOTAL?: /* TransactionTotal */ TransactionTotal
  }
  /**
   * TransactionCountResponse
   */
  export interface TransactionCountResponse {
    transaction?: /* TransactionCount */ TransactionCount
  }
  /**
   * TransactionDays
   */
  export interface TransactionDays {
    fullAccountNumberFields?: Array<| 'paymentAccountNumber'
      | 'unmaskedAccountNumber'>
    numberOfTransactionDays?: number // int32
  }
  /**
   * TransactionRequest
   */
  export interface TransactionRequest {
    transaction: /* UpdateTransaction */ UpdateTransaction
  }
  /**
   * TransactionResponse
   */
  export interface TransactionResponse {
    transaction?: /* Transaction */ Transaction[]
  }
  /**
   * TransactionTotal
   */
  export interface TransactionTotal {
    count?: number // int64
  }
  /**
   * UpdateAccountInfo
   */
  export interface UpdateAccountInfo {
    container?:
      | 'bank'
      | 'creditCard'
      | 'investment'
      | 'insurance'
      | 'loan'
      | 'reward'
      | 'bill'
      | 'realEstate'
      | 'otherAssets'
      | 'otherLiabilities'
    includeInNetWorth?: string
    address?: /* AccountAddress */ AccountAddress
    accountName?: string
    dueDate?: string
    memo?: string
    homeValue?: /* Money */ Money
    accountNumber?: string // ^[a-zA-Z0-9]+$
    frequency?:
      | 'DAILY'
      | 'ONE_TIME'
      | 'WEEKLY'
      | 'EVERY_2_WEEKS'
      | 'SEMI_MONTHLY'
      | 'MONTHLY'
      | 'QUARTERLY'
      | 'SEMI_ANNUALLY'
      | 'ANNUALLY'
      | 'EVERY_2_MONTHS'
      | 'EBILL'
      | 'FIRST_DAY_MONTHLY'
      | 'LAST_DAY_MONTHLY'
      | 'EVERY_4_WEEKS'
      | 'UNKNOWN'
      | 'OTHER'
    accountStatus?:
      | 'ACTIVE'
      | 'INACTIVE'
      | 'TO_BE_CLOSED'
      | 'CLOSED'
      | 'DELETED'
    amountDue?: /* Money */ Money
    /**
     * List of loan accounts to which a real-estate account is linked.
     */
    linkedAccountIds?: number /* int64 */[]
    balance?: /* Money */ Money
    isEbillEnrolled?: string
    nickname?: string
  }
  /**
   * UpdateAccountRequest
   */
  export interface UpdateAccountRequest {
    account: /* UpdateAccountInfo */ UpdateAccountInfo
  }
  /**
   * UpdateCategoryRequest
   */
  export interface UpdateCategoryRequest {
    highLevelCategoryName?: string
    id: number // int64
    source: 'SYSTEM' | 'USER'
    categoryName?: string
  }
  /**
   * UpdateCobrandNotificationEvent
   */
  export interface UpdateCobrandNotificationEvent {
    /**
     * URL to which the notification should be posted.<br><br><b>Endpoints</b>:<ul><li>GET cobrand/config/notifications/events</li></ul>
     */
    callbackUrl?: string
  }
  /**
   * UpdateCobrandNotificationEventRequest
   */
  export interface UpdateCobrandNotificationEventRequest {
    event: /* UpdateCobrandNotificationEvent */ UpdateCobrandNotificationEvent
  }
  /**
   * UpdateConfigsNotificationEvent
   */
  export interface UpdateConfigsNotificationEvent {
    /**
     * URL to which the notification should be posted.<br><br><b>Endpoints</b>:<ul><li>GET configs/notifications/events</li></ul>
     */
    callbackUrl?: string
  }
  /**
   * UpdateConfigsNotificationEventRequest
   */
  export interface UpdateConfigsNotificationEventRequest {
    event: /* UpdateConfigsNotificationEvent */ UpdateConfigsNotificationEvent
  }
  /**
   * UpdateConsent
   */
  export interface UpdateConsent {
    /**
     * Unique identifier for consent. This is created during consent creation.
     */
    consentId?: number // int64
    /**
     * Authorization url generated for the request through PUT Consent to reach endsite.
     */
    authorizationUrl?: string
    /**
     * Unique identifier for the provider account resource. This is created during account addition.
     */
    providerId?: number // int64
  }
  /**
   * UpdateConsentRequest
   */
  export interface UpdateConsentRequest {
    /**
     * Applicable Open Banking data cluster values.<br><br><b>Endpoints</b>:<ul><li>PUT Consent</li></ul>
     */
    scopeId?: Array<| 'ACCOUNT_DETAILS'
      | 'TRANSACTION_DETAILS'
      | 'STATEMENT_DETAILS'
      | 'CONTACT_DETAILS'>
  }
  /**
   * UpdateTransaction
   */
  export interface UpdateTransaction {
    categorySource: 'SYSTEM' | 'USER'
    container:
      | 'bank'
      | 'creditCard'
      | 'investment'
      | 'insurance'
      | 'loan'
      | 'reward'
      | 'bill'
      | 'realEstate'
      | 'otherAssets'
      | 'otherLiabilities'
    isPhysical?: boolean
    detailCategoryId?: number // int64
    description?: /* Description */ Description
    memo?: string
    merchantType?: 'BILLERS' | 'SUBSCRIPTION' | 'OTHERS'
    categoryId: number // int64
  }
  /**
   * UpdateUserRegistration
   */
  export interface UpdateUserRegistration {
    preferences?: /* UserRequestPreferences */ UserRequestPreferences
    address?: /* UserAddress */ UserAddress
    name?: /* Name */ Name
    email?: string
    segmentName?: string
  }
  /**
   * UpdateUserRequest
   */
  export interface UpdateUserRequest {
    user: /* UpdateUserRegistration */ UpdateUserRegistration
  }
  /**
   * UpdateVerification
   */
  export interface UpdateVerification {
    /**
     * Unique identifier for the account.<br><br><b>Endpoints</b>:<ul><li>POST verification</li><li>GET verification</li><li>PUT verification</li></ul>
     */
    accountId?: number // int64
    /**
     * The reason the account verification failed.<br><br><b>Endpoints</b>:<ul><li>POST verification</li><li>GET verification</li><li>PUT verification</li></ul>
     */
    reason?:
      | 'DATA_NOT_AVAILABLE'
      | 'ACCOUNT_HOLDER_MISMATCH'
      | 'FULL_ACCOUNT_NUMBER_AND_BANK_TRANSFER_CODE_NOT_AVAILABLE'
      | 'FULL_ACCOUNT_NUMBER_NOT_AVAILABLE'
      | 'BANK_TRANSFER_CODE_NOT_AVAILABLE'
      | 'EXPIRED'
      | 'DATA_MISMATCH'
      | 'INSTRUCTION_GENERATION_ERROR'
    /**
     * The status of the account verification.<br><br><b>Endpoints</b>:<ul><li>POST verification</li><li>GET verification</li><li>PUT verification</li></ul><br><b>Applicable Values</b>
     */
    verificationStatus?: 'INITIATED' | 'DEPOSITED' | 'SUCCESS' | 'FAILED'
    /**
     * Unique identifier for the provider account.<br><br><b>Endpoints</b>:<ul><li>POST verification</li><li>GET verification</li><li>PUT verification</li></ul>
     */
    providerAccountId?: number // int64
    /**
     * The account verification type.<br><br><b>Endpoints</b>:<ul><li>POST verification</li><li>GET verification</li><li>PUT verification</li></ul><br><b>Applicable Values</b>
     */
    verificationType?: 'MATCHING' | 'CHALLENGE_DEPOSIT'
    account?: /* VerificationAccount */ VerificationAccount
    transaction: /* VerificationTransaction */ VerificationTransaction[]
    /**
     * The date of the account verification.<br><br><b>Endpoints</b>:<ul><li>POST verification</li><li>GET verification</li><li>PUT verification</li></ul>
     */
    verificationDate?: string
    /**
     * Unique identifier for the verification request.<br><br><b>Endpoints</b>:<ul><li>POST verification</li><li>GET verification</li><li>PUT verification</li></ul>
     */
    verificationId?: number // int64
  }
  /**
   * UpdateVerificationRequest
   */
  export interface UpdateVerificationRequest {
    verification?: /* UpdateVerification */ UpdateVerification
  }
  /**
   * UpdatedConsentResponse
   */
  export interface UpdatedConsentResponse {
    consent?: /* UpdateConsent */ UpdateConsent[]
  }
  /**
   * UpdatedProviderAccount
   */
  export interface UpdatedProviderAccount {
    /**
     * Indicate when the providerAccount is last updated successfully.<br><br><b>Account Type</b>: Aggregated<br><b>Endpoints</b>:<ul><li>GET dataExtracts/userData</li></ul>
     */
    lastUpdated?: string
    /**
     * This entity gets returned in the response for only MFA based provider accounts during the add/update account polling process. This indicates that the MFA information is expected from the user to complete the process. This represents the structure of MFA form that is displayed to the user in the provider site.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts</li><li>POST providerAccounts</li><li>PUT providerAccounts/{providerAccountId}</li><li>GET providerAccounts/{providerAccountId}</li></ul>
     */
    loginForm?: /* LoginForm */ LoginForm[]
    /**
     * The date on when the provider account is created in the system.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts</li><li>POST providerAccounts</li><li>PUT providerAccounts/{providerAccountId}</li><li>GET providerAccounts/{providerAccountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    createdDate?: string
    /**
     * The source through which the providerAccount is added in the system.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts</li><li>POST providerAccounts</li><li>PUT providerAccounts/{providerAccountId}</li><li>GET providerAccounts/{providerAccountId}</li><li>GET dataExtracts/userData</li></ul><b>Applicable Values</b><br>
     */
    aggregationSource?: 'SYSTEM' | 'USER'
    /**
     * Indicates the migration status of the provider account from screen-scraping provider to the Open Banking provider. <br><br><b>Endpoints</b>:<ul><li>GET providerAccounts</li><li>GET providerAccounts/{providerAccountId}</li><li>PUT providerAccounts/{providerAccountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    oauthMigrationStatus?:
      | 'IN_PROGRESS'
      | 'TO_BE_MIGRATED'
      | 'COMPLETED'
      | 'MIGRATED'
    /**
     * Unique identifier for the provider resource. This denotes the provider for which the provider account id is generated by the user.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts</li><li>POST providerAccounts</li><li>PUT providerAccounts/{providerAccountId}</li><li>GET providerAccounts/{providerAccountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    providerId?: number // int64
    /**
     * Unique id generated to indicate the request.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts</li><li>POST providerAccounts</li><li>PUT providerAccounts/{providerAccountId}</li><li>GET providerAccounts/{providerAccountId}</li></ul>
     */
    requestId?: string
    /**
     * Indicates whether account is a manual or aggregated provider account.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts</li><li>POST providerAccounts</li><li>PUT providerAccounts/{providerAccountId}</li><li>GET providerAccounts/{providerAccountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    isManual?: boolean
    /**
     * Unique identifier for the provider account resource. This is created during account addition.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts</li><li>POST providerAccounts</li><li>PUT providerAccounts/{providerAccountId}</li><li>GET providerAccounts/{providerAccountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    id?: number // int64
    /**
     * Logical grouping of dataset attributes into datasets such as Basic Aggregation Data, Account Profile and Documents.<br><br><b>Endpoints</b>:<ul><li>GET providerAccounts</li><li>POST providerAccounts</li><li>PUT providerAccounts/{providerAccountId}</li><li>GET providerAccounts/{providerAccountId}</li><li>GET dataExtracts/userData</li></ul>
     */
    dataset?: /* AccountDataset */ AccountDataset[]
    /**
     * The status of last update attempted for the account. <br><br><b>Endpoints</b>:<ul><li>GET providerAccounts</li><li>POST providerAccounts</li><li>PUT providerAccounts/{providerAccountId}</li><li>GET providerAccounts/{providerAccountId}</li><li>GET dataExtracts/userData</li></ul><b>Applicable Values</b><br>
     */
    status?:
      | 'LOGIN_IN_PROGRESS'
      | 'USER_INPUT_REQUIRED'
      | 'IN_PROGRESS'
      | 'PARTIAL_SUCCESS'
      | 'SUCCESS'
      | 'FAILED'
      | 'MIGRATION_IN_PROGRESS'
  }
  /**
   * UpdatedProviderAccountResponse
   */
  export interface UpdatedProviderAccountResponse {
    providerAccount?: /* UpdatedProviderAccount */ UpdatedProviderAccount[]
  }
  /**
   * User
   */
  export interface User {
    /**
     * Preferences of the user to be respected in the data provided through various API services.<br><br><b>Endpoints</b>:<ul><li>POST user/samlLogin</li><li>POST user/register</li><li>GET user</li></ul>
     */
    preferences?: /* UserResponsePreferences */ UserResponsePreferences
    /**
     * Session token of the user using which other services are invoked in the system.<br><br><b>Endpoints</b>:<ul><li>POST user/samlLogin</li><li>POST user/register</li></ul>
     */
    session?: /* UserSession */ UserSession
    /**
     * The login name of the user used for authentication.<br><br><b>Endpoints</b>:<ul><li>POST user/register</li><li>GET user</li></ul>
     */
    loginName?: string
    /**
     * First, middle and last names of the user.<br><br><b>Endpoints</b>:<ul><li>POST user/samlLogin</li><li>POST user/register</li><li>GET user</li></ul>
     */
    name?: /* Name */ Name
    /**
     * The unique identifier of a consumer/user in Yodlee system for whom the API services would be accessed for.<br><br><b>Endpoints</b>:<ul><li>POST user/samlLogin</li><li>POST user/register</li><li>GET user</li></ul>
     */
    id?: number // int64
    roleType?: 'INDIVIDUAL'
  }
  /**
   * UserAccessToken
   */
  export interface UserAccessToken {
    accessTokens?: /* AccessTokens */ AccessTokens[]
  }
  /**
   * UserAccessTokensResponse
   */
  export interface UserAccessTokensResponse {
    user?: /* UserAccessToken */ UserAccessToken
  }
  /**
   * UserAddress
   */
  export interface UserAddress {
    zip?: string
    country?: string
    address3?: string
    address2?: string
    city?: string
    address1?: string
    state?: string
  }
  /**
   * UserDetail
   */
  export interface UserDetail {
    /**
     * Preferences of the user to be respected in the data provided through various API services.<br><br><b>Endpoints</b>:<ul><li>POST user/samlLogin</li><li>POST user/register</li><li>GET user</li></ul>
     */
    preferences?: /* UserResponsePreferences */ UserResponsePreferences
    /**
     * The address of the user.<br><br><b>Endpoints</b>:<ul><li>GET user</li></ul>
     */
    address?: /* UserAddress */ UserAddress
    /**
     * The login name of the user used for authentication.<br><br><b>Endpoints</b>:<ul><li>POST user/register</li><li>GET user</li></ul>
     */
    loginName?: string
    /**
     * First, middle and last names of the user.<br><br><b>Endpoints</b>:<ul><li>POST user/samlLogin</li><li>POST user/register</li><li>GET user</li></ul>
     */
    name?: /* Name */ Name
    /**
     * The unique identifier of a consumer/user in Yodlee system for whom the API services would be accessed for.<br><br><b>Endpoints</b>:<ul><li>POST user/samlLogin</li><li>POST user/register</li><li>GET user</li></ul>
     */
    id?: number // int64
    roleType?: 'INDIVIDUAL'
    /**
     * The email address of the user.<br><br><b>Endpoints</b>:<ul><li>GET user</li></ul>
     */
    email?: string
    segmentName?: string
  }
  /**
   * UserDetailResponse
   */
  export interface UserDetailResponse {
    user?: /* UserDetail */ UserDetail
  }
  /**
   * UserRegistration
   */
  export interface UserRegistration {
    preferences?: /* UserRequestPreferences */ UserRequestPreferences
    address?: /* UserAddress */ UserAddress
    loginName: string
    name?: /* Name */ Name
    email?: string
    segmentName?: string
  }
  /**
   * UserRequest
   */
  export interface UserRequest {
    user: /* UserRegistration */ UserRegistration
  }
  /**
   * UserRequestPreferences
   */
  export interface UserRequestPreferences {
    /**
     * The dateformat of the user.This attribute is just a place holder and has no impact on any other API services.
     */
    dateFormat?: string
    /**
     * The timezone of the user. This attribute is just a place holder and has no impact on any other API services.
     */
    timeZone?: string
    /**
     * The currency of the user. This currency will be respected while providing the response for derived API services.<br><b>Applicable Values</b><br>
     */
    currency?:
      | 'USD'
      | 'AUD'
      | 'BRL'
      | 'CAD'
      | 'EUR'
      | 'GBP'
      | 'HKD'
      | 'IDR'
      | 'INR'
      | 'JPY'
      | 'NZD'
      | 'SGD'
      | 'ZAR'
      | 'CNY'
      | 'VND'
      | 'MYR'
      | 'CHF'
      | 'AED'
      | 'AFA'
      | 'ALL'
      | 'AMD'
      | 'ANG'
      | 'AOA'
      | 'ARS'
      | 'AWG'
      | 'AZM'
      | 'BAM'
      | 'BBD'
      | 'BDT'
      | 'BGL'
      | 'BHD'
      | 'BIF'
      | 'BMD'
      | 'BND'
      | 'BOB'
      | 'BSD'
      | 'BTN'
      | 'BWP'
      | 'BYR'
      | 'BZD'
      | 'CDF'
      | 'CLP'
      | 'COP'
      | 'CRC'
      | 'CUP'
      | 'CVE'
      | 'CYP'
      | 'CZK'
      | 'DJF'
      | 'DKK'
      | 'DOP'
      | 'DZD'
      | 'EEK'
      | 'EGP'
      | 'ERN'
      | 'ETB'
      | 'FJD'
      | 'FKP'
      | 'GEL'
      | 'GGP'
      | 'GHC'
      | 'GIP'
      | 'GMD'
      | 'GNF'
      | 'GTQ'
      | 'GYD'
      | 'HNL'
      | 'HRK'
      | 'HTG'
      | 'HUF'
      | 'ILS'
      | 'IMP'
      | 'IQD'
      | 'IRR'
      | 'ISK'
      | 'JEP'
      | 'JMD'
      | 'JOD'
      | 'KES'
      | 'KGS'
      | 'KHR'
      | 'KMF'
      | 'KPW'
      | 'KRW'
      | 'KWD'
      | 'KYD'
      | 'KZT'
      | 'LAK'
      | 'LBP'
      | 'LKR'
      | 'LRD'
      | 'LSL'
      | 'LTL'
      | 'LVL'
      | 'LYD'
      | 'MAD'
      | 'MDL'
      | 'MGF'
      | 'MKD'
      | 'MMK'
      | 'MNT'
      | 'MOP'
      | 'MRO'
      | 'MTL'
      | 'MUR'
      | 'MVR'
      | 'MWK'
      | 'MXN'
      | 'MZM'
      | 'NAD'
      | 'NGN'
      | 'NIO'
      | 'NOK'
      | 'NPR'
      | 'OMR'
      | 'PAB'
      | 'PEN'
      | 'PGK'
      | 'PHP'
      | 'PKR'
      | 'PLN'
      | 'PYG'
      | 'QAR'
      | 'ROL'
      | 'RUR'
      | 'RWF'
      | 'SAR'
      | 'SBD'
      | 'SCR'
      | 'SDD'
      | 'SEK'
      | 'SHP'
      | 'SIT'
      | 'SKK'
      | 'SLL'
      | 'SOS'
      | 'SPL'
      | 'SRG'
      | 'STD'
      | 'SVC'
      | 'SYP'
      | 'SZL'
      | 'THB'
      | 'TJR'
      | 'TMM'
      | 'TND'
      | 'TOP'
      | 'TRL'
      | 'TTD'
      | 'TVD'
      | 'TWD'
      | 'TZS'
      | 'UAH'
      | 'UGX'
      | 'UYU'
      | 'UZS'
      | 'VEB'
      | 'VUV'
      | 'WST'
      | 'XAF'
      | 'XAG'
      | 'XAU'
      | 'XCD'
      | 'XDR'
      | 'XOF'
      | 'XPD'
      | 'XPF'
      | 'XPT'
      | 'YER'
      | 'YUM'
      | 'ZMK'
      | 'ZWD'
      | 'ADP'
      | 'ATS'
      | 'BEF'
      | 'BUK'
      | 'CSD'
      | 'CSK'
      | 'DDM'
      | 'DEM'
      | 'ECS'
      | 'ESP'
      | 'FIM'
      | 'GRD'
      | 'GWP'
      | 'IEP'
      | 'ITL'
      | 'LUF'
      | 'MLF'
      | 'NLG'
      | 'PTE'
      | 'SUR'
      | 'TPE'
      | 'UAK'
      | 'XBA'
      | 'XBB'
      | 'XBC'
      | 'XBD'
      | 'XEU'
      | 'XFO'
      | 'XFU'
      | 'XGF'
      | 'XMK'
      | 'XRM'
      | 'XTS'
      | 'YDD'
      | 'YUD'
      | 'ZRN'
      | 'TJS'
      | 'RON'
      | 'BGN'
      | 'BTC'
      | 'XBT'
      | 'CNH'
      | 'RUB'
      | 'TRY'
      | 'GHS'
      | 'TMT'
      | 'ZMW'
      | 'VEF'
      | 'SSP'
      | 'ALK'
    /**
     * The locale of the user. This locale will be considered for localization features like providing the provider information in the supported locale or providing category names in the transaction related services.<br><b>Applicable Values</b><br>
     */
    locale?:
      | 'en_US'
      | 'en_AN'
      | 'en_GB'
      | 'en_AU'
      | 'en_BE'
      | 'zh_CN'
      | 'en_IN'
      | 'en_CA'
      | 'en_ES'
      | 'en_NZ'
      | 'en_IE'
      | 'en_IL'
      | 'en_FR'
      | 'en_AE'
      | 'en_FJ'
      | 'en_GU'
      | 'en_HK'
      | 'en_IT'
      | 'en_JP'
      | 'en_KH'
      | 'en_KP'
      | 'en_KR'
      | 'en_MY'
      | 'en_PG'
      | 'en_PH'
      | 'en_SB'
      | 'en_SG'
      | 'en_TH'
      | 'en_TO'
      | 'en_VN'
      | 'en_VU'
      | 'en_WS'
      | 'es_ES'
      | 'fr_CA'
      | 'fr_FR'
      | 'nl_AN'
      | 'en_CH'
      | 'en_ZA'
      | 'en_CN'
      | 'en_FI'
      | 'en_AT'
      | 'de_AT'
      | 'en_DE'
      | 'de_DE'
      | 'de_RU'
      | 'en_ID'
      | 'en_MX'
      | 'es_MX'
      | 'en_PT'
      | 'en_SE'
      | 'en_GLOBAL'
      | 'pt_BR'
      | 'en_DK'
      | 'en_BR'
      | 'en_BM'
      | 'en_CK'
      | 'en_CO'
      | 'en_JE'
      | 'en_BG'
      | 'en_BW'
      | 'en_MW'
      | 'en_KE'
      | 'en_SZ'
      | 'en_ZW'
      | 'en_NL'
      | 'nl_NL'
  }
  /**
   * UserResponse
   */
  export interface UserResponse {
    user?: /* User */ User
  }
  /**
   * UserResponsePreferences
   */
  export interface UserResponsePreferences {
    /**
     * The dateformat of the user.This attribute is just a place holder and has no impact on any other API services.
     */
    dateFormat?: string
    /**
     * The timezone of the user. This attribute is just a place holder and has no impact on any other API services.
     */
    timeZone?: string
    /**
     * The currency of the user. This currency will be respected while providing the response for derived API services.<br><b>Applicable Values</b><br>
     */
    currency?:
      | 'USD'
      | 'AUD'
      | 'BRL'
      | 'CAD'
      | 'EUR'
      | 'GBP'
      | 'HKD'
      | 'IDR'
      | 'INR'
      | 'JPY'
      | 'NZD'
      | 'SGD'
      | 'ZAR'
      | 'CNY'
      | 'VND'
      | 'MYR'
      | 'CHF'
      | 'AED'
      | 'AFA'
      | 'ALL'
      | 'AMD'
      | 'ANG'
      | 'AOA'
      | 'ARS'
      | 'AWG'
      | 'AZM'
      | 'BAM'
      | 'BBD'
      | 'BDT'
      | 'BGL'
      | 'BHD'
      | 'BIF'
      | 'BMD'
      | 'BND'
      | 'BOB'
      | 'BSD'
      | 'BTN'
      | 'BWP'
      | 'BYR'
      | 'BZD'
      | 'CDF'
      | 'CLP'
      | 'COP'
      | 'CRC'
      | 'CUP'
      | 'CVE'
      | 'CYP'
      | 'CZK'
      | 'DJF'
      | 'DKK'
      | 'DOP'
      | 'DZD'
      | 'EEK'
      | 'EGP'
      | 'ERN'
      | 'ETB'
      | 'FJD'
      | 'FKP'
      | 'GEL'
      | 'GGP'
      | 'GHC'
      | 'GIP'
      | 'GMD'
      | 'GNF'
      | 'GTQ'
      | 'GYD'
      | 'HNL'
      | 'HRK'
      | 'HTG'
      | 'HUF'
      | 'ILS'
      | 'IMP'
      | 'IQD'
      | 'IRR'
      | 'ISK'
      | 'JEP'
      | 'JMD'
      | 'JOD'
      | 'KES'
      | 'KGS'
      | 'KHR'
      | 'KMF'
      | 'KPW'
      | 'KRW'
      | 'KWD'
      | 'KYD'
      | 'KZT'
      | 'LAK'
      | 'LBP'
      | 'LKR'
      | 'LRD'
      | 'LSL'
      | 'LTL'
      | 'LVL'
      | 'LYD'
      | 'MAD'
      | 'MDL'
      | 'MGF'
      | 'MKD'
      | 'MMK'
      | 'MNT'
      | 'MOP'
      | 'MRO'
      | 'MTL'
      | 'MUR'
      | 'MVR'
      | 'MWK'
      | 'MXN'
      | 'MZM'
      | 'NAD'
      | 'NGN'
      | 'NIO'
      | 'NOK'
      | 'NPR'
      | 'OMR'
      | 'PAB'
      | 'PEN'
      | 'PGK'
      | 'PHP'
      | 'PKR'
      | 'PLN'
      | 'PYG'
      | 'QAR'
      | 'ROL'
      | 'RUR'
      | 'RWF'
      | 'SAR'
      | 'SBD'
      | 'SCR'
      | 'SDD'
      | 'SEK'
      | 'SHP'
      | 'SIT'
      | 'SKK'
      | 'SLL'
      | 'SOS'
      | 'SPL'
      | 'SRG'
      | 'STD'
      | 'SVC'
      | 'SYP'
      | 'SZL'
      | 'THB'
      | 'TJR'
      | 'TMM'
      | 'TND'
      | 'TOP'
      | 'TRL'
      | 'TTD'
      | 'TVD'
      | 'TWD'
      | 'TZS'
      | 'UAH'
      | 'UGX'
      | 'UYU'
      | 'UZS'
      | 'VEB'
      | 'VUV'
      | 'WST'
      | 'XAF'
      | 'XAG'
      | 'XAU'
      | 'XCD'
      | 'XDR'
      | 'XOF'
      | 'XPD'
      | 'XPF'
      | 'XPT'
      | 'YER'
      | 'YUM'
      | 'ZMK'
      | 'ZWD'
      | 'ADP'
      | 'ATS'
      | 'BEF'
      | 'BUK'
      | 'CSD'
      | 'CSK'
      | 'DDM'
      | 'DEM'
      | 'ECS'
      | 'ESP'
      | 'FIM'
      | 'GRD'
      | 'GWP'
      | 'IEP'
      | 'ITL'
      | 'LUF'
      | 'MLF'
      | 'NLG'
      | 'PTE'
      | 'SUR'
      | 'TPE'
      | 'UAK'
      | 'XBA'
      | 'XBB'
      | 'XBC'
      | 'XBD'
      | 'XEU'
      | 'XFO'
      | 'XFU'
      | 'XGF'
      | 'XMK'
      | 'XRM'
      | 'XTS'
      | 'YDD'
      | 'YUD'
      | 'ZRN'
      | 'TJS'
      | 'RON'
      | 'BGN'
      | 'BTC'
      | 'XBT'
      | 'CNH'
      | 'RUB'
      | 'TRY'
      | 'GHS'
      | 'TMT'
      | 'ZMW'
      | 'VEF'
      | 'SSP'
      | 'ALK'
    /**
     * The locale of the user. This locale will be considered for localization features like providing the provider information in the supported locale or providing category names in the transaction related services.<br><b>Applicable Values</b><br>
     */
    locale?:
      | 'en_US'
      | 'en_AN'
      | 'en_GB'
      | 'en_AU'
      | 'en_BE'
      | 'zh_CN'
      | 'en_IN'
      | 'en_CA'
      | 'en_ES'
      | 'en_NZ'
      | 'en_IE'
      | 'en_IL'
      | 'en_FR'
      | 'en_AE'
      | 'en_FJ'
      | 'en_GU'
      | 'en_HK'
      | 'en_IT'
      | 'en_JP'
      | 'en_KH'
      | 'en_KP'
      | 'en_KR'
      | 'en_MY'
      | 'en_PG'
      | 'en_PH'
      | 'en_SB'
      | 'en_SG'
      | 'en_TH'
      | 'en_TO'
      | 'en_VN'
      | 'en_VU'
      | 'en_WS'
      | 'es_ES'
      | 'fr_CA'
      | 'fr_FR'
      | 'nl_AN'
      | 'en_CH'
      | 'en_ZA'
      | 'en_CN'
      | 'en_FI'
      | 'en_AT'
      | 'de_AT'
      | 'en_DE'
      | 'de_DE'
      | 'de_RU'
      | 'en_ID'
      | 'en_MX'
      | 'es_MX'
      | 'en_PT'
      | 'en_SE'
      | 'en_GLOBAL'
      | 'pt_BR'
      | 'en_DK'
      | 'en_BR'
      | 'en_BM'
      | 'en_CK'
      | 'en_CO'
      | 'en_JE'
      | 'en_BG'
      | 'en_BW'
      | 'en_MW'
      | 'en_KE'
      | 'en_SZ'
      | 'en_ZW'
      | 'en_NL'
      | 'nl_NL'
  }
  /**
   * UserSession
   */
  export interface UserSession {
    /**
     * Session provided for a valid user to access API services upon successful authentication.<br><br><b>Endpoints</b>:<ul><li>POST user/samlLogin</li><li>POST user/register</li></ul>
     */
    userSession?: string
  }
  /**
   * Verification
   */
  export interface Verification {
    /**
     * Unique identifier for the account.<br><br><b>Endpoints</b>:<ul><li>POST verification</li><li>GET verification</li><li>PUT verification</li></ul>
     */
    accountId?: number // int64
    /**
     * The reason the account verification failed.<br><br><b>Endpoints</b>:<ul><li>POST verification</li><li>GET verification</li><li>PUT verification</li></ul>
     */
    reason?:
      | 'DATA_NOT_AVAILABLE'
      | 'ACCOUNT_HOLDER_MISMATCH'
      | 'FULL_ACCOUNT_NUMBER_AND_BANK_TRANSFER_CODE_NOT_AVAILABLE'
      | 'FULL_ACCOUNT_NUMBER_NOT_AVAILABLE'
      | 'BANK_TRANSFER_CODE_NOT_AVAILABLE'
      | 'EXPIRED'
      | 'DATA_MISMATCH'
      | 'INSTRUCTION_GENERATION_ERROR'
    /**
     * The status of the account verification.<br><br><b>Endpoints</b>:<ul><li>POST verification</li><li>GET verification</li><li>PUT verification</li></ul><br><b>Applicable Values</b>
     */
    verificationStatus?: 'INITIATED' | 'DEPOSITED' | 'SUCCESS' | 'FAILED'
    /**
     * Unique identifier for the provider account.<br><br><b>Endpoints</b>:<ul><li>POST verification</li><li>GET verification</li><li>PUT verification</li></ul>
     */
    providerAccountId?: number // int64
    /**
     * The account verification type.<br><br><b>Endpoints</b>:<ul><li>POST verification</li><li>GET verification</li><li>PUT verification</li></ul><br><b>Applicable Values</b>
     */
    verificationType?: 'MATCHING' | 'CHALLENGE_DEPOSIT'
    account?: /* VerificationAccount */ VerificationAccount
    /**
     * The date of the account verification.<br><br><b>Endpoints</b>:<ul><li>POST verification</li><li>GET verification</li><li>PUT verification</li></ul>
     */
    verificationDate?: string
    /**
     * Unique identifier for the verification request.<br><br><b>Endpoints</b>:<ul><li>POST verification</li><li>GET verification</li><li>PUT verification</li></ul>
     */
    verificationId?: number // int64
  }
  /**
   * VerificationAccount
   */
  export interface VerificationAccount {
    accountName?: string
    accountType: 'SAVINGS' | 'CHECKING'
    accountNumber: string
    bankTransferCode: /* VerificationBankTransferCode */ VerificationBankTransferCode
  }
  /**
   * VerificationBankTransferCode
   */
  export interface VerificationBankTransferCode {
    /**
     * The FI's branch identification number.Additional Details: The routing number of the bank account in the United States. For non-United States accounts, it is the IFSC code (India), BSB number (Australia), and sort code (United Kingdom). <br><b>Account Type</b>: Aggregated<br><b>Applicable containers</b>: bank, investment<br><b>Endpoints</b>:<br><ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>POST verification</li></ul>
     */
    id?: string
    /**
     * The bank transfer code type varies depending on the region of the account origination. <br><b>Account Type</b>: Aggregated<br><b>Applicable containers</b>: bank, investment<br><b>Endpoints</b>:<br><ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>POST verification</li></ul><b>Applicable Values</b><br>
     */
    type?: 'BSB' | 'IFSC' | 'ROUTING_NUMBER' | 'SORT_CODE'
  }
  /**
   * VerificationHolder
   */
  export interface VerificationHolder {
    /**
     * Indicates the ownership of the account
     */
    ownership?: string
    /**
     * The name of the account holder
     */
    name?: /* Name */ Name
  }
  /**
   * VerificationHolderProfile
   */
  export interface VerificationHolderProfile {
    /**
     * The primary key of the account resource and the unique identifier for the account
     */
    accountId?: number // int64
    /**
     * The account holder's address available at the profile and account levels
     */
    address?: /* AbstractAddress */ AbstractAddress[]
    /**
     * The account holder's phone number available at the profile and account levels
     */
    phoneNumber?: /* PhoneNumber */ PhoneNumber[]
    /**
     * The primary key of the provider account resource
     */
    providerAccountId?: number // int64
    /**
     * The holder entity is account-specific and captures the ownership status and the name details of the user
     */
    holder?: /* VerificationHolder */ VerificationHolder[]
    /**
     * The account holder's email ID available at the profile and account levels
     */
    email?: /* Email */ Email[]
  }
  /**
   * VerificationRequest
   */
  export interface VerificationRequest {
    verification: /* Verification */ Verification
  }
  /**
   * VerificationResponse
   */
  export interface VerificationResponse {
    verification?: /* Verification */ Verification[]
  }
  /**
   * VerificationStatus
   */
  export interface VerificationStatus {
    /**
     * Unique identifier for the account.<br><br><b>Endpoints</b>:<ul><li>POST verification</li><li>GET verification</li><li>PUT verification</li></ul>
     */
    accountId?: number // int64
    /**
     * The reason the account verification failed.<br><br><b>Endpoints</b>:<ul><li>POST verification</li><li>GET verification</li><li>PUT verification</li></ul>
     */
    reason?:
      | 'DATA_NOT_AVAILABLE'
      | 'ACCOUNT_HOLDER_MISMATCH'
      | 'FULL_ACCOUNT_NUMBER_AND_BANK_TRANSFER_CODE_NOT_AVAILABLE'
      | 'FULL_ACCOUNT_NUMBER_NOT_AVAILABLE'
      | 'BANK_TRANSFER_CODE_NOT_AVAILABLE'
      | 'EXPIRED'
      | 'DATA_MISMATCH'
      | 'INSTRUCTION_GENERATION_ERROR'
    /**
     * The status of the account verification.<br><br><b>Endpoints</b>:<ul><li>POST verification</li><li>GET verification</li><li>PUT verification</li></ul><br><b>Applicable Values</b>
     */
    verificationStatus?: 'INITIATED' | 'DEPOSITED' | 'SUCCESS' | 'FAILED'
    /**
     * Unique identifier for the provider account.<br><br><b>Endpoints</b>:<ul><li>POST verification</li><li>GET verification</li><li>PUT verification</li></ul>
     */
    providerAccountId?: number // int64
    /**
     * The account verification type.<br><br><b>Endpoints</b>:<ul><li>POST verification</li><li>GET verification</li><li>PUT verification</li></ul><br><b>Applicable Values</b>
     */
    verificationType?: 'MATCHING' | 'CHALLENGE_DEPOSIT'
    account?: /* VerificationAccount */ VerificationAccount
    remainingAttempts?: number // int64
    /**
     * The date of the account verification.<br><br><b>Endpoints</b>:<ul><li>POST verification</li><li>GET verification</li><li>PUT verification</li></ul>
     */
    verificationDate?: string
    /**
     * Unique identifier for the verification request.<br><br><b>Endpoints</b>:<ul><li>POST verification</li><li>GET verification</li><li>PUT verification</li></ul>
     */
    verificationId?: number // int64
  }
  /**
   * VerificationStatusResponse
   */
  export interface VerificationStatusResponse {
    verification?: /* VerificationStatus */ VerificationStatus[]
  }
  /**
   * VerificationTransaction
   */
  export interface VerificationTransaction {
    amount: /* Money */ Money
    baseType: 'CREDIT' | 'DEBIT'
  }
  /**
   * VerifiedAccount
   */
  export interface VerifiedAccount {
    fullAccountNumber?: string
    /**
     * The type of account that is aggregated, i.e., savings, checking, credit card, charge, HELOC, etc. The account type is derived based on the attributes of the account. <br><b>Valid Values:</b><br><b>Aggregated Account Type</b><br><b>bank</b><ul><li>CHECKING</li><li>SAVINGS</li><li>CD</li><li>PPF</li><li>RECURRING_DEPOSIT</li><li>FSA</li><li>MONEY_MARKET</li><li>IRA</li><li>PREPAID</li></ul><b>creditCard</b><ul><li>OTHER</li><li>CREDIT</li><li>STORE</li><li>CHARGE</li><li>OTHER</li></ul><b>investment (SN 1.0)</b><ul><li>BROKERAGE_MARGIN</li><li>HSA</li><li>IRA</li><li>BROKERAGE_CASH</li><li>401K</li><li>403B</li><li>TRUST</li><li>ANNUITY</li><li>SIMPLE</li><li>CUSTODIAL</li><li>BROKERAGE_CASH_OPTION</li><li>BROKERAGE_MARGIN_OPTION</li><li>INDIVIDUAL</li><li>CORPORATE</li><li>JTTIC</li><li>JTWROS</li><li>COMMUNITY_PROPERTY</li><li>JOINT_BY_ENTIRETY</li><li>CONSERVATORSHIP</li><li>ROTH</li><li>ROTH_CONVERSION</li><li>ROLLOVER</li><li>EDUCATIONAL</li><li>529_PLAN</li><li>457_DEFERRED_COMPENSATION</li><li>401A</li><li>PSP</li><li>MPP</li><li>STOCK_BASKET</li><li>LIVING_TRUST</li><li>REVOCABLE_TRUST</li><li>IRREVOCABLE_TRUST</li><li>CHARITABLE_REMAINDER</li><li>CHARITABLE_LEAD</li><li>CHARITABLE_GIFT_ACCOUNT</li><li>SEP</li><li>UTMA</li><li>UGMA</li><li>ESOPP</li><li>ADMINISTRATOR</li><li>EXECUTOR</li><li>PARTNERSHIP</li><li>SOLE_PROPRIETORSHIP</li><li>CHURCH</li><li>INVESTMENT_CLUB</li><li>RESTRICTED_STOCK_AWARD</li><li>CMA</li><li>EMPLOYEE_STOCK_PURCHASE_PLAN</li><li>PERFORMANCE_PLAN</li><li>BROKERAGE_LINK_ACCOUNT</li><li>MONEY_MARKET</li><li>SUPER_ANNUATION</li><li>REGISTERED_RETIREMENT_SAVINGS_PLAN</li><li>SPOUSAL_RETIREMENT_SAVINGS_PLAN</li><li>DEFERRED_PROFIT_SHARING_PLAN</li><li>NON_REGISTERED_SAVINGS_PLAN</li><li>REGISTERED_EDUCATION_SAVINGS_PLAN</li><li>GROUP_RETIREMENT_SAVINGS_PLAN</li><li>LOCKED_IN_RETIREMENT_SAVINGS_PLAN</li><li>RESTRICTED_LOCKED_IN_SAVINGS_PLAN</li><li>LOCKED_IN_RETIREMENT_ACCOUNT</li><li>REGISTERED_PENSION_PLAN</li><li>TAX_FREE_SAVINGS_ACCOUNT</li><li>LIFE_INCOME_FUND</li><li>REGISTERED_RETIREMENT_INCOME_FUND</li><li>SPOUSAL_RETIREMENT_INCOME_FUND</li><li>LOCKED_IN_REGISTERED_INVESTMENT_FUND</li><li>PRESCRIBED_REGISTERED_RETIREMENT_INCOME_FUND</li><li>GUARANTEED_INVESTMENT_CERTIFICATES</li><li>REGISTERED_DISABILITY_SAVINGS_PLAN</li><li>DIGITAL_WALLET</li><li>OTHER</li></ul><b>investment (SN 2.0)</b><ul><li>BROKERAGE_CASH</li><li>BROKERAGE_MARGIN</li><li>INDIVIDUAL_RETIREMENT_ACCOUNT_IRA</li><li>EMPLOYEE_RETIREMENT_ACCOUNT_401K</li><li>EMPLOYEE_RETIREMENT_SAVINGS_PLAN_403B</li><li>TRUST</li><li>ANNUITY</li><li>SIMPLE_IRA</li><li>CUSTODIAL_ACCOUNT</li><li>BROKERAGE_CASH_OPTION</li><li>BROKERAGE_MARGIN_OPTION</li><li>INDIVIDUAL</li><li>CORPORATE_INVESTMENT_ACCOUNT</li><li>JOINT_TENANTS_TENANCY_IN_COMMON_JTIC</li><li>JOINT_TENANTS_WITH_RIGHTS_OF_SURVIVORSHIP_JTWROS</li><li>JOINT_TENANTS_COMMUNITY_PROPERTY</li><li>JOINT_TENANTS_TENANTS_BY_ENTIRETY</li><li>CONSERVATOR</li><li>ROTH_IRA</li><li>ROTH_CONVERSION</li><li>ROLLOVER_IRA</li><li>EDUCATIONAL</li><li>EDUCATIONAL_SAVINGS_PLAN_529</li><li>DEFERRED_COMPENSATION_PLAN_457</li><li>MONEY_PURCHASE_RETIREMENT_PLAN_401A</li><li>PROFIT_SHARING_PLAN</li><li>MONEY_PURCHASE_PLAN</li><li>STOCK_BASKET_ACCOUNT</li><li>LIVING_TRUST</li><li>REVOCABLE_TRUST</li><li>IRREVOCABLE_TRUST</li><li>CHARITABLE_REMAINDER_TRUST</li><li>CHARITABLE_LEAD_TRUST</li><li>CHARITABLE_GIFT_ACCOUNT</li><li>SEP_IRA</li><li>UNIFORM_TRANSFER_TO_MINORS_ACT_UTMA</li><li>UNIFORM_GIFT_TO_MINORS_ACT_UGMA</li><li>EMPLOYEE_STOCK_OWNERSHIP_PLAN_ESOP</li><li>ADMINISTRATOR</li><li>EXECUTOR</li><li>PARTNERSHIP</li><li>PROPRIETORSHIP</li><li>CHURCH_ACCOUNT</li><li>INVESTMENT_CLUB</li><li>RESTRICTED_STOCK_AWARD</li><li>CASH_MANAGEMENT_ACCOUNT</li><li>EMPLOYEE_STOCK_PURCHASE_PLAN_ESPP</li><li>PERFORMANCE_PLAN</li><li>BROKERAGE_LINK_ACCOUNT</li><li>MONEY_MARKET_ACCOUNT</li><li>SUPERANNUATION</li><li>REGISTERED_RETIREMENT_SAVINGS_PLAN_RRSP</li><li>SPOUSAL_RETIREMENT_SAVINGS_PLAN_SRSP</li><li>DEFERRED_PROFIT_SHARING_PLAN_DPSP</li><li>NON_REGISTERED_SAVINGS_PLAN_NRSP</li><li>REGISTERED_EDUCATION_SAVINGS_PLAN_RESP</li><li>GROUP_RETIREMENT_SAVINGS_PLAN_GRSP</li><li>LOCKED_IN_RETIREMENT_SAVINGS_PLAN_LRSP</li><li>RESTRICTED_LOCKED_IN_SAVINGS_PLAN_RLSP</li><li>LOCKED_IN_RETIREMENT_ACCOUNT_LIRA</li><li>REGISTERED_PENSION_PLAN_RPP</li><li>TAX_FREE_SAVINGS_ACCOUNT_TFSA</li><li>LIFE_INCOME_FUND_LIF</li><li>REGISTERED_RETIREMENT_INCOME_FUND_RIF</li><li>SPOUSAL_RETIREMENT_INCOME_FUND_SRIF</li><li>LOCKED_IN_REGISTERED_INVESTMENT_FUND_LRIF</li><li>PRESCRIBED_REGISTERED_RETIREMENT_INCOME_FUND_PRIF</li><li>GUARANTEED_INVESTMENT_CERTIFICATES_GIC</li><li>REGISTERED_DISABILITY_SAVINGS_PLAN_RDSP</li><li>DEFINED_CONTRIBUTION_PLAN</li><li>DEFINED_BENEFIT_PLAN</li><li>EMPLOYEE_STOCK_OPTION_PLAN</li><li>NONQUALIFIED_DEFERRED_COMPENSATION_PLAN_409A</li><li>KEOGH_PLAN</li><li>EMPLOYEE_RETIREMENT_ACCOUNT_ROTH_401K</li><li>DEFERRED_CONTINGENT_CAPITAL_PLAN_DCCP</li><li>EMPLOYEE_BENEFIT_PLAN</li><li>EMPLOYEE_SAVINGS_PLAN</li><li>HEALTH_SAVINGS_ACCOUNT_HSA</li><li>COVERDELL_EDUCATION_SAVINGS_ACCOUNT_ESA</li><li>TESTAMENTARY_TRUST</li><li>ESTATE</li><li>GRANTOR_RETAINED_ANNUITY_TRUST_GRAT</li><li>ADVISORY_ACCOUNT</li><li>NON_PROFIT_ORGANIZATION_501C</li><li>HEALTH_REIMBURSEMENT_ARRANGEMENT_HRA</li><li>INDIVIDUAL_SAVINGS_ACCOUNT_ISA</li><li>CASH_ISA</li><li>STOCKS_AND_SHARES_ISA</li><li>INNOVATIVE_FINANCE_ISA</li><li>JUNIOR_ISA</li><li>EMPLOYEES_PROVIDENT_FUND_ORGANIZATION_EPFO</li><li>PUBLIC_PROVIDENT_FUND_PPF</li><li>EMPLOYEES_PENSION_SCHEME_EPS</li><li>NATIONAL_PENSION_SYSTEM_NPS</li><li>INDEXED_ANNUITY</li><li>ANNUITIZED_ANNUITY</li><li>VARIABLE_ANNUITY</li><li>ROTH_403B</li><li>SPOUSAL_IRA</li><li>SPOUSAL_ROTH_IRA</li><li>SARSEP_IRA</li><li>SUBSTANTIALLY_EQUAL_PERIODIC_PAYMENTS_SEPP</li><li>OFFSHORE_TRUST</li><li>IRREVOCABLE_LIFE_INSURANCE_TRUST</li><li>INTERNATIONAL_TRUST</li><li>LIFE_INTEREST_TRUST</li><li>EMPLOYEE_BENEFIT_TRUST</li><li>PRECIOUS_METAL_ACCOUNT</li><li>INVESTMENT_LOAN_ACCOUNT</li><li>GRANTOR_RETAINED_INCOME_TRUST</li><li>PENSION_PLAN</li><li>DIGITAL_WALLET</li><li>OTHER</li></ul><b>loan</b><ul><li>MORTGAGE</li><li>INSTALLMENT_LOAN</li><li>PERSONAL_LOAN</li><li>HOME_EQUITY_LINE_OF_CREDIT</li><li>LINE_OF_CREDIT</li><li>AUTO_LOAN</li><li>STUDENT_LOAN</li><li>HOME_LOAN</li></ul><b>insurance</b><ul><li>AUTO_INSURANCE</li><li>HEALTH_INSURANCE</li><li>HOME_INSURANCE</li><li>LIFE_INSURANCE</li><li>ANNUITY</li><li>TRAVEL_INSURANCE</li><li>INSURANCE</li></ul><b>realEstate</b><ul> <li>REAL_ESTATE</li></ul><b>reward</b><ul><li>REWARD_POINTS</li></ul><b>Manual Account Type</b><br><b>bank</b><ul><li>CHECKING</li><li>SAVINGS</li><li>CD</li><li>PREPAID</li></ul><b>credit</b><ul>  <li>CREDIT</li></ul><b>loan</b><ul>  <li>PERSONAL_LOAN</li><li>HOME_LOAN</li></ul><b>insurance</b><ul><li>INSURANCE</li><li>ANNUITY</li></ul><b>investment</b><ul><li>BROKERAGE_CASH</li></ul><br><br><b>Aggregated / Manual</b>: Both <br><b>Applicable containers</b>: All containers<br></ul>
     */
    accountType?: string
    /**
     * The primary key of the provider account resource.<br><br><b>Aggregated / Manual</b>: Both <br><b>Applicable containers</b>: All containers<br>
     */
    providerAccountId?: number // int64
    holder?: /* AccountHolder */ AccountHolder[]
    id?: number // int64
    /**
     * The account number as it appears on the site. (The POST accounts service response return this field as number)<br><b>Additional Details</b>:<b> Bank/ Loan/ Insurance/ Investment</b>:<br> The account number for the bank account as it appears at the site.<br><b>Credit Card</b>: The account number of the card account as it appears at the site,<br>i.e., the card number.The account number can be full or partial based on how it is displayed in the account summary page of the site.In most cases, the site does not display the full account number in the account summary page and additional navigation is required to aggregate it.<br><b>Applicable containers</b>: All Containers<br><b>Aggregated / Manual</b>: Both <br><b>Endpoints</b>:<br><ul><li>GET accounts</li><li>GET accounts/{accountId}</li><li>POST accounts</li></ul>
     */
    accountNumber?: string
    /**
     * Bank and branch identification information.<br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: bank, investment, loan<br><b>Endpoints</b>:<br><ul></ul>
     */
    bankTransferCode?: /* BankTransferCode */ BankTransferCode[]
    /**
     * <b>Applicable containers</b>: reward, bank, creditCard, investment, loan, insurance, realEstate, otherLiabilities<br>
     */
    providerName?: string
  }
  /**
   * VerifiedAccountResponse
   */
  export interface VerifiedAccountResponse {
    /**
     * The unique identifier for the verification request that returns contextual data
     */
    requestId?: string
    /**
     * The date of the verification request
     */
    requestDate?: string
    /**
     * The overall status of the verification request
     */
    state?: 'COMPLETED' | 'FAILED'
    verifiedAccount?: /* VerifiedAccounts */ VerifiedAccounts[]
    /**
     * The reason for the failure of the verification request
     */
    failedReason?:
      | 'ACCOUNT_LOCKED'
      | 'ADDL_AUTHENTICATION_REQUIRED'
      | 'CREDENTIALS_UPDATE_NEEDED'
      | 'INCORRECT_CREDENTIALS'
      | 'INVALID_ADDL_INFO_PROVIDED'
      | 'REQUEST_TIME_OUT'
      | 'SITE_BLOCKING_ERROR'
      | 'UNEXPECTED_SITE_ERROR'
      | 'SITE_NOT_SUPPORTED'
      | 'SITE_UNAVAILABLE'
      | 'TECH_ERROR'
      | 'USER_ACTION_NEEDED_AT_SITE'
      | 'SITE_SESSION_INVALIDATED'
      | 'NEW_AUTHENTICATION_REQUIRED'
      | 'CONSENT_REQUIRED'
      | 'CONSENT_EXPIRED'
      | 'CONSENT_REVOKED'
      | 'INCORRECT_OAUTH_TOKEN'
      | 'REQUIRED_DATA_NOT_AVAILABLE'
      | 'MATCHING_FAILED'
      | 'NO_ELIGIBLE_ACCOUNTS'
      | 'USER_INPUT_REQUIRED'
  }
  /**
   * VerifiedAccounts
   */
  export interface VerifiedAccounts {
    /**
     * The account name as it appears at the site.<br>(The POST accounts service response return this field as name)<br><b>Applicable containers</b>: bank, investment<br><b>Aggregated / Manual</b>: Aggregated<br><b>Endpoints</b>:<br><ul><li>GET /verification/verifiedAccounts</li></ul>
     */
    accountName?: string
    /**
     * The status of the account verification.
     */
    verificationStatus?: 'SUCCESS' | 'FAILED'
    /**
     * The type of account that is aggregated, i.e., savings, checking, charge, HELOC, etc. The account type is derived based on the attributes of the account. <br><b>Valid Values:</b><br><b>Aggregated Account Type</b><br><b>bank</b><ul><li>CHECKING</li><li>SAVINGS</li><li>MONEY_MARKET</li></ul><b>investment (SN 1.0)</b><ul><li>BROKERAGE_MARGIN</li><li>BROKERAGE_CASH</li><li>BROKERAGE_LINK_ACCOUNT</li><li>INDIVIDUAL</li><li>CMA</li></ul><b>investment (SN 2.0)</b><ul><li>BROKERAGE_MARGIN</li><li>BROKERAGE_CASH</li><li>BROKERAGE_LINK_ACCOUNT</li><li>INDIVIDUAL</li><li>CMA</li></ul><ul><li>GET /verification/verifiedAccounts</li></ul>
     */
    accountType?: string
    /**
     * The balance in the account that is available at the beginning of the business day; it is equal to the ledger balance of the account.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: bank<br><b>Endpoints</b>:<ul><li>GET /verification/verifiedAccounts</li></ul>
     */
    currentBalance?: /* Money */ Money
    /**
     * The name or identification of the account owner, as it appears at the FI site. <br><b>Note:</b> The account holder name can be full or partial based on how it is displayed in the account summary page of the FI site. In most cases, the FI site does not display the full account holder name in the account summary page.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: bank, investment<br><b>Endpoints</b>:<ul><li>GET /verification/verifiedAccounts</li></ul>
     */
    displayedName?: string
    /**
     * Holder details of the account.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: bank<br><b>Endpoints</b>:<ul><li>GET /verification/verifiedAccounts</li></ul>
     */
    holder?: /* AccountHolder */ AccountHolder[]
    /**
     * The account number as it appears on the site. (The POST accounts service response return this field as number)<br><b>Additional Details</b>:<b> Bank / Investment</b>:<br> The account number for the bank account as it appears at the site.<br>In most cases, the site does not display the full account number in the account summary page and additional navigation is required to aggregate it.<br><b>Applicable containers</b>: bank, investment<br><b>Aggregated / Manual</b>: Aggregated<br><b>Endpoints</b>:<br><ul><li>GET /verification/verifiedAccounts</li></ul>
     */
    accountNumber?: string
    /**
     * The classification of the account such as personal, corporate, etc.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: bank, investment<br><b>Endpoints</b>:<li>GET /verification/verifiedAccounts</li></ul><b>Applicable Values</b><br>
     */
    classification?:
      | 'OTHER'
      | 'PERSONAL'
      | 'CORPORATE'
      | 'SMALL_BUSINESS'
      | 'TRUST'
      | 'ADD_ON_CARD'
      | 'VIRTUAL_CARD'
    /**
     * The balance in the account that is available for spending. For checking accounts with overdraft, available balance may include overdraft amount, if end site adds overdraft balance to available balance.<br><b>Applicable containers</b>: bank, investment<br><b>Aggregated / Manual</b>: Aggregated<br><b>Endpoints</b>:<br><ul><li>GET /verification/verifiedAccounts</li></ul>
     */
    availableBalance?: /* Money */ Money
    /**
     * Full account number List of the account that contains paymentAccountNumber and unmaskedAccountNumber. <br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: bank, investment <br><b>Endpoints</b>:<ul><li>GET /verification/verifiedAccounts</li></ul>
     */
    fullAccountNumberList?: /* FullAccountNumberList */ FullAccountNumberList
    /**
     * The primary key of the provider account resource.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: bank, investment<br><b>Endpoints</b>:<ul><li>GET /verification/verifiedAccounts</li></ul>
     */
    accountId?: number // int64
    /**
     * The total account value. <br><b>Additional Details:</b><br><b>Bank:</b> available balance or current balance.<br><b>Investment:</b> The total balance of all the investment account, as it appears on the FI site.<b>Applicable containers</b>: bank, investment <br><b>Aggregated / Manual</b>: Aggregated<br><b>Endpoints</b>:<br><ul><li>GET /verification/verifiedAccounts</li></ul>
     */
    balance?: /* Money */ Money
    /**
     * Identifier of the provider site. The primary key of provider resource. <br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: bank, investment<br><b>Endpoints</b>:<ul><li>GET /verification/verifiedAccounts</li></ul>
     */
    providerId?: string
    /**
     * The primary key of the provider account resource.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: bank, investment<br><b>Endpoints</b>:<ul><li>GET /verification/verifiedAccounts</li></ul>
     */
    providerAccountId?: number // int64
    /**
     * The type of service. E.g., Bank, Investment <br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: bank, investment<br><b>Endpoints</b>:<ul><li>GET /verification/verifiedAccounts</ul><b>Applicable Values</b><br>
     */
    CONTAINER?: 'bank' | 'investment'
    /**
     * Indicates if an account is selected by the user in the FastLink 4 application
     */
    isSelected?: boolean
    /**
     * The amount that is available for immediate withdrawal or the total amount available to purchase securities in a brokerage or investment account.<br><b>Note:</b> The cash balance field is only applicable to brokerage related accounts.<br><br><b>Aggregated </b><br><b>Applicable containers</b>: investment<br><b>Endpoints</b>:<ul><li>GET /verification/verifiedAccounts</li></ul>
     */
    cash?: /* Money */ Money
    /**
     * Bank and branch identification information.<br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: bank, investment<br><b>Endpoints</b>:<br><ul><li>GET /verification/verifiedAccounts</li></ul>
     */
    bankTransferCode?: /* BankTransferCode */ BankTransferCode[]
    /**
     * Service provider or institution name where the account originates. This belongs to the provider resource.<br><br><b>Aggregated / Manual</b>: Aggregated<br><b>Applicable containers</b>: bank, investment<br><b>Endpoints</b>:<ul><li>GET /verification/verifiedAccounts</li></ul>
     */
    providerName?: string
    /**
     * The reason for the verification failure of the account.
     */
    failedReason?: 'REQUIRED_DATA_NOT_AVAILABLE' | 'MATCHING_FAILED'
  }
  /**
   * VerifyAccount
   */
  export interface VerifyAccount {
    transactionCriteria?: /* VerifyTransactionCriteria */ VerifyTransactionCriteria[]
    account?: /* VerifiedAccount */ VerifiedAccount[]
  }
  /**
   * VerifyAccountRequest
   */
  export interface VerifyAccountRequest {
    container?:
      | 'bank'
      | 'creditCard'
      | 'investment'
      | 'insurance'
      | 'loan'
      | 'reward'
      | 'bill'
      | 'realEstate'
      | 'otherAssets'
      | 'otherLiabilities'
    accountId?: number // int64
    transactionCriteria: /* VerifyTransactionCriteria */ VerifyTransactionCriteria[]
  }
  /**
   * VerifyAccountResponse
   */
  export interface VerifyAccountResponse {
    verifyAccount?: /* VerifyAccount */ VerifyAccount
  }
  /**
   * VerifyTransactionCriteria
   */
  export interface VerifyTransactionCriteria {
    date: string
    amount: number // double
    verifiedTransaction?: /* Transaction */ Transaction[]
    /**
     * Indicates if the criteria is matched or not. <br><b>Applicable Values</b><br>
     */
    matched?: 'COMPLETE' | 'NONE'
    keyword?: string
    dateVariance?: string
    /**
     * Indicates if the transaction appears as a debit or a credit transaction in the account. <br><br><b>Applicable containers</b>: bank,creditCard,investment,insurance,loan<br><b>Applicable Values</b><br>
     */
    baseType?: 'CREDIT' | 'DEBIT'
  }
  /**
   * YodleeError
   */
  export interface YodleeError {
    errorMessage?: string
    errorCode?: string
    referenceCode?: string
  }
}
declare namespace Paths {
  namespace CobrandLogin {
    export interface BodyParameters {
      cobrandLoginRequest: Parameters.CobrandLoginRequest
    }
    namespace Parameters {
      export type CobrandLoginRequest =
        /* CobrandLoginRequest */ Definitions.CobrandLoginRequest
    }
    namespace Responses {
      export type $200 =
        /* CobrandLoginResponse */ Definitions.CobrandLoginResponse
      export type $400 = /* YodleeError */ Definitions.YodleeError
      export type $401 = /* YodleeError */ Definitions.YodleeError
    }
  }
  namespace CreateConsent {
    export interface BodyParameters {
      consentRequest: Parameters.ConsentRequest
    }
    namespace Parameters {
      export type ConsentRequest =
        /* CreateConsentRequest */ Definitions.CreateConsentRequest
    }
    namespace Responses {
      export type $200 =
        /* CreatedConsentResponse */ Definitions.CreatedConsentResponse
      export type $400 = /* YodleeError */ Definitions.YodleeError
    }
  }
  namespace CreateManualAccount {
    export interface BodyParameters {
      accountParam: Parameters.AccountParam
    }
    namespace Parameters {
      export type AccountParam =
        /* CreateAccountRequest */ Definitions.CreateAccountRequest
    }
    namespace Responses {
      export type $200 =
        /* CreatedAccountResponse */ Definitions.CreatedAccountResponse
      export type $400 = /* YodleeError */ Definitions.YodleeError
    }
  }
  namespace CreateOrRunTransactionCategorizationRules {
    namespace Parameters {
      /**
       * To run rules, pass action=run. Only value run is supported
       */
      export type Action = string
      /**
       * rules(JSON format) to categorize the transactions
       */
      export type RuleParam = string
    }
    export interface QueryParameters {
      action?: /* To run rules, pass action=run. Only value run is supported */ Parameters.Action
      ruleParam?: /* rules(JSON format) to categorize the transactions */ Parameters.RuleParam
    }
    namespace Responses {
      export type $400 = /* YodleeError */ Definitions.YodleeError
    }
  }
  namespace CreateSubscriptionEvent {
    export interface BodyParameters {
      eventRequest: Parameters.EventRequest
    }
    namespace Parameters {
      /**
       * eventName
       */
      export type EventName =
        | 'REFRESH'
        | 'DATA_UPDATES'
        | 'AUTO_REFRESH_UPDATES'
      export type EventRequest =
        /* CreateCobrandNotificationEventRequest */ Definitions.CreateCobrandNotificationEventRequest
    }
    export interface PathParameters {
      eventName: /* eventName */ Parameters.EventName
    }
    namespace Responses {
      export type $400 = /* YodleeError */ Definitions.YodleeError
    }
  }
  namespace CreateSubscriptionNotificationEvent {
    export interface BodyParameters {
      eventRequest: Parameters.EventRequest
    }
    namespace Parameters {
      /**
       * eventName
       */
      export type EventName =
        | 'REFRESH'
        | 'DATA_UPDATES'
        | 'AUTO_REFRESH_UPDATES'
        | 'LATEST_BALANCE_UPDATES'
      export type EventRequest =
        /* CreateConfigsNotificationEventRequest */ Definitions.CreateConfigsNotificationEventRequest
    }
    export interface PathParameters {
      eventName: /* eventName */ Parameters.EventName
    }
    namespace Responses {
      export type $400 = /* YodleeError */ Definitions.YodleeError
    }
  }
  namespace CreateTransactionCategory {
    export interface BodyParameters {
      transactionCategoryRequest: Parameters.TransactionCategoryRequest
    }
    namespace Parameters {
      export type TransactionCategoryRequest =
        /* TransactionCategoryRequest */ Definitions.TransactionCategoryRequest
    }
    namespace Responses {
      export type $400 = /* YodleeError */ Definitions.YodleeError
    }
  }
  namespace DeleteAccount {
    namespace Parameters {
      /**
       * accountId
       */
      export type AccountId = number // int64
    }
    export interface PathParameters {
      accountId: /* accountId */ Parameters.AccountId /* int64 */
    }
    namespace Responses {
      export type $400 = /* YodleeError */ Definitions.YodleeError
    }
  }
  namespace DeleteApiKey {
    namespace Parameters {
      /**
       * key
       */
      export type Key = string
    }
    export interface PathParameters {
      key: /* key */ Parameters.Key
    }
    namespace Responses {
      export type $400 = /* YodleeError */ Definitions.YodleeError
    }
  }
  namespace DeleteDocument {
    namespace Parameters {
      /**
       * documentId
       */
      export type DocumentId = string
    }
    export interface PathParameters {
      documentId: /* documentId */ Parameters.DocumentId
    }
    namespace Responses {
      export type $400 = /* YodleeError */ Definitions.YodleeError
    }
  }
  namespace DeleteProviderAccount {
    namespace Parameters {
      /**
       * providerAccountId
       */
      export type ProviderAccountId = number // int64
    }
    export interface PathParameters {
      providerAccountId: /* providerAccountId */ Parameters.ProviderAccountId /* int64 */
    }
    namespace Responses {
      export type $400 = /* YodleeError */ Definitions.YodleeError
    }
  }
  namespace DeleteSubscribedEvent {
    namespace Parameters {
      /**
       * eventName
       */
      export type EventName =
        | 'REFRESH'
        | 'DATA_UPDATES'
        | 'AUTO_REFRESH_UPDATES'
    }
    export interface PathParameters {
      eventName: /* eventName */ Parameters.EventName
    }
    namespace Responses {
      export type $400 = /* YodleeError */ Definitions.YodleeError
    }
  }
  namespace DeleteSubscribedNotificationEvent {
    namespace Parameters {
      /**
       * eventName
       */
      export type EventName =
        | 'REFRESH'
        | 'DATA_UPDATES'
        | 'AUTO_REFRESH_UPDATES'
        | 'LATEST_BALANCE_UPDATES'
    }
    export interface PathParameters {
      eventName: /* eventName */ Parameters.EventName
    }
    namespace Responses {
      export type $400 = /* YodleeError */ Definitions.YodleeError
    }
  }
  namespace DeleteToken {
    namespace Responses {
      export type $401 = /* YodleeError */ Definitions.YodleeError
    }
  }
  namespace DeleteTransactionCategorizationRule {
    namespace Parameters {
      /**
       * ruleId
       */
      export type RuleId = number // int64
    }
    export interface PathParameters {
      ruleId: /* ruleId */ Parameters.RuleId /* int64 */
    }
    namespace Responses {
      export type $400 = /* YodleeError */ Definitions.YodleeError
    }
  }
  namespace DeleteTransactionCategory {
    namespace Parameters {
      /**
       * categoryId
       */
      export type CategoryId = number // int64
    }
    export interface PathParameters {
      categoryId: /* categoryId */ Parameters.CategoryId /* int64 */
    }
    namespace Responses {
      export type $400 = /* YodleeError */ Definitions.YodleeError
    }
  }
  namespace DownloadDocument {
    namespace Parameters {
      /**
       * documentId
       */
      export type DocumentId = string
    }
    export interface PathParameters {
      documentId: /* documentId */ Parameters.DocumentId
    }
    namespace Responses {
      export type $200 =
        /* DocumentDownloadResponse */ Definitions.DocumentDownloadResponse
      export type $400 = /* YodleeError */ Definitions.YodleeError
    }
  }
  namespace EditCredentialsOrRefreshProviderAccount {
    export interface BodyParameters {
      providerAccountRequest?: Parameters.ProviderAccountRequest
    }
    namespace Parameters {
      /**
       * comma separated providerAccountIds
       */
      export type ProviderAccountIds = string
      export type ProviderAccountRequest =
        /* ProviderAccountRequest */ Definitions.ProviderAccountRequest
    }
    export interface QueryParameters {
      providerAccountIds: /* comma separated providerAccountIds */ Parameters.ProviderAccountIds
    }
    namespace Responses {
      export type $200 =
        /* UpdatedProviderAccountResponse */ Definitions.UpdatedProviderAccountResponse
      export type $400 = /* YodleeError */ Definitions.YodleeError
    }
  }
  namespace EvaluateAddress {
    export interface BodyParameters {
      addressParam: Parameters.AddressParam
    }
    namespace Parameters {
      export type AddressParam =
        /* EvaluateAddressRequest */ Definitions.EvaluateAddressRequest
    }
    namespace Responses {
      export type $200 =
        /* EvaluateAddressResponse */ Definitions.EvaluateAddressResponse
      export type $400 = /* YodleeError */ Definitions.YodleeError
    }
  }
  namespace GenerateAccessToken {
    export interface FormDataParameters {
      clientId?: /* clientId issued by Yodlee is used to generate the OAuth token for authentication. */ Parameters.ClientId
      secret?: /* secret issued by Yodlee is used to generate the OAuth token for authentication. */ Parameters.Secret
    }
    namespace Parameters {
      /**
       * clientId issued by Yodlee is used to generate the OAuth token for authentication.
       */
      export type ClientId = string
      /**
       * secret issued by Yodlee is used to generate the OAuth token for authentication.
       */
      export type Secret = string
    }
    namespace Responses {
      export type $201 =
        /* ClientCredentialTokenResponse */ Definitions.ClientCredentialTokenResponse
      export type $400 = /* YodleeError */ Definitions.YodleeError
      export type $401 = /* YodleeError */ Definitions.YodleeError
    }
  }
  namespace GenerateApiKey {
    export interface BodyParameters {
      apiKeyRequest: Parameters.ApiKeyRequest
    }
    namespace Parameters {
      export type ApiKeyRequest = /* ApiKeyRequest */ Definitions.ApiKeyRequest
    }
    namespace Responses {
      export type $201 = /* ApiKeyResponse */ Definitions.ApiKeyResponse
      export type $400 = /* YodleeError */ Definitions.YodleeError
    }
  }
  namespace GetAccessTokens {
    namespace Parameters {
      /**
       * appIds
       */
      export type AppIds = string
    }
    export interface QueryParameters {
      appIds: /* appIds */ Parameters.AppIds
    }
    namespace Responses {
      export type $200 =
        /* UserAccessTokensResponse */ Definitions.UserAccessTokensResponse
    }
  }
  namespace GetAccount {
    namespace Parameters {
      /**
       * accountId
       */
      export type AccountId = number // int64
      /**
       * profile, holder, fullAccountNumber, fullAccountNumberList, paymentProfile, autoRefresh<br><b>Note:</b>fullAccountNumber is deprecated and is replaced with fullAccountNumberList in include parameter and response.
       */
      export type Include = string
    }
    export interface PathParameters {
      accountId: /* accountId */ Parameters.AccountId /* int64 */
    }
    export interface QueryParameters {
      include?: /* profile, holder, fullAccountNumber, fullAccountNumberList, paymentProfile, autoRefresh<br><b>Note:</b>fullAccountNumber is deprecated and is replaced with fullAccountNumberList in include parameter and response. */ Parameters.Include
    }
    namespace Responses {
      export type $200 = /* AccountResponse */ Definitions.AccountResponse
    }
  }
  namespace GetAllAccounts {
    namespace Parameters {
      /**
       * Comma separated accountIds.
       */
      export type AccountId = string
      /**
       * bank/creditCard/investment/insurance/loan/reward/realEstate/otherAssets/otherLiabilities
       */
      export type Container = string
      /**
       * profile, holder, fullAccountNumber, fullAccountNumberList, paymentProfile, autoRefresh<br><b>Note:</b><br><li>fullAccountNumber is deprecated and is replaced with fullAccountNumberList in include parameter and response.</li><br><li>profile is deprecated, and to retrieve the profile information, call the GET /verification/holderProfile API instead.</li>
       */
      export type Include = string
      /**
       * Comma separated providerAccountIds.
       */
      export type ProviderAccountId = string
      /**
       * The unique identifier that returns contextual data
       */
      export type RequestId = string
      /**
       * ACTIVE,INACTIVE,TO_BE_CLOSED,CLOSED
       */
      export type Status = string
    }
    export interface QueryParameters {
      accountId?: /* Comma separated accountIds. */ Parameters.AccountId
      container?: /* bank/creditCard/investment/insurance/loan/reward/realEstate/otherAssets/otherLiabilities */ Parameters.Container
      include?: /* profile, holder, fullAccountNumber, fullAccountNumberList, paymentProfile, autoRefresh<br><b>Note:</b><br><li>fullAccountNumber is deprecated and is replaced with fullAccountNumberList in include parameter and response.</li><br><li>profile is deprecated, and to retrieve the profile information, call the GET /verification/holderProfile API instead.</li> */ Parameters.Include
      providerAccountId?: /* Comma separated providerAccountIds. */ Parameters.ProviderAccountId
      requestId?: /* The unique identifier that returns contextual data */ Parameters.RequestId
      status?: /* ACTIVE,INACTIVE,TO_BE_CLOSED,CLOSED */ Parameters.Status
    }
    namespace Responses {
      export type $200 = /* AccountResponse */ Definitions.AccountResponse
      export type $400 = /* YodleeError */ Definitions.YodleeError
    }
  }
  namespace GetAllProviderAccounts {
    namespace Parameters {
      /**
       * include
       */
      export type Include = string
      /**
       * Comma separated providerIds.
       */
      export type ProviderIds = string
    }
    export interface QueryParameters {
      include?: /* include */ Parameters.Include
      providerIds?: /* Comma separated providerIds. */ Parameters.ProviderIds
    }
    namespace Responses {
      export type $200 =
        /* ProviderAccountResponse */ Definitions.ProviderAccountResponse
    }
  }
  namespace GetAllProviders {
    namespace Parameters {
      /**
       * CHALLENGE_DEPOSIT_VERIFICATION - capability search is deprecated
       */
      export type Capability = string
      /**
       * Expression to filter the providers by dataset(s) or dataset attribute(s). The default value will be the dataset or dataset attributes configured as default for the customer.
       */
      export type Dataset$Filter = string
      /**
       * Specify to filter the providers with values paymentAccountNumber,unmaskedAccountNumber.
       */
      export type FullAccountNumberFields = string
      /**
       * Institution Id for Single site selection
       */
      export type InstitutionId = number // int64
      /**
       * Name in minimum 1 character or routing number.
       */
      export type Name = string
      /**
       * Search priority
       */
      export type Priority = string
      /**
       * Max 5 Comma seperated Provider Ids
       */
      export type ProviderId = string
      /**
       * skip (Min 0) - This is not applicable along with 'name' parameter.
       */
      export type Skip = number // int32
      /**
       * top (Max 500) - This is not applicable along with 'name' parameter.
       */
      export type Top = number // int32
    }
    export interface QueryParameters {
      capability?: /* CHALLENGE_DEPOSIT_VERIFICATION - capability search is deprecated */ Parameters.Capability
      dataset$filter?: /* Expression to filter the providers by dataset(s) or dataset attribute(s). The default value will be the dataset or dataset attributes configured as default for the customer. */ Parameters.Dataset$Filter
      fullAccountNumberFields?: /* Specify to filter the providers with values paymentAccountNumber,unmaskedAccountNumber. */ Parameters.FullAccountNumberFields
      institutionId?: /* Institution Id for Single site selection */ Parameters.InstitutionId /* int64 */
      name?: /* Name in minimum 1 character or routing number. */ Parameters.Name
      priority?: /* Search priority */ Parameters.Priority
      providerId?: /* Max 5 Comma seperated Provider Ids */ Parameters.ProviderId
      skip?: /* skip (Min 0) - This is not applicable along with 'name' parameter. */ Parameters.Skip /* int32 */
      top?: /* top (Max 500) - This is not applicable along with 'name' parameter. */ Parameters.Top /* int32 */
    }
    namespace Responses {
      export type $200 = /* ProviderResponse */ Definitions.ProviderResponse
      export type $400 = /* YodleeError */ Definitions.YodleeError
    }
  }
  namespace GetApiKeys {
    namespace Responses {
      export type $200 = /* ApiKeyResponse */ Definitions.ApiKeyResponse
    }
  }
  namespace GetAssetClassificationList {
    namespace Responses {
      export type $200 =
        /* HoldingAssetClassificationListResponse */ Definitions.HoldingAssetClassificationListResponse
    }
  }
  namespace GetAssociatedAccounts {
    namespace Parameters {
      /**
       * providerAccountId
       */
      export type ProviderAccountId = number // int64
    }
    export interface PathParameters {
      providerAccountId: /* providerAccountId */ Parameters.ProviderAccountId /* int64 */
    }
    namespace Responses {
      export type $200 =
        /* AssociatedAccountsResponse */ Definitions.AssociatedAccountsResponse
      export type $400 = /* YodleeError */ Definitions.YodleeError
    }
  }
  namespace GetConsentDetails {
    namespace Parameters {
      /**
       * Consent Id generated through POST Consent.
       */
      export type ConsentId = number // int64
    }
    export interface PathParameters {
      consentId: /* Consent Id generated through POST Consent. */ Parameters.ConsentId /* int64 */
    }
    namespace Responses {
      export type $200 =
        /* UpdatedConsentResponse */ Definitions.UpdatedConsentResponse
      export type $400 = /* YodleeError */ Definitions.YodleeError
    }
  }
  namespace GetConsents {
    namespace Parameters {
      /**
       * Consent Id generated through POST Consent.
       */
      export type ConsentIds = string
      /**
       * The flag responsible to include renew details like sharing duration and reauthorization required
       */
      export type Include = string
      /**
       * Unique identifier for the provider account resource. This is created during account addition.
       */
      export type ProviderAccountIds = string
    }
    export interface QueryParameters {
      consentIds?: /* Consent Id generated through POST Consent. */ Parameters.ConsentIds
      include?: /* The flag responsible to include renew details like sharing duration and reauthorization required */ Parameters.Include
      providerAccountIds?: /* Unique identifier for the provider account resource. This is created during account addition. */ Parameters.ProviderAccountIds
    }
    namespace Responses {
      export type $200 = /* ConsentResponse */ Definitions.ConsentResponse
    }
  }
  namespace GetDataExtractsEvents {
    namespace Parameters {
      /**
       * Event Name
       */
      export type EventName = string
      /**
       * From DateTime (YYYY-MM-DDThh:mm:ssZ)
       */
      export type FromDate = string
      /**
       * To DateTime (YYYY-MM-DDThh:mm:ssZ)
       */
      export type ToDate = string
    }
    export interface QueryParameters {
      eventName: /* Event Name */ Parameters.EventName
      fromDate: /* From DateTime (YYYY-MM-DDThh:mm:ssZ) */ Parameters.FromDate
      toDate: /* To DateTime (YYYY-MM-DDThh:mm:ssZ) */ Parameters.ToDate
    }
    namespace Responses {
      export type $200 =
        /* DataExtractsEventResponse */ Definitions.DataExtractsEventResponse
      export type $400 = /* YodleeError */ Definitions.YodleeError
    }
  }
  namespace GetDataExtractsUserData {
    namespace Parameters {
      /**
       * From DateTime (YYYY-MM-DDThh:mm:ssZ)
       */
      export type FromDate = string
      /**
       * Login Name
       */
      export type LoginName = string
      /**
       * To DateTime (YYYY-MM-DDThh:mm:ssZ)
       */
      export type ToDate = string
    }
    export interface QueryParameters {
      fromDate: /* From DateTime (YYYY-MM-DDThh:mm:ssZ) */ Parameters.FromDate
      loginName: /* Login Name */ Parameters.LoginName
      toDate: /* To DateTime (YYYY-MM-DDThh:mm:ssZ) */ Parameters.ToDate
    }
    namespace Responses {
      export type $200 =
        /* DataExtractsUserDataResponse */ Definitions.DataExtractsUserDataResponse
      export type $400 = /* YodleeError */ Definitions.YodleeError
    }
  }
  namespace GetDocuments {
    namespace Parameters {
      /**
       * The unique identifier of an account. Retrieve documents for a given accountId.
       */
      export type AccountId = string
      /**
       * Accepts only one of the following valid document types: STMT, TAX, and EBILL.
       */
      export type DocType = string
      /**
       * The date from which documents have to be retrieved.
       */
      export type FromDate = string
      /**
       * The string used to search a document by its name.
       */
      export type Keyword = string
      /**
       * The date to which documents have to be retrieved.
       */
      export type ToDate = string
    }
    export interface QueryParameters {
      Keyword?: /* The string used to search a document by its name. */ Parameters.Keyword
      accountId?: /* The unique identifier of an account. Retrieve documents for a given accountId. */ Parameters.AccountId
      docType?: /* Accepts only one of the following valid document types: STMT, TAX, and EBILL. */ Parameters.DocType
      fromDate?: /* The date from which documents have to be retrieved. */ Parameters.FromDate
      toDate?: /* The date to which documents have to be retrieved. */ Parameters.ToDate
    }
    namespace Responses {
      export type $200 = /* DocumentResponse */ Definitions.DocumentResponse
      export type $400 = /* YodleeError */ Definitions.YodleeError
    }
  }
  namespace GetHistoricalBalances {
    namespace Parameters {
      /**
       * accountId
       */
      export type AccountId = string
      /**
       * from date for balance retrieval (YYYY-MM-DD)
       */
      export type FromDate = string
      /**
       * Consider carry forward logic for missing balances
       */
      export type IncludeCF = boolean
      /**
       * D-daily, W-weekly or M-monthly
       */
      export type Interval = string
      /**
       * skip (Min 0)
       */
      export type Skip = number // int32
      /**
       * toDate for balance retrieval (YYYY-MM-DD)
       */
      export type ToDate = string
      /**
       * top (Max 500)
       */
      export type Top = number // int32
    }
    export interface QueryParameters {
      accountId?: /* accountId */ Parameters.AccountId
      fromDate?: /* from date for balance retrieval (YYYY-MM-DD) */ Parameters.FromDate
      includeCF?: /* Consider carry forward logic for missing balances */ Parameters.IncludeCF
      interval?: /* D-daily, W-weekly or M-monthly */ Parameters.Interval
      skip?: /* skip (Min 0) */ Parameters.Skip /* int32 */
      toDate?: /* toDate for balance retrieval (YYYY-MM-DD) */ Parameters.ToDate
      top?: /* top (Max 500) */ Parameters.Top /* int32 */
    }
    namespace Responses {
      export type $200 =
        /* AccountHistoricalBalancesResponse */ Definitions.AccountHistoricalBalancesResponse
      export type $400 = /* YodleeError */ Definitions.YodleeError
    }
  }
  namespace GetHolderProfile {
    namespace Parameters {
      /**
       * accountId
       */
      export type AccountId = string
      /**
       * providerAccountId.
       */
      export type ProviderAccountId = string
    }
    export interface QueryParameters {
      accountId?: /* accountId */ Parameters.AccountId
      providerAccountId: /* providerAccountId. */ Parameters.ProviderAccountId
    }
    namespace Responses {
      export type $200 =
        /* HolderProfileResponse */ Definitions.HolderProfileResponse
      export type $400 = /* YodleeError */ Definitions.YodleeError
    }
  }
  namespace GetHoldingSummary {
    namespace Parameters {
      /**
       * Comma separated accountIds
       */
      export type AccountIds = string
      /**
       * e.g. Country, Sector, etc.
       */
      export type ClassificationType = string
      /**
       * details
       */
      export type Include = string
    }
    export interface QueryParameters {
      accountIds?: /* Comma separated accountIds */ Parameters.AccountIds
      classificationType?: /* e.g. Country, Sector, etc. */ Parameters.ClassificationType
      include?: /* details */ Parameters.Include
    }
    namespace Responses {
      export type $200 =
        /* DerivedHoldingSummaryResponse */ Definitions.DerivedHoldingSummaryResponse
      export type $400 = /* YodleeError */ Definitions.YodleeError
    }
  }
  namespace GetHoldingTypeList {
    namespace Responses {
      export type $200 =
        /* HoldingTypeListResponse */ Definitions.HoldingTypeListResponse
    }
  }
  namespace GetHoldings {
    namespace Parameters {
      /**
       * Comma separated accountId
       */
      export type AccountId = string
      /**
       * e.g. Country, Sector, etc.
       */
      export type AssetClassificationClassificationType = string
      /**
       * e.g. US
       */
      export type ClassificationValue = string
      /**
       * assetClassification
       */
      export type Include = string
      /**
       * providerAccountId
       */
      export type ProviderAccountId = string
    }
    export interface QueryParameters {
      accountId?: /* Comma separated accountId */ Parameters.AccountId
      'assetClassification.classificationType'?: /* e.g. Country, Sector, etc. */ Parameters.AssetClassificationClassificationType
      classificationValue?: /* e.g. US */ Parameters.ClassificationValue
      include?: /* assetClassification */ Parameters.Include
      providerAccountId?: /* providerAccountId */ Parameters.ProviderAccountId
    }
    namespace Responses {
      export type $200 = /* HoldingResponse */ Definitions.HoldingResponse
      export type $400 = /* YodleeError */ Definitions.YodleeError
    }
  }
  namespace GetInstitutions {
    namespace Parameters {
      /**
       * Expression to filter the providers by dataset(s) or dataset attribute(s). The default value will be the dataset or dataset attributes configured as default for the customer.
       */
      export type Dataset$Filter = string
      /**
       * Name in minimum 1 character or routing number.
       */
      export type Name = string
      /**
       * Search priority
       */
      export type Priority = string
      /**
       * providerId
       */
      export type ProviderId = number // int64
      /**
       * skip (Min 0) - This is not applicable along with 'name' parameter.
       */
      export type Skip = number // int32
      /**
       * top (Max 500) - This is not applicable along with 'name' parameter.
       */
      export type Top = number // int32
    }
    export interface QueryParameters {
      dataset$filter?: /* Expression to filter the providers by dataset(s) or dataset attribute(s). The default value will be the dataset or dataset attributes configured as default for the customer. */ Parameters.Dataset$Filter
      name?: /* Name in minimum 1 character or routing number. */ Parameters.Name
      priority?: /* Search priority */ Parameters.Priority
      providerId?: /* providerId */ Parameters.ProviderId /* int64 */
      skip?: /* skip (Min 0) - This is not applicable along with 'name' parameter. */ Parameters.Skip /* int32 */
      top?: /* top (Max 500) - This is not applicable along with 'name' parameter. */ Parameters.Top /* int32 */
    }
    namespace Responses {
      export type $200 =
        /* InstitutionResponse */ Definitions.InstitutionResponse
      export type $400 = /* YodleeError */ Definitions.YodleeError
    }
  }
  namespace GetLatestBalances {
    namespace Parameters {
      /**
       * Comma separated accountIds.
       */
      export type AccountId = string
      /**
       * providerAccountId.
       */
      export type ProviderAccountId = string
    }
    export interface QueryParameters {
      accountId: /* Comma separated accountIds. */ Parameters.AccountId
      providerAccountId: /* providerAccountId. */ Parameters.ProviderAccountId
    }
    namespace Responses {
      export type $200 =
        /* AccountBalanceResponse */ Definitions.AccountBalanceResponse
      export type $400 = /* YodleeError */ Definitions.YodleeError
    }
  }
  namespace GetNetworth {
    namespace Parameters {
      /**
       * comma separated accountIds
       */
      export type AccountIds = string
      /**
       * bank/creditCard/investment/insurance/loan/realEstate/otherAssets/otherLiabilities
       */
      export type Container = string
      /**
       * from date for balance retrieval (YYYY-MM-DD)
       */
      export type FromDate = string
      /**
       * details
       */
      export type Include = string
      /**
       * D-daily, W-weekly or M-monthly
       */
      export type Interval = string
      /**
       * skip (Min 0)
       */
      export type Skip = number // int32
      /**
       * toDate for balance retrieval (YYYY-MM-DD)
       */
      export type ToDate = string
      /**
       * top (Max 500)
       */
      export type Top = number // int32
    }
    export interface QueryParameters {
      accountIds?: /* comma separated accountIds */ Parameters.AccountIds
      container?: /* bank/creditCard/investment/insurance/loan/realEstate/otherAssets/otherLiabilities */ Parameters.Container
      fromDate?: /* from date for balance retrieval (YYYY-MM-DD) */ Parameters.FromDate
      include?: /* details */ Parameters.Include
      interval?: /* D-daily, W-weekly or M-monthly */ Parameters.Interval
      skip?: /* skip (Min 0) */ Parameters.Skip /* int32 */
      toDate?: /* toDate for balance retrieval (YYYY-MM-DD) */ Parameters.ToDate
      top?: /* top (Max 500) */ Parameters.Top /* int32 */
    }
    namespace Responses {
      export type $200 =
        /* DerivedNetworthResponse */ Definitions.DerivedNetworthResponse
      export type $400 = /* YodleeError */ Definitions.YodleeError
    }
  }
  namespace GetProvider {
    namespace Parameters {
      /**
       * providerId
       */
      export type ProviderId = number // int64
    }
    export interface PathParameters {
      providerId: /* providerId */ Parameters.ProviderId /* int64 */
    }
    namespace Responses {
      export type $200 =
        /* ProviderDetailResponse */ Definitions.ProviderDetailResponse
      export type $400 = /* YodleeError */ Definitions.YodleeError
    }
  }
  namespace GetProviderAccount {
    namespace Parameters {
      /**
       * include credentials,questions
       */
      export type Include = string
      /**
       * providerAccountId
       */
      export type ProviderAccountId = number // int64
      /**
       * The unique identifier for the request that returns contextual data
       */
      export type RequestId = string
    }
    export interface PathParameters {
      providerAccountId: /* providerAccountId */ Parameters.ProviderAccountId /* int64 */
    }
    export interface QueryParameters {
      include?: /* include credentials,questions */ Parameters.Include
      requestId?: /* The unique identifier for the request that returns contextual data */ Parameters.RequestId
    }
    namespace Responses {
      export type $200 =
        /* ProviderAccountDetailResponse */ Definitions.ProviderAccountDetailResponse
      export type $400 = /* YodleeError */ Definitions.YodleeError
    }
  }
  namespace GetProviderAccountProfiles {
    namespace Parameters {
      /**
       * Comma separated providerAccountIds.
       */
      export type ProviderAccountId = string
    }
    export interface QueryParameters {
      providerAccountId?: /* Comma separated providerAccountIds. */ Parameters.ProviderAccountId
    }
    namespace Responses {
      export type $200 =
        /* ProviderAccountUserProfileResponse */ Definitions.ProviderAccountUserProfileResponse
    }
  }
  namespace GetProvidersCount {
    namespace Parameters {
      /**
       * CHALLENGE_DEPOSIT_VERIFICATION - capability search is deprecated
       */
      export type Capability = string
      /**
       * Expression to filter the providers by dataset(s) or dataset attribute(s). The default value will be the dataset or dataset attributes configured as default for the customer.
       */
      export type Dataset$Filter = string
      /**
       * Specify to filter the providers with values paymentAccountNumber,unmaskedAccountNumber.
       */
      export type FullAccountNumberFields = string
      /**
       * Name in minimum 1 character or routing number.
       */
      export type Name = string
      /**
       * Search priority
       */
      export type Priority = string
    }
    export interface QueryParameters {
      capability?: /* CHALLENGE_DEPOSIT_VERIFICATION - capability search is deprecated */ Parameters.Capability
      dataset$filter?: /* Expression to filter the providers by dataset(s) or dataset attribute(s). The default value will be the dataset or dataset attributes configured as default for the customer. */ Parameters.Dataset$Filter
      fullAccountNumberFields?: /* Specify to filter the providers with values paymentAccountNumber,unmaskedAccountNumber. */ Parameters.FullAccountNumberFields
      name?: /* Name in minimum 1 character or routing number. */ Parameters.Name
      priority?: /* Search priority */ Parameters.Priority
    }
    namespace Responses {
      export type $200 =
        /* ProvidersCountResponse */ Definitions.ProvidersCountResponse
      export type $400 = /* YodleeError */ Definitions.YodleeError
    }
  }
  namespace GetPublicEncryptionKey {
    namespace Responses {
      export type $200 =
        /* ConfigsPublicKeyResponse */ Definitions.ConfigsPublicKeyResponse
    }
  }
  namespace GetPublicKey {
    namespace Responses {
      export type $200 =
        /* CobrandPublicKeyResponse */ Definitions.CobrandPublicKeyResponse
    }
  }
  namespace GetSecurities {
    namespace Parameters {
      /**
       * Comma separated holdingId
       */
      export type HoldingId = string
    }
    export interface QueryParameters {
      holdingId?: /* Comma separated holdingId */ Parameters.HoldingId
    }
    namespace Responses {
      export type $200 =
        /* HoldingSecuritiesResponse */ Definitions.HoldingSecuritiesResponse
      export type $400 = /* YodleeError */ Definitions.YodleeError
    }
  }
  namespace GetStatements {
    namespace Parameters {
      /**
       * accountId
       */
      export type AccountId = string
      /**
       * creditCard/loan/insurance
       */
      export type Container = string
      /**
       * from date for statement retrieval (YYYY-MM-DD)
       */
      export type FromDate = string
      /**
       * isLatest (true/false)
       */
      export type IsLatest = string
      /**
       * ACTIVE,TO_BE_CLOSED,CLOSED
       */
      export type Status = string
    }
    export interface QueryParameters {
      accountId?: /* accountId */ Parameters.AccountId
      container?: /* creditCard/loan/insurance */ Parameters.Container
      fromDate?: /* from date for statement retrieval (YYYY-MM-DD) */ Parameters.FromDate
      isLatest?: /* isLatest (true/false) */ Parameters.IsLatest
      status?: /* ACTIVE,TO_BE_CLOSED,CLOSED */ Parameters.Status
    }
    namespace Responses {
      export type $200 = /* StatementResponse */ Definitions.StatementResponse
      export type $400 = /* YodleeError */ Definitions.YodleeError
    }
  }
  namespace GetSubscribedEvents {
    namespace Parameters {
      /**
       * eventName
       */
      export type EventName =
        | 'REFRESH'
        | 'DATA_UPDATES'
        | 'AUTO_REFRESH_UPDATES'
    }
    export interface QueryParameters {
      eventName?: /* eventName */ Parameters.EventName
    }
    namespace Responses {
      export type $200 =
        /* CobrandNotificationResponse */ Definitions.CobrandNotificationResponse
    }
  }
  namespace GetSubscribedNotificationEvents {
    namespace Parameters {
      /**
       * eventName
       */
      export type EventName =
        | 'REFRESH'
        | 'DATA_UPDATES'
        | 'AUTO_REFRESH_UPDATES'
        | 'LATEST_BALANCE_UPDATES'
    }
    export interface QueryParameters {
      eventName?: /* eventName */ Parameters.EventName
    }
    namespace Responses {
      export type $200 =
        /* ConfigsNotificationResponse */ Definitions.ConfigsNotificationResponse
    }
  }
  namespace GetTransactionCategories {
    namespace Responses {
      export type $200 =
        /* TransactionCategoryResponse */ Definitions.TransactionCategoryResponse
    }
  }
  namespace GetTransactionCategorizationRules {
    namespace Responses {
      export type $200 =
        /* TransactionCategorizationRuleResponse */ Definitions.TransactionCategorizationRuleResponse
    }
  }
  namespace GetTransactionCategorizationRulesDeprecated {
    namespace Responses {
      export type $200 =
        /* TransactionCategorizationRule */ Definitions.TransactionCategorizationRule[]
    }
  }
  namespace GetTransactionSummary {
    namespace Parameters {
      /**
       * comma separated account Ids
       */
      export type AccountId = string
      /**
       * comma separated categoryIds
       */
      export type CategoryId = string
      /**
       * INCOME, EXPENSE, TRANSFER, UNCATEGORIZE or DEFERRED_COMPENSATION
       */
      export type CategoryType = string
      /**
       * YYYY-MM-DD format
       */
      export type FromDate = string
      /**
       * CATEGORY_TYPE, HIGH_LEVEL_CATEGORY or CATEGORY
       */
      export type GroupBy = string
      /**
       * details
       */
      export type Include = string
      /**
       * TRUE/FALSE
       */
      export type IncludeUserCategory = boolean
      /**
       * D-daily, W-weekly, M-mothly or Y-yearly
       */
      export type Interval = string
      /**
       * YYYY-MM-DD format
       */
      export type ToDate = string
    }
    export interface QueryParameters {
      accountId?: /* comma separated account Ids */ Parameters.AccountId
      categoryId?: /* comma separated categoryIds */ Parameters.CategoryId
      categoryType?: /* INCOME, EXPENSE, TRANSFER, UNCATEGORIZE or DEFERRED_COMPENSATION */ Parameters.CategoryType
      fromDate?: /* YYYY-MM-DD format */ Parameters.FromDate
      groupBy: /* CATEGORY_TYPE, HIGH_LEVEL_CATEGORY or CATEGORY */ Parameters.GroupBy
      include?: /* details */ Parameters.Include
      includeUserCategory?: /* TRUE/FALSE */ Parameters.IncludeUserCategory
      interval?: /* D-daily, W-weekly, M-mothly or Y-yearly */ Parameters.Interval
      toDate?: /* YYYY-MM-DD format */ Parameters.ToDate
    }
    namespace Responses {
      export type $200 =
        /* DerivedTransactionSummaryResponse */ Definitions.DerivedTransactionSummaryResponse
      export type $400 = /* YodleeError */ Definitions.YodleeError
    }
  }
  namespace GetTransactions {
    namespace Parameters {
      /**
       * Comma separated accountIds
       */
      export type AccountId = string
      /**
       * DEBIT/CREDIT
       */
      export type BaseType = string
      /**
       * Comma separated categoryIds
       */
      export type CategoryId = string
      /**
       * Transaction Category Type(UNCATEGORIZE, INCOME, TRANSFER, EXPENSE or DEFERRED_COMPENSATION)
       */
      export type CategoryType = string
      /**
       * bank/creditCard/investment/insurance/loan
       */
      export type Container = string
      /**
       * Comma separated detailCategoryIds
       */
      export type DetailCategoryId = string
      /**
       * Transaction from date(YYYY-MM-DD)
       */
      export type FromDate = string
      /**
       * Comma separated highLevelCategoryIds
       */
      export type HighLevelCategoryId = string
      /**
       * Transaction search text
       */
      export type Keyword = string
      /**
       * skip (Min 0)
       */
      export type Skip = number // int32
      /**
       * Transaction end date (YYYY-MM-DD)
       */
      export type ToDate = string
      /**
       * top (Max 500)
       */
      export type Top = number // int32
      /**
       * Transaction Type(SELL,SWEEP, etc.) for bank/creditCard/investment
       */
      export type Type = string
    }
    export interface QueryParameters {
      accountId?: /* Comma separated accountIds */ Parameters.AccountId
      baseType?: /* DEBIT/CREDIT */ Parameters.BaseType
      categoryId?: /* Comma separated categoryIds */ Parameters.CategoryId
      categoryType?: /* Transaction Category Type(UNCATEGORIZE, INCOME, TRANSFER, EXPENSE or DEFERRED_COMPENSATION) */ Parameters.CategoryType
      container?: /* bank/creditCard/investment/insurance/loan */ Parameters.Container
      detailCategoryId?: /* Comma separated detailCategoryIds */ Parameters.DetailCategoryId
      fromDate?: /* Transaction from date(YYYY-MM-DD) */ Parameters.FromDate
      highLevelCategoryId?: /* Comma separated highLevelCategoryIds */ Parameters.HighLevelCategoryId
      keyword?: /* Transaction search text */ Parameters.Keyword
      skip?: /* skip (Min 0) */ Parameters.Skip /* int32 */
      toDate?: /* Transaction end date (YYYY-MM-DD) */ Parameters.ToDate
      top?: /* top (Max 500) */ Parameters.Top /* int32 */
      type?: /* Transaction Type(SELL,SWEEP, etc.) for bank/creditCard/investment */ Parameters.Type
    }
    namespace Responses {
      export type $200 =
        /* TransactionResponse */ Definitions.TransactionResponse
      export type $400 = /* YodleeError */ Definitions.YodleeError
    }
  }
  namespace GetTransactionsCount {
    namespace Parameters {
      /**
       * Comma separated accountIds
       */
      export type AccountId = string
      /**
       * DEBIT/CREDIT
       */
      export type BaseType = string
      /**
       * Comma separated categoryIds
       */
      export type CategoryId = string
      /**
       * Transaction Category Type(UNCATEGORIZE, INCOME, TRANSFER, EXPENSE or DEFERRED_COMPENSATION)
       */
      export type CategoryType = string
      /**
       * bank/creditCard/investment/insurance/loan
       */
      export type Container = string
      /**
       * Comma separated detailCategoryIds
       */
      export type DetailCategoryId = string
      /**
       * Transaction from date(YYYY-MM-DD)
       */
      export type FromDate = string
      /**
       * Comma separated highLevelCategoryIds
       */
      export type HighLevelCategoryId = string
      /**
       * Transaction search text
       */
      export type Keyword = string
      /**
       * Transaction end date (YYYY-MM-DD)
       */
      export type ToDate = string
      /**
       * Transaction Type(SELL,SWEEP, etc.)
       */
      export type Type = string
    }
    export interface QueryParameters {
      accountId?: /* Comma separated accountIds	 */ Parameters.AccountId
      baseType?: /* DEBIT/CREDIT */ Parameters.BaseType
      categoryId?: /* Comma separated categoryIds */ Parameters.CategoryId
      categoryType?: /* Transaction Category Type(UNCATEGORIZE, INCOME, TRANSFER, EXPENSE or DEFERRED_COMPENSATION) */ Parameters.CategoryType
      container?: /* bank/creditCard/investment/insurance/loan */ Parameters.Container
      detailCategoryId?: /* Comma separated detailCategoryIds */ Parameters.DetailCategoryId
      fromDate?: /* Transaction from date(YYYY-MM-DD) */ Parameters.FromDate
      highLevelCategoryId?: /* Comma separated highLevelCategoryIds */ Parameters.HighLevelCategoryId
      keyword?: /* Transaction search text	 */ Parameters.Keyword
      toDate?: /* Transaction end date (YYYY-MM-DD) */ Parameters.ToDate
      type?: /* Transaction Type(SELL,SWEEP, etc.) */ Parameters.Type
    }
    namespace Responses {
      export type $200 =
        /* TransactionCountResponse */ Definitions.TransactionCountResponse
      export type $400 = /* YodleeError */ Definitions.YodleeError
    }
  }
  namespace GetUser {
    namespace Responses {
      export type $200 = /* UserDetailResponse */ Definitions.UserDetailResponse
    }
  }
  namespace GetVerificationStatus {
    namespace Parameters {
      /**
       * Comma separated accountId
       */
      export type AccountId = string
      /**
       * Comma separated providerAccountId
       */
      export type ProviderAccountId = string
      /**
       * verificationType
       */
      export type VerificationType = string
    }
    export interface QueryParameters {
      accountId?: /* Comma separated accountId */ Parameters.AccountId
      providerAccountId?: /* Comma separated providerAccountId */ Parameters.ProviderAccountId
      verificationType?: /* verificationType */ Parameters.VerificationType
    }
    namespace Responses {
      export type $200 =
        /* VerificationStatusResponse */ Definitions.VerificationStatusResponse
      export type $400 = /* YodleeError */ Definitions.YodleeError
    }
  }
  namespace GetVerifiedAccounts {
    namespace Parameters {
      /**
       * Comma separated accountIds.
       */
      export type AccountId = string
      /**
       * Comma separated isSelected. Allowed values are true, false <br><b>Note:</b> If no value is passed, the implicit default value is true.
       */
      export type IsSelected = string
      /**
       * providerAccountId.
       */
      export type ProviderAccountId = string
      /**
       * Comma separated verificationStatus. Allowed values are SUCCESS, FAILED <br><b>Note:</b> If no value is passed, the implicit default value is SUCCESS.
       */
      export type VerificationStatus = string
    }
    export interface QueryParameters {
      accountId?: /* Comma separated accountIds. */ Parameters.AccountId
      isSelected?: /* Comma separated isSelected. Allowed values are true, false <br><b>Note:</b> If no value is passed, the implicit default value is true. */ Parameters.IsSelected
      providerAccountId: /* providerAccountId. */ Parameters.ProviderAccountId
      verificationStatus?: /* Comma separated verificationStatus. Allowed values are SUCCESS, FAILED <br><b>Note:</b> If no value is passed, the implicit default value is SUCCESS. */ Parameters.VerificationStatus
    }
    namespace Responses {
      export type $200 =
        /* VerifiedAccountResponse */ Definitions.VerifiedAccountResponse
      export type $400 = /* YodleeError */ Definitions.YodleeError
    }
  }
  namespace InitiateAccountVerification {
    export interface BodyParameters {
      verificationParam: Parameters.VerificationParam
    }
    namespace Parameters {
      /**
       * providerAccountId
       */
      export type ProviderAccountId = string
      export type VerificationParam =
        /* VerifyAccountRequest */ Definitions.VerifyAccountRequest
    }
    export interface PathParameters {
      providerAccountId: /* providerAccountId */ Parameters.ProviderAccountId
    }
    namespace Responses {
      export type $200 =
        /* VerifyAccountResponse */ Definitions.VerifyAccountResponse
      export type $400 = /* YodleeError */ Definitions.YodleeError
    }
  }
  namespace InitiateMatchingOrChallengeDepositeVerification {
    export interface BodyParameters {
      verificationParam: Parameters.VerificationParam
    }
    namespace Parameters {
      export type VerificationParam =
        /* VerificationRequest */ Definitions.VerificationRequest
    }
    namespace Responses {
      export type $200 =
        /* VerificationResponse */ Definitions.VerificationResponse
      export type $400 = /* YodleeError */ Definitions.YodleeError
    }
  }
  namespace LinkProviderAccount {
    export interface BodyParameters {
      providerAccountRequest: Parameters.ProviderAccountRequest
    }
    namespace Parameters {
      export type ProviderAccountRequest =
        /* ProviderAccountRequest */ Definitions.ProviderAccountRequest
      /**
       * providerId
       */
      export type ProviderId = number // int64
    }
    export interface QueryParameters {
      providerId: /* providerId */ Parameters.ProviderId /* int64 */
    }
    namespace Responses {
      export type $200 =
        /* AddedProviderAccountResponse */ Definitions.AddedProviderAccountResponse
      export type $400 = /* YodleeError */ Definitions.YodleeError
    }
  }
  namespace MigrateAccounts {
    namespace Parameters {
      /**
       * providerAccountId
       */
      export type ProviderAccountId = number // int64
    }
    export interface PathParameters {
      providerAccountId: /* providerAccountId */ Parameters.ProviderAccountId /* int64 */
    }
    namespace Responses {
      export type $200 =
        /* AccountMigrationResponse */ Definitions.AccountMigrationResponse
      export type $400 = /* YodleeError */ Definitions.YodleeError
    }
  }
  namespace PushUserData {
    export interface BodyParameters {
      userData?: Parameters.UserData
    }
    namespace Parameters {
      export type UserData =
        /* EnrichDataRequest */ Definitions.EnrichDataRequest
    }
    namespace Responses {
      export type $200 =
        /* EnrichedTransactionResponse */ Definitions.EnrichedTransactionResponse
      export type $400 = /* YodleeError */ Definitions.YodleeError
      export type $500 = /* YodleeError */ Definitions.YodleeError
    }
  }
  namespace RegisterUser {
    export interface BodyParameters {
      userRequest: Parameters.UserRequest
    }
    namespace Parameters {
      export type UserRequest = /* UserRequest */ Definitions.UserRequest
    }
    namespace Responses {
      export type $200 = /* UserResponse */ Definitions.UserResponse
      export type $400 = /* YodleeError */ Definitions.YodleeError
    }
  }
  namespace RenewConsent {
    export interface BodyParameters {
      renewConsentRequest?: Parameters.RenewConsentRequest
    }
    namespace Parameters {
      /**
       * Consent Id to be renewed.
       */
      export type ConsentId = number // int64
      export type RenewConsentRequest =
        /* RenewConsentRequest */ Definitions.RenewConsentRequest
    }
    export interface PathParameters {
      consentId: /* Consent Id to be renewed. */ Parameters.ConsentId /* int64 */
    }
    namespace Responses {
      export type $200 =
        /* RenewConsentResponse */ Definitions.RenewConsentResponse
      export type $400 = /* YodleeError */ Definitions.YodleeError
    }
  }
  namespace RunTransactionCategorizationRule {
    namespace Parameters {
      export type Action = 'run'
      /**
       * Unique id of the categorization rule
       */
      export type RuleId = number // int64
    }
    export interface PathParameters {
      ruleId: /* Unique id of the categorization rule */ Parameters.RuleId /* int64 */
    }
    export interface QueryParameters {
      action: Parameters.Action
    }
    namespace Responses {
      export type $400 = /* YodleeError */ Definitions.YodleeError
    }
  }
  namespace SamlLogin {
    namespace Parameters {
      /**
       * issuer
       */
      export type Issuer = string
      /**
       * samlResponse
       */
      export type SamlResponse = string
      /**
       * source
       */
      export type Source = string
    }
    export interface QueryParameters {
      issuer: /* issuer */ Parameters.Issuer
      samlResponse: /* samlResponse */ Parameters.SamlResponse
      source?: /* source */ Parameters.Source
    }
    namespace Responses {
      export type $200 = /* UserResponse */ Definitions.UserResponse
      export type $400 = /* YodleeError */ Definitions.YodleeError
    }
  }
  namespace UpdateAccount {
    export interface BodyParameters {
      accountRequest: Parameters.AccountRequest
    }
    namespace Parameters {
      /**
       * accountId
       */
      export type AccountId = number // int64
      export type AccountRequest =
        /* UpdateAccountRequest */ Definitions.UpdateAccountRequest
    }
    export interface PathParameters {
      accountId: /* accountId */ Parameters.AccountId /* int64 */
    }
    namespace Responses {
      export type $400 = /* YodleeError */ Definitions.YodleeError
    }
  }
  namespace UpdateConsent {
    export interface BodyParameters {
      consentRequest: Parameters.ConsentRequest
    }
    namespace Parameters {
      /**
       * Consent Id generated through POST Consent.
       */
      export type ConsentId = number // int64
      export type ConsentRequest =
        /* UpdateConsentRequest */ Definitions.UpdateConsentRequest
    }
    export interface PathParameters {
      consentId: /* Consent Id generated through POST Consent. */ Parameters.ConsentId /* int64 */
    }
    namespace Responses {
      export type $200 =
        /* UpdatedConsentResponse */ Definitions.UpdatedConsentResponse
      export type $400 = /* YodleeError */ Definitions.YodleeError
    }
  }
  namespace UpdatePreferences {
    export interface BodyParameters {
      preferences: Parameters.Preferences
    }
    namespace Parameters {
      export type Preferences =
        /* ProviderAccountPreferencesRequest */ Definitions.ProviderAccountPreferencesRequest
      /**
       * providerAccountId
       */
      export type ProviderAccountId = number // int64
    }
    export interface PathParameters {
      providerAccountId: /* providerAccountId */ Parameters.ProviderAccountId /* int64 */
    }
    namespace Responses {
      export type $400 = /* YodleeError */ Definitions.YodleeError
    }
  }
  namespace UpdateSubscribedEvent {
    export interface BodyParameters {
      eventRequest: Parameters.EventRequest
    }
    namespace Parameters {
      /**
       * eventName
       */
      export type EventName =
        | 'REFRESH'
        | 'DATA_UPDATES'
        | 'AUTO_REFRESH_UPDATES'
      export type EventRequest =
        /* UpdateCobrandNotificationEventRequest */ Definitions.UpdateCobrandNotificationEventRequest
    }
    export interface PathParameters {
      eventName: /* eventName */ Parameters.EventName
    }
    namespace Responses {
      export type $400 = /* YodleeError */ Definitions.YodleeError
    }
  }
  namespace UpdateSubscribedNotificationEvent {
    export interface BodyParameters {
      eventRequest: Parameters.EventRequest
    }
    namespace Parameters {
      /**
       * eventName
       */
      export type EventName =
        | 'REFRESH'
        | 'DATA_UPDATES'
        | 'AUTO_REFRESH_UPDATES'
        | 'LATEST_BALANCE_UPDATES'
      export type EventRequest =
        /* UpdateConfigsNotificationEventRequest */ Definitions.UpdateConfigsNotificationEventRequest
    }
    export interface PathParameters {
      eventName: /* eventName */ Parameters.EventName
    }
    namespace Responses {
      export type $400 = /* YodleeError */ Definitions.YodleeError
    }
  }
  namespace UpdateTransaction {
    export interface BodyParameters {
      transactionRequest: Parameters.TransactionRequest
    }
    namespace Parameters {
      /**
       * transactionId
       */
      export type TransactionId = number // int64
      export type TransactionRequest =
        /* TransactionRequest */ Definitions.TransactionRequest
    }
    export interface PathParameters {
      transactionId: /* transactionId */ Parameters.TransactionId /* int64 */
    }
    namespace Responses {
      export type $400 = /* YodleeError */ Definitions.YodleeError
    }
  }
  namespace UpdateTransactionCategorizationRule {
    export interface BodyParameters {
      transactionCategoriesRuleRequest: Parameters.TransactionCategoriesRuleRequest
    }
    namespace Parameters {
      /**
       * ruleId
       */
      export type RuleId = number // int64
      export type TransactionCategoriesRuleRequest =
        /* TransactionCategorizationRuleRequest */ Definitions.TransactionCategorizationRuleRequest
    }
    export interface PathParameters {
      ruleId: /* ruleId */ Parameters.RuleId /* int64 */
    }
    namespace Responses {
      export type $400 = /* YodleeError */ Definitions.YodleeError
    }
  }
  namespace UpdateTransactionCategory {
    export interface BodyParameters {
      updateCategoryRequest: Parameters.UpdateCategoryRequest
    }
    namespace Parameters {
      export type UpdateCategoryRequest =
        /* UpdateCategoryRequest */ Definitions.UpdateCategoryRequest
    }
    namespace Responses {
      export type $400 = /* YodleeError */ Definitions.YodleeError
    }
  }
  namespace UpdateUser {
    export interface BodyParameters {
      userRequest: Parameters.UserRequest
    }
    namespace Parameters {
      export type UserRequest =
        /* UpdateUserRequest */ Definitions.UpdateUserRequest
    }
  }
  namespace VerifyChallengeDeposit {
    export interface BodyParameters {
      verificationParam: Parameters.VerificationParam
    }
    namespace Parameters {
      export type VerificationParam =
        /* UpdateVerificationRequest */ Definitions.UpdateVerificationRequest
    }
    namespace Responses {
      export type $200 =
        /* VerificationResponse */ Definitions.VerificationResponse
      export type $400 = /* YodleeError */ Definitions.YodleeError
    }
  }
}

export interface OperationMethods {
  /**
   * pushUserData - Push UserData
   *
   * <b>Push User Data </b><br>The data enrich API v1.1 allows customers to get the transactions enriched in real-time by feeding the data into the Yodlee Platform. To get the transactions enriched, it is necessary that users, accounts, and transactions are updated to the Yodlee Platform.<br>The following features are supported through the data enrich API:<ul><li>Add user</li><li>Add account</li><li>Update account</li><li>Add transactions</li><li>Update transactions</li></ul>Yodlee will enrich the transactions with the following information:<ul><li>Category</li><li>High Level Category</li><li>Detail Category</li><li>Simple description</li><li>Merchant details<ul><li>Name</li><li>Address</li></ul></li><li>Transaction type</li><li>Transaction subtype</li></ul>The data feed through the enrich APIs will be updated to the Yodlee Platform in real time. The updated accounts and transactions information can then be retrieved from the system using the respective Yodlee 1.1 APIs.<br><b> Implementation Notes </b><ul><li>Supported only through credential-based authentication mechanisms.</li><li>Customer must be TLS 1.2 compliant to integrate with the data enrich API.</li><li>Supported account types are savings, checking, and credit.</li><li>A maximum of 128 transactions can be passed to the API.</li><li>As the data enrich API is a premium offering and is priced per API call, Yodlee recommends not to call the API to update accounts and transactions.</li><li>The minimum required parameters to create account and transaction is accepted. The Yodlee data model supports more parameters than what is accepted in this API. Customers can make the rest of the parameters available during the auto-refresh process of the accounts.</li><li>Though few input parameters are optional, Yodlee recommends passing them as the account information will make complete sense to the consumers when it is displayed in the Yodlee applications or widgets.</li></ul>
   */
  'pushUserData'(
    parameters?: Parameters | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.PushUserData.Responses.$200>
  /**
   * getTransactions - Get Transactions
   *
   * The Transaction service is used to get a list of transactions for a user.<br>By default, this service returns the last 30 days of transactions from today's date.<br>The keyword parameter performs a contains search on the original, consumer, and simple description attributes, replace the special characters #, &, and + with percent-encoding values %23, %26, and %2B respectively. Eg: for -Debit# , pass the input as -Debit%23.<br>Values for categoryId parameter can be fetched from get transaction category list service.<br> The categoryId is used to filter transactions based on system-defined category as well as user-defined category.<br>User-defined categoryIds should be provided in the filter with the prefix ''U''. E.g. U10002<br>The skip and top parameters are used for pagination. In the skip and top parameters pass the number of records to be skipped and retrieved, respectively. The response header provides the links to retrieve the next and previous set of transactions.<br>Double quotes in the merchant name will be prefixed by backslashes (&#92;) in the response, e.g. Toys "R" Us. <br>sourceId is a unique ID that the provider site has assigned to the transaction. The source ID is only available for the pre-populated accounts. Pre-populated accounts are the accounts that the FI customers shares with Yodlee, so that the user does not have to add or aggregate those accounts.<br><br><b>Note</b><ul><li><a href="https://developer.yodlee.com/docs/api/1.1/Transaction_Data_Enrichment">TDE</a> is made available for bank and card accounts. The address field in the response is available only when the TDE key is turned on.</li><li>The pagination feature is available by default. If no values are passed in the skip and top parameters, the API will only return the first 500 transactions.</li><li>This service supports the localization feature and accepts locale as a header parameter.</li></ul>
   */
  'getTransactions'(
    parameters?: Parameters<Paths.GetTransactions.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.GetTransactions.Responses.$200>
  /**
   * getAssociatedAccounts - Associated Accounts
   *
   * Yodlee classifies providers into credential-based aggregation and Open Banking (OB) providers.<br>This service is associated with the OB aggregation flow. As part of the OB solution, financial institutions may merge their subsidiaries and provide data as a single OB provider.<br>Before the OB solution, this data was aggregated with different provider IDs.<br>This service accepts the providerAccountId and returns all accounts of the associated providerAccounts that belong to the subsidiary of the financial institution.<br>This data should be displayed to the user to let them select the accounts that they wish to provide consent to share account data.<br>
   */
  'getAssociatedAccounts'(
    parameters?: Parameters<Paths.GetAssociatedAccounts.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.GetAssociatedAccounts.Responses.$200>
  /**
   * getVerifiedAccounts - Get Verified Accounts
   *
   * The Verified Accounts API v1.1 provides information about the bank and investment accounts that the user  has selected for verification, during the Account Verification flow on FastLink 4. By default, the API only returns information of the accounts that were selected and have been successfully verified. <br><br>
   */
  'getVerifiedAccounts'(
    parameters?: Parameters<Paths.GetVerifiedAccounts.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.GetVerifiedAccounts.Responses.$200>
  /**
   * cobrandLogin - Cobrand Login
   *
   * The cobrand login service authenticates a cobrand.<br>Cobrand session in the response includes the cobrand session token (cobSession) <br>which is used in subsequent API calls like registering or signing in the user. <br>The idle timeout for a cobrand session is 2 hours and the absolute timeout is 24 hours. This service can be <br>invoked to create a new cobrand session token. <br><b>Note:</b> This endpoint is deprecated for customers using the API Key-based authentication and is applicable only to customers who use the SAML-based authentication.<br>The content type has to be passed as application/json for the body parameter. <br>
   */
  'cobrandLogin'(
    parameters?: Parameters | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.CobrandLogin.Responses.$200>
  /**
   * getDataExtractsUserData - Get userData
   *
   * The get user data service is used to get a user's modified data for a particular period of time for accounts, transactions, holdings, and provider account information.<br>The time difference between fromDate and toDate fields cannot be more than 60 minutes.<br>By default, pagination is available for the transaction entity in this API. In the first response, the API will retrieve 500 transactions along with other data. The response header will provide a link to retrieve the next set of transactions.<br>In the response body of the first API response, totalTransactionsCount indicates the total number of transactions the API will retrieve for the user.<br>This service is only invoked with either admin access token or a cobrand session.<br/>Refer to <a href="https://developer.yodlee.com/docs/api/1.1/DataExtracts">dataExtracts</a> page for more information.<br><br><b>Note:</b><li>This service supports the localization feature and accepts locale as a header parameter.</li>
   */
  'getDataExtractsUserData'(
    parameters?: Parameters<Paths.GetDataExtractsUserData.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.GetDataExtractsUserData.Responses.$200>
  /**
   * getAllProviders - Get Providers
   *
   * The get provider service is used to get all the providers that are enabled, search a provider service by name or routing number and get popular sites of a region. <br>Searching for a provider using a routing number is applicable only to the USA and Canada regions.<br>The valid values for priority are: <br>   1. cobrand: Returns providers enabled for the cobrand (Default priority)<br>   2. popular: Returns providers popular among users of the customer<br><br>Only the datasets, attributes, and containers that are enabled for the customer will be returned in the response.<br>Input for the dataset$filter should adhere to the following expression:<br><dataset.name>[<attribute.name>.container[<container> OR <container>] OR <attribute.name>.container[<container>]] <br>OR <dataset.name>[<attribute.name> OR <attribute.name>]<br><b>dataset$filter value examples:</b><br>ACCT_PROFILE[FULL_ACCT_NUMBER.container[bank OR investment OR creditCard]]<br>ACCT_PROFILE[FULL_ACCT_NUMBER.container[bank]]<br>BASIC_AGG_DATA[ACCOUNT_DETAILS.container[bank OR investment] OR HOLDINGS.container[bank]] OR ACCT_PROFILE[FULL_ACCT_NUMBER.container[bank]]<br>BASIC_AGG_DATA<br>BASIC_AGG_DATA OR ACCT_PROFILE<br>BASIC_AGG_DATA [ ACCOUNT_DETAILS OR HOLDINGS ]<br>BASIC_AGG_DATA [ ACCOUNT_DETAILS] OR DOCUMENT <br>BASIC_AGG_DATA [ BASIC_ACCOUNT_INFO OR ACCOUNT_DETAILS ] <br><br>The fullAcountNumberFields is specified to filter the providers that have paymentAccountNumber or unmaskedAccountNumber support in the FULL_ACCT_NUMBER dataset attribute.<br><b>Examples for usage of fullAccountNumberFields </b><br>dataset$filter=ACCT_PROFILE[ FULL_ACCT_NUMBER.container [ bank ]] &amp; fullAccountNumberFields=paymentAccountNumber<br>dataset$filter=ACCT_PROFILE[ FULL_ACCT_NUMBER.container [ bank ]] &amp; fullAccountNumberFields=unmaskedAccountNumber<br>dataset$filter=ACCT_PROFILE[ FULL_ACCT_NUMBER.container [ bank ]] &amp; fullAccountNumberFields=unmaskedAccountNumber,paymentAccountNumber<br><br>The skip and top parameters are used for pagination. In the skip and top parameters, pass the number of records to be skipped and retrieved, respectively.<br>The response header provides the links to retrieve the next and previous set of transactions.<br><br><b>Note:</b> <ol><li>In a product flow involving user interaction, Yodlee recommends invoking this service with filters.<li>Without filters, the service may perform slowly as it takes a few minutes to return data in the response.<li>The AuthParameter appears in the response only in case of token-based aggregation sites.<li>The pagination feature only applies when the priority parameter is set as cobrand. If no values are provided in the skip and top parameters, the API will only return the first 500 records.<li>This service supports the localization feature and accepts locale as a header parameter.<li>The capability has been deprecated in query parameter and response.</li></ol>
   */
  'getAllProviders'(
    parameters?: Parameters<Paths.GetAllProviders.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.GetAllProviders.Responses.$200>
  /**
   * getProvider - Get Provider Details
   *
   * The get provider detail service is used to get detailed information including the login form for a provider.<br>The response is a provider object that includes information such as name of the provider, <br>provider's base URL, a list of containers supported by the provider, the login form details of the provider, etc.<br>Only enabled datasets, attributes and containers gets returned in the response.<br><br><b>Note:</b><li>This service supports the localization feature and accepts locale as a header parameter.<li>The capability has been deprecated in the response.
   */
  'getProvider'(
    parameters?: Parameters<Paths.GetProvider.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.GetProvider.Responses.$200>
  /**
   * updateSubscribedEvent - Update Subscription
   *
   * <b>Refer PUT /configs/notifications/events/{eventName}.</b><br>The update events service is used to update the callback URL.<br>If the callback URL is invalid or inaccessible, the subscription will be unsuccessful, and an error will be thrown.<br><b>Note:</b> The content type has to be passed as application/json for the body parameter. <br>
   */
  'updateSubscribedEvent'(
    parameters?: Parameters<Paths.UpdateSubscribedEvent.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<any>
  /**
   * createSubscriptionEvent - Subscribe Event
   *
   * <b>Refer POST /configs/notifications/events/{eventName}.</b><br>The subscribe events service is used to subscribe to an event for receiving notifications.<br>The callback URL, where the notification will be posted should be provided to this service.<br>If the callback URL is invalid or inaccessible, the subscription will be unsuccessful, and an error will be thrown.<br>Customers can subscribe to REFRESH,DATA_UPDATES and AUTO_REFRESH_UPDATES event.<br><br><b>Notes</b>:<br>This service is not available in developer sandbox/test environment and will be made available for testing in your dedicated environment, once the contract is signed.<br>The content type has to be passed as application/json for the body parameter.<br>
   */
  'createSubscriptionEvent'(
    parameters?: Parameters<Paths.CreateSubscriptionEvent.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<any>
  /**
   * deleteSubscribedEvent - Delete Subscription
   *
   * <b>Refer DELETE /configs/notifications/events/{eventName}.</b><br>The delete events service is used to unsubscribe from an events service.<br>
   */
  'deleteSubscribedEvent'(
    parameters?: Parameters<Paths.DeleteSubscribedEvent.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<any>
  /**
   * getSubscribedNotificationEvents - Get Subscribed Notification Events
   *
   * The get events service provides the list of events for which consumers subscribed to receive notifications. <br>
   */
  'getSubscribedNotificationEvents'(
    parameters?: Parameters<Paths.GetSubscribedNotificationEvents.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.GetSubscribedNotificationEvents.Responses.$200>
  /**
   * getProvidersCount - Get Providers Count
   *
   * The count service provides the total number of providers that get returned in the GET /providers depending on the input parameters passed.<br>If you are implementing pagination for providers, call this endpoint before calling GET /providers to know the number of providers that are returned for the input parameters passed.<br>The functionality of the input parameters remains the same as that of the GET /providers endpoint<br><br><b>Note:</b> <li>The capability has been deprecated in the query parameter.</li>
   */
  'getProvidersCount'(
    parameters?: Parameters<Paths.GetProvidersCount.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.GetProvidersCount.Responses.$200>
  /**
   * getNetworth - Get Networth Summary
   *
   * The get networth service is used to get the networth for the user.<br>If the include parameter value is passed as details then networth with historical balances is returned. <br>
   */
  'getNetworth'(
    parameters?: Parameters<Paths.GetNetworth.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.GetNetworth.Responses.$200>
  /**
   * samlLogin - Saml Login
   *
   * The SAML login service is used to authenticate system users with a SAML response.<br>A new user will be created with the input provided if that user isn't already in the system.<br>For existing users, the system will make updates based on changes or new information.<br>When authentication is successful, a user session token is returned.<br><br><b>Note:</b> <li>The content type has to be passed as application/x-www-form-urlencoded. <li>issuer, source and samlResponse should be passed as body parameters.</li>
   */
  'samlLogin'(
    parameters?: Parameters<Paths.SamlLogin.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.SamlLogin.Responses.$200>
  /**
   * getHolderProfile - Get Holder Profile
   *
   * The Holder Profile API service allows retrieving the user's profile details (i.e., PII data such as name, email, phone number, and address) that are available at the provider account and each account level. The API accepts the providerAccountId and retrieves the profile information available under it and all the details available under each of the associated accounts.  <br><br>This service can only be invoked by Yodlee API v1.1, FastLink 3, and FastLink 4 customers. <br><br>
   */
  'getHolderProfile'(
    parameters?: Parameters<Paths.GetHolderProfile.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.GetHolderProfile.Responses.$200>
  /**
   * downloadDocument - Download a Document
   *
   * The get document details service allows consumers to download a document. The document is provided in base64.<br>This API is a premium service which requires subscription in advance to use.  Please contact Yodlee Client Services for more information. <br>
   */
  'downloadDocument'(
    parameters?: Parameters<Paths.DownloadDocument.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.DownloadDocument.Responses.$200>
  /**
   * deleteDocument - Delete Document
   *
   * The delete document service allows the consumer to delete a document. The deleted document will not be returned in the get documents API. The HTTP response code is 204 (success without content).<br>Documents can be deleted only if the document related dataset attributes are subscribed.<br>
   */
  'deleteDocument'(
    parameters?: Parameters<Paths.DeleteDocument.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<any>
  /**
   * updateTransactionCategorizationRule - Update Transaction Categorization Rule
   *
   * The update transaction categorization rule service is used to update a categorization rule for both system-defined category as well as user-defined category.<br>ruleParam JSON input should be as explained in the create transaction categorization rule service.<br>The HTTP response code is 204 (Success without content).<br>
   */
  'updateTransactionCategorizationRule'(
    parameters?: Parameters<Paths.UpdateTransactionCategorizationRule.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<any>
  /**
   * runTransactionCategorizationRule - Run Transaction Categorization Rule
   *
   * The run transaction categorization rule service is used to run a rule on transactions, to categorize the transactions.<br>The HTTP response code is 204 (Success with no content).<br>
   */
  'runTransactionCategorizationRule'(
    parameters?: Parameters<
      Paths.RunTransactionCategorizationRule.PathParameters &
        Paths.RunTransactionCategorizationRule.QueryParameters
    > | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<any>
  /**
   * deleteTransactionCategorizationRule - Delete Transaction Categorization Rule
   *
   * The delete transaction categorization rule service is used to delete the given user-defined transaction categorization rule for both system-defined category as well as user-defined category.<br>This will delete all the corresponding rule clauses associated with the rule.<br>The HTTP response code is 204 (Success without content).<br>
   */
  'deleteTransactionCategorizationRule'(
    parameters?: Parameters<Paths.DeleteTransactionCategorizationRule.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<any>
  /**
   * getAccessTokens - Get Access Tokens
   *
   * The Get Access Tokens service is used to retrieve the access tokens for the application id(s) provided.<br>URL in the response can be used to launch the application for which token is requested.<br><br><b>Note:</b> <li>This endpoint is deprecated for customers using the API Key-based authentication and is applicable only to customers who use the SAML-based authentication.<br>
   */
  'getAccessTokens'(
    parameters?: Parameters<Paths.GetAccessTokens.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.GetAccessTokens.Responses.$200>
  /**
   * cobrandLogout - Cobrand Logout
   *
   * The cobrand logout service is used to log out the cobrand.<br>This service does not return a response. The HTTP response code is 204 (Success with no content).<br><b>Note:</b> This endpoint is deprecated for customers using the API Key-based authentication and is applicable only to customers who use the SAML-based authentication.<br>
   */
  'cobrandLogout'(
    parameters?: Parameters | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<any>
  /**
   * getConsentDetails - Get Authorization Details
   *
   * The get authorization URL for consent service provides the authorization URL for the renew consent flow, within the consent dashboard.<b>Note:</b>This service supports the localization feature and accepts locale as a header parameter.<br>
   */
  'getConsentDetails'(
    parameters?: Parameters<Paths.GetConsentDetails.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.GetConsentDetails.Responses.$200>
  /**
   * updateConsent - Put Consent
   *
   * The update consent service is used to capture the user acceptance of the consent presented to him or her. <br/>This service returns the authorization-redirect URL that should be used to display to the user, the bank's authentication interface.<b>Note:</b>This service supports the localization feature and accepts locale as a header parameter.<br>
   */
  'updateConsent'(
    parameters?: Parameters<Paths.UpdateConsent.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.UpdateConsent.Responses.$200>
  /**
   * updatePreferences - Update Preferences
   *
   * This endpoint is used to update preferences like data extracts and auto refreshes without triggering refresh for the providerAccount.<br>Setting isDataExtractsEnabled to false will not trigger data extracts notification and dataExtracts/events will not reflect any data change that is happening for the providerAccount.<br>Modified data will not be provided in the dataExtracts/userData endpoint.<br>Setting isAutoRefreshEnabled to false will not trigger auto refreshes for the provider account.<br>
   */
  'updatePreferences'(
    parameters?: Parameters<Paths.UpdatePreferences.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<any>
  /**
   * generateAccessToken - Generate Access Token
   *
   * <b>Generate Access Token using client credential authentication.</b><br>This service returns access tokens required to access Yodlee 1.1 APIs. These tokens are the simplest and easiest of several alternatives for authenticating with Yodlee servers.<br>The most commonly used services obtain data specific to an end user (your customer). For these services, you need a <b>user access token</b>. These are simply tokens created with the user name parameter (<b>loginName</b>) set to the id of your end user.  <i><br><br><b>Note:</b> You determine this id and you must ensure it's unique among all your customers.</i> <br><br>Each token issued has an associated user. The token passed in the http headers explicitly names the user referenced in that API call.<br><br>Some of the APIs do administrative work, and don't reference an end user. <br/>One example of administrative work is key management. Another example is registering a new user explicitly, with <b>POST /user/register</b> call or subscribe to webhook, with <b>POST /config/notifications/events/{eventName}</b>. <br/>To invoke these, you need an <b>admin access token</b>. Create this by passing in your admin user login name in place of a regular user name.<br><br>This service also allows for simplified registration of new users. Any time you pass in a user name not already in use, the system will automatically implicitly create a new user for you. <br>This user will naturally have very few associated details. You can later provide additional user information by calling the <b>PUT user/register service</b>.<br><br><b>Notes:</b><ul><li>The header <code>Authorization</code> does not apply to this service.</li><li>The content type has to be passed as application/x-www-form-urlencoded.<li>Upgrading to client credential authentication requires infrastructure reconfiguration. <li>Customers wishing to switch from another authentication scheme to client credential authentication, please contact Yodlee Client Services.</li><li>Default expiry time of user access token and admin access token is 30 minutes.</li></ul>
   */
  'generateAccessToken'(
    parameters?: Parameters | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.GenerateAccessToken.Responses.$201>
  /**
   * deleteToken - Delete Token
   *
   * This endpoint revokes the token passed in the Authorization header. This service is applicable for JWT-based (and all API key-based) authentication and also client credential (clientId and secret) based authentication. This service does not return a response body. The HTTP response code is 204 (success with no content). <br>Tokens generally have limited lifetime of up to 30 minutes. You will call this service when you finish working with one user, and you want to delete the valid token rather than simply letting it expire.<br><br><b>Note:</b> <li>Revoking an access token (either type, admin or a user token) can take up to 2 minutes, as the tokens are stored on a distributed system.<br/>
   */
  'deleteToken'(
    parameters?: Parameters | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<any>
  /**
   * getProviderAccount - Get Provider Account Details
   *
   * The get provider account details service is used to learn the status of adding accounts and updating accounts.<br>This service has to be called continuously to know the progress level of the triggered process. This service also provides the MFA information requested by the provider site.<br>When <i>include = credentials</i>, questions is passed as input, the service returns the credentials (non-password values) and questions stored in the Yodlee system for that provider account. <br><br><b>Note:</b> <li>The password and answer fields are not returned in the response.</li>
   */
  'getProviderAccount'(
    parameters?: Parameters<
      Paths.GetProviderAccount.PathParameters &
        Paths.GetProviderAccount.QueryParameters
    > | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.GetProviderAccount.Responses.$200>
  /**
   * deleteProviderAccount - Delete Provider Account
   *
   * The delete provider account service is used to delete a provider account from the Yodlee system. This service also deletes the accounts that are created in the Yodlee system for that provider account. <br>This service does not return a response. The HTTP response code is 204 (Success with no content).<br>
   */
  'deleteProviderAccount'(
    parameters?: Parameters<Paths.DeleteProviderAccount.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<any>
  /**
   * getUser - Get User Details
   *
   * The get user details service is used to get the user profile information and the application preferences set at the time of user registration.<br>
   */
  'getUser'(
    parameters?: Parameters | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.GetUser.Responses.$200>
  /**
   * updateUser - Update User Details
   *
   * The update user details service is used to update user details like name, address, currency preference, etc.<br>Currency provided in the input will be respected in the <a href="https://developer.yodlee.com/api-reference#tag/Derived">derived</a> services and the amount fields in the response will be provided in the preferred currency.<br>The HTTP response code is 204 (Success without content). <br>
   */
  'updateUser'(
    parameters?: Parameters | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<any>
  /**
   * getAllAccounts - Get Accounts
   *
   * The get accounts service provides information about accounts added by the user.<br>By default, this service returns information for active and to be closed accounts.<br>If requestId is provided, the accounts that are updated in the context of the requestId will be provided in the response.<br><br><b>Note:</b><br><ul><li>fullAccountNumber is deprecated and is replaced with fullAccountNumberList in include parameter and response.</li><li>fullAccountNumberList, PII (Personal Identifiable Information) and holder details are not available by default, as it is a premium feature that needs security approval. This will not be available for testing in Sandbox environment.</li></ul>
   */
  'getAllAccounts'(
    parameters?: Parameters<Paths.GetAllAccounts.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.GetAllAccounts.Responses.$200>
  /**
   * createManualAccount - Add Manual Account
   *
   * The add account service is used to add manual accounts.<br>The response of add account service includes the account name , account number and Yodlee generated account id.<br>All manual accounts added will be included as part of networth calculation by default.<br>Add manual account support is available for bank, card, investment, insurance and loan container only.<br><br><b>Note:</b><ul> <li>A real estate account addition is only supported for SYSTEM and MANUAL valuation type.</li></ul>
   */
  'createManualAccount'(
    parameters?: Parameters | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.CreateManualAccount.Responses.$200>
  /**
   * unregister - Delete User
   *
   * The delete user service is used to delete or unregister a user from Yodlee. <br>Once deleted, the information related to the users cannot be retrieved. <br>The HTTP response code is 204 (Success without content)<br>
   */
  'unregister'(
    parameters?: Parameters | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<any>
  /**
   * getAssetClassificationList - Get Asset Classification List
   *
   * The get asset classifications list service is used to get the supported asset classifications. <br>The response includes different classification types like assetClass, country, sector, style, etc. and the values corresponding to each type.<br>
   */
  'getAssetClassificationList'(
    parameters?: Parameters | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.GetAssetClassificationList.Responses.$200>
  /**
   * initiateAccountVerification - Verify Accounts Using Transactions
   *
   * The verify account service is used to verify the account's ownership by  matching the transaction details with the accounts aggregated for the user.<br><ul><li>If a match is identified, the service returns details of all the accounts along with the matched transaction's details.<li>If no transaction match is found, an empty response will be returned.<li>A maximum of 5 transactionCriteria can be passed in a request.<li>The baseType, date, and amount parameters should mandatorily be passed.<li>The optional dateVariance parameter cannot be more than 7 days. For example, +7, -4, or +/-2.<li>Pass the container or accountId parameters for better performance.<li>This service supports the localization feature and accepts locale as a header parameter.</li></ul>
   */
  'initiateAccountVerification'(
    parameters?: Parameters<Paths.InitiateAccountVerification.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.InitiateAccountVerification.Responses.$200>
  /**
   * getPublicEncryptionKey - Get Public Key
   *
   * The get public key service provides the public key that should be used to encrypt user credentials while invoking POST /providerAccounts and PUT /providerAccounts endpoints.<br>This service will only work if the PKI (public key infrastructure) feature is enabled for the customer.<br><br><b>Note:</b><li> The key in the response is a string in PEM format.</li><li>This endpoint is not available in the Sandbox environment and it is useful only if the PKI feature is enabled.</li>
   */
  'getPublicEncryptionKey'(
    parameters?: Parameters | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.GetPublicEncryptionKey.Responses.$200>
  /**
   * deleteApiKey - Delete API Key
   *
   * This endpoint allows an existing API key to be deleted.<br>You can use one of the following authorization methods to access this API:<br><ol><li>cobsession</li><li>JWT token</li></ol> <b>Notes:</b> <li>This service is not available in developer sandbox environment and will be made availablefor testing in your dedicated environment.
   */
  'deleteApiKey'(
    parameters?: Parameters<Paths.DeleteApiKey.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<any>
  /**
   * getAllProviderAccounts - Get Provider Accounts
   *
   * The get provider accounts service is used to return all the provider accounts added by the user. <br>This includes the failed and successfully added provider accounts.<br>
   */
  'getAllProviderAccounts'(
    parameters?: Parameters<Paths.GetAllProviderAccounts.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.GetAllProviderAccounts.Responses.$200>
  /**
   * editCredentialsOrRefreshProviderAccount - Update Account
   *
   * <b>Credential-based Implementation Notes:</b> <br>The update account API is used to:  &bull; Retrieve the latest information for accounts that belong to one providerAccount from the provider site. You must allow at least 15 min between requests. <br> &bull; Update account credentials when the user has changed the authentication information at the provider site. <br> &bull; Post MFA information for the MFA-enabled provider accounts during add and update accounts. <br> &bull; Retrieve the latest information of all the eligible accounts that belong to the user. <br><br><b>Edit Credentials - Notes: </b> <br> &bull; If credentials have to be updated in the Yodlee system, one of the following should be provided: <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#9702; LoginForm <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#9702; Field array <br> &bull; LoginForm or the field array, can be obtained from the GET providerAccounts/{providerAccountId}?include=credentials API response. <br> &bull; The credentials provided by the user should be embedded in the loginForm or field array object before you pass to this API. <br><b>Posting MFA Info - Notes: </b> <br>1. You might receive the MFA request details to be presented to the end user in the GET providerAccounts/{providerAccount} API during polling or through REFRESH webhooks notificaiton. <br>2. After receiving the inputs from your user: <br>&nbsp;&nbsp;&nbsp;&nbsp;a.Embed the MFA information provided by the user in the loginForm or field array object.<br>&nbsp;&nbsp;&nbsp;&nbsp;b.Pass one of the following objects as input to this API:<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&bull; LoginForm<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&bull; Field array<br/><br><b>Points to consider:</b><br>&bull; Data to be retrieved from the provider site can be overridden using datasetName or dataset. If you do pass datasetName, all the datasets that are implicitly configured for <br>the dataset will be retrieved. This action is allowed for edit credentials and single provider account refresh flows only. <br>&bull; Encrypt the credentials and MFA information using the public key.<br>&bull; While testing the PKI feature in sandbox environment, encrypt the password credentials and answers to the MFA questions using the encryption tool.<br/><br><b>--------------------------------------------------------------------------------------------------------------------------------</b><br><b>Open Banking (OB)-based Authentication - Notes:</b><br>The update account API is used to:<br>&bull; Retrieve the latest information for accounts from the provider site.<br>&bull; Update the renewed consent for an existing provider account.<br>&bull; Retrieve the latest information for all the eligible accounts that belong to the user.<br/><br>Yodlee recommendations: <br/>&bull; Create the field entity with the authParameters provided in the get provider details API.<br>&bull; Populate the field entity with the values received from the OB site and pass it to this API.<br/><br><b>--------------------------------------------------------------------------------------------------------------------------------</b><br><b>Update All Eligible Accounts - Notes: </b><br>&bull; This API will trigger a refresh for all the eligible provider accounts(both OB and credential-based accounts).<br>&bull; This API will not refresh closed, inactive, or UAR accounts, or accounts with refreshes in-progress or recently refreshed non-OB accounts.<br>&bull; No parameters should be passed to this API to trigger this action.<br>&bull; Do not call this API often. Our recommendation is to call this only at the time the user logs in to your app because it can hamper other API calls performance. <br>&bull; The response only contains information for accounts that were refreshed. If no accounts are eligible for refresh, no response is returned.<br/><br><b>--------------------------------------------------------------------------------------------------------------------------------</b><br><b>What follows are common to both OB and credential-based authentication implementations:  </b><br>&bull; Check the status of the providerAccount before invoking this API. Do not call this API to trigger any action on a providerAccount when an action is already in progress for the providerAccount. <br>&bull; If the customer has subscribed to the REFRESH event notification and invoked this API, relevant notifications will be sent to the customer.<br>&bull; A dataset may depend on another dataset for retrieval, so the response will include the requested and dependent datasets.<br>&bull; Check all the dataset additional statuses returned in the response because the provider account status is drawn from the dataset additional statuses.<br>&bull; Updating preferences using this API will trigger refreshes.<br>&bull; Pass linkedProviderAccountId in the input to link a user's credential-based providerAccount with the OB providerAccount or viceversa. Ensure that the both the providerAccounts belong to the same institution. <br>&bull; The content type has to be passed as application/json for the body parameter.<br>
   */
  'editCredentialsOrRefreshProviderAccount'(
    parameters?: Parameters<Paths.EditCredentialsOrRefreshProviderAccount.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.EditCredentialsOrRefreshProviderAccount.Responses.$200>
  /**
   * linkProviderAccount - Add Account
   *
   * The add account service is used to link the user's account with the provider site in the Yodlee system. Providers that require multifactor authentication or open banking are also supported by this service. The response includes the Yodlee generated ID (providerAccountId) of the account along with the refresh information.<br><br>Open Banking Implementation Notes: <br>To link the user's account of the Open Banking provider site in the Yodlee system, pass the field entity that contains:<br>1. id - From the authParameters provided in the get provider details service<br>2. value - From the redirect URL of the Open Banking site<br><br>Credential-based Implementation Notes: <br>1. The loginForm or the field array are the objects under the provider object, obtained from the <a href="https://developer.yodlee.com/apidocs/index.php#!/providers/getSiteDetail">get provider details</a> service response.<br>2. The credentials provided by the user should be embedded in the loginForm or field array object.<br>3. While testing the <a href="https://developer.yodlee.com/KnowledgeBase/How_to_use_PKI">PKI feature</a>, encrypt the credentials using the <a href="https://developer.yodlee.com/apidocs/utility/encrypt.html">encryption utility</a>.<br>4. The data to be retrieved from the provider site can be passed using datasetName or dataset. If datasetName is passed, all the attributes that are implicitly configured for the dataset will be retrieved.<br>5. If the customer has not subscribed to the REFRESH event webhooks notification for accounts that require multifactor authentication (MFA), the get providerAccount service has to be called continuously till the login form (supported types are token, question & answer, and captcha) is returned in the response.<br>6. The <a href="https://developer.yodlee.com/apidocs/index.php#!/providerAccounts/updateAccount">update account</a> service should be called to post the MFA information to continue adding the account.<br><br>Generic Implementation Notes:<br>1. Refer to the <a href="https://developer.yodlee.com/Yodlee_API/docs/v1_1/API_Flow">add account</a> flow chart for implementation.<br>2. The get provider account details has <a href="https://developer.yodlee.com/Yodlee_API/docs/v1_1/Webhooks">webhooks support</a>. If the customer has subscribed to the REFRESH event notification and has invoked this service to add an account, relevant notifications will be sent to the callback URL.<br>3. If you had not subscribed for notifications, the <a href="https://developer.yodlee.com/apidocs/index.php#!/providerAccounts/getRefreshForProviderAccount">get provider account </a> details service has to be polled continuously till the account addition status is FAILED or PARTIAL_SUCCESS or SUCCESS. <br>4. A dataset may depend on another dataset for retrieval, so the response will include the requested datasets and the dependent datasets.<br>   It is necessary to check all the dataset additional statuses returned in the response, as the provider account status is drawn from the dataset additional statuses.<br>5. Pass linkedProviderAccountId in the input to link a user's credential-based providerAccount with the open banking providerAccount. Ensure that the credential-based providerAccount belongs to the same institution. <br>6. The content type has to be passed as application/json in the body parameter.
   */
  'linkProviderAccount'(
    parameters?: Parameters<Paths.LinkProviderAccount.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.LinkProviderAccount.Responses.$200>
  /**
   * getTransactionSummary - Get Transaction Summary
   *
   * The transaction summary service provides the summary values of transactions for the given date range by category type, high-level categories, or system-defined categories.<br><br>Yodlee has the transaction data stored for a day, month, year and week per category as per the availability of user's data. If the include parameter value is passed as details, then summary details will be returned depending on the interval passed-monthly is the default.<br><br><b>Notes:</b><ol> <li> Details can be requested for only one system-defined category<li>Passing categoryType is mandatory except when the groupBy value is CATEGORY_TYPE<li>Dates will not be respected for monthly, yearly, and weekly details<li>When monthly details are requested, only the fromDate and toDate month will be respected<li>When yearly details are requested, only the fromDate and toDate year will be respected<li>For weekly data points, details will be provided for every Sunday date available within the fromDate and toDate<li>This service supports the localization feature and accepts locale as a header parameter</li></ol>
   */
  'getTransactionSummary'(
    parameters?: Parameters<Paths.GetTransactionSummary.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.GetTransactionSummary.Responses.$200>
  /**
   * getTransactionsCount - Get Transactions Count
   *
   * The count service provides the total number of transactions for a specific user depending on the input parameters passed.<br>If you are implementing pagination for transactions, call this endpoint before calling GET /transactions to know the number of transactions that are returned for the input parameters passed.<br>The functionality of the input parameters remains the same as that of the GET /transactions endpoint.<br>
   */
  'getTransactionsCount'(
    parameters?: Parameters<Paths.GetTransactionsCount.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.GetTransactionsCount.Responses.$200>
  /**
   * renewConsent - Renew Consent
   *
   * The consent renewal service is used to renew the consent by validating the consent state. This API supports both UK and AU Open Banking. </br><b>Renewing an UK Open Banking consent:</b><br><li>Before the grace period of 90 days: The consent will be renewed using the third-party provider (TPP) renewal process that Yodlee does, and no consent reauthorisation is required.The API response will contain the complete renewed consent object.</li><li>After the grace period of 90 days: The API will provide an authorisation URL to redirect the user to the financial institution site to complete the consent reauthorization process.<br><b>Renewing an AU Open Banking consent:</b><br><li>Invoke this API, and in the API response, an authorisation URL will be provided to redirect the user to the financial institution site to complete the consent reauthorisation process.</li><br>
   */
  'renewConsent'(
    parameters?: Parameters<Paths.RenewConsent.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.RenewConsent.Responses.$200>
  /**
   * migrateAccounts - Migrate Accounts
   *
   * This service is associated with the open banking (OB) flow.<br>Before invoking this service, display all the associated accounts to the user by calling the GET /associatedAccounts API.<br>The migrate accounts API treats the user's consent acceptance to initiate account migration. Invoking this service indicates that the user has given the consent to access the associated account information from the financial institution.<br>If an existing provider supports bank, card, and loan accounts, and chose only to provide bank and card through OB APIs, a new providerAccountId for OB will be created.<br>The bank and card account information will be moved to the new providerAccountId. The loan account will be retained in the existing provider account.<br>This service returns the OB providerId and the OB providerAccountId. Note that, as part of this process, there is a possibility of one or more providerAccounts getting merged.<br>The update or delete actions will not be allowed for the providerAccounts involved in the migration process until the user completes the authorization on the OB provider.<br>The oauthMigrationEligibilityStatus attribute in the GET /accounts API response indicates the accounts included in the migration process.<br>
   */
  'migrateAccounts'(
    parameters?: Parameters<Paths.MigrateAccounts.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.MigrateAccounts.Responses.$200>
  /**
   * getTransactionCategorizationRules - Get Transaction Categorization Rules
   *
   * The get transaction categorization rule service is used to get all the categorization rules.<br>
   */
  'getTransactionCategorizationRules'(
    parameters?: Parameters | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.GetTransactionCategorizationRules.Responses.$200>
  /**
   * deleteTransactionCategory - Delete Category
   *
   * The delete transaction categories service is used to delete the given user-defined category.<br>The HTTP response code is 204 (Success without content).<br>
   */
  'deleteTransactionCategory'(
    parameters?: Parameters<Paths.DeleteTransactionCategory.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<any>
  /**
   * getDocuments - Get Documents
   *
   * The get documents service allows customers to search or retrieve metadata related to documents. <br>The API returns the document as per the input parameters passed. If no date range is provided then all downloaded documents will be retrieved. Details of deleted documents or documents associated to closed providerAccount will not be returned. <br>This API is a premium service which requires subscription in advance to use.  Please contact Yodlee Client Services for more information. <br>
   */
  'getDocuments'(
    parameters?: Parameters<Paths.GetDocuments.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.GetDocuments.Responses.$200>
  /**
   * evaluateAddress - Evaluate Address
   *
   * Use this service to validate the address before adding the real estate account.<br>If the address is valid, the service will return the complete address information.<br>The response will contain multiple addresses if the user-provided input matches with multiple entries in the vendor database.<br>In the case of multiple matches, the user can select the appropriate address from the list and then invoke the add account service with the complete address.<br><br><b>Note:</b> <ul><li>Yodlee recommends to use this service before adding the real estate account to avoid failures.</li></ul>
   */
  'evaluateAddress'(
    parameters?: Parameters | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.EvaluateAddress.Responses.$200>
  /**
   * getAccount - Get Account Details
   *
   * The get account details service provides detailed information of an account.<br><br><b>Note:</b><li> fullAccountNumber is deprecated and is replaced with fullAccountNumberList in include parameter and response.</li>
   */
  'getAccount'(
    parameters?: Parameters<
      Paths.GetAccount.PathParameters & Paths.GetAccount.QueryParameters
    > | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.GetAccount.Responses.$200>
  /**
   * updateAccount - Update Account
   *
   * The update account service is used to update manual and aggregated accounts.<br>The HTTP response code is 204 (Success without content).<br>Update manual account support is available for bank, card, investment, insurance, loan, otherAssets, otherLiabilities and realEstate containers only.<br><br><b>Note:</b><li> A real estate account update is only supported for SYSTEM and MANUAL valuation type.</li> <li> A real estate account can be linked to a loan account by passing accountId of a loan account in linkedAccountIds .</li> <li> Attribute <b>isEbillEnrolled</b> is deprecated as it is applicable for bill accounts only.</li>
   */
  'updateAccount'(
    parameters?: Parameters<Paths.UpdateAccount.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<any>
  /**
   * deleteAccount - Delete Account
   *
   * The delete account service allows an account to be deleted.<br>This service does not return a response. The HTTP response code is 204 (Success with no content).<br>
   */
  'deleteAccount'(
    parameters?: Parameters<Paths.DeleteAccount.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<any>
  /**
   * getHistoricalBalances - Get Historical Balances
   *
   * The historical balances service is used to retrieve the historical balances for an account or a user.<br>Historical balances are daily (D), weekly (W), and monthly (M). <br>The interval input should be passed as D, W, and M to retrieve the desired historical balances. The default interval is daily (D). <br>When no account id is provided, historical balances of the accounts that are active, to be closed, and closed are provided in the response. <br>If the fromDate and toDate are not passed, the last 90 days of data will be provided. <br>The fromDate and toDate should be passed in the YYYY-MM-DD format. <br>The date field in the response denotes the date for which the balance is requested.<br>includeCF needs to be sent as true if the customer wants to return carried forward balances for a date when the data is not available. <br>asofDate field in the response denotes the date as of which the balance was updated for that account.<br>When there is no balance available for a requested date and if includeCF is sent as true, the previous date for which the balance is available is provided in the response. <br>When there is no previous balance available, no data will be sent. <br>By default, pagination is available for the historicalBalances entity in this API. The skip and top parameters are used for pagination. In the skip and top parameters, pass the number of records to be skipped and retrieved, respectively. The response header provides the links to retrieve the next and previous set of historical balances.<br> The API will only retrieve a maximum 500 records by default when values for skip and top parameters are not provided.
   */
  'getHistoricalBalances'(
    parameters?: Parameters<Paths.GetHistoricalBalances.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.GetHistoricalBalances.Responses.$200>
  /**
   * getProviderAccountProfiles - Get User Profile Details
   *
   * <b>Refer GET /verification/holderProfile</b><br>The get provider accounts profile service is used to return the user profile details that are associated to the provider account. <br>
   */
  'getProviderAccountProfiles'(
    parameters?: Parameters<Paths.GetProviderAccountProfiles.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.GetProviderAccountProfiles.Responses.$200>
  /**
   * registerUser - Register User
   *
   * The register user service is used to register a user in Yodlee.<br>The loginName cannot include spaces and must be between 3 and 150 characters.<br>locale passed must be one of the supported locales for the customer. <br>Currency provided in the input will be respected in the derived services and the amount fields in the response will be provided in the preferred currency.<br>userParam is accepted as a body parameter. <br><br><b>Note:</b> <li>The content type has to be passed as application/json for the body parameter.</li>
   */
  'registerUser'(
    parameters?: Parameters | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.RegisterUser.Responses.$200>
  /**
   * getVerificationStatus - Get Verification Status
   *
   * The get verification status service is used to retrieve the verification status of all accounts for which the MS or CDV process has been initiated.<br>For the MS process, the account details object returns the aggregated information of the verified accounts. For the CDV process, the account details object returns the user provided account information.<br>
   */
  'getVerificationStatus'(
    parameters?: Parameters<Paths.GetVerificationStatus.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.GetVerificationStatus.Responses.$200>
  /**
   * verifyChallengeDeposit - Verify Challenge Deposit
   *
   * The put verification service is used to complete the challenge deposit verification (CDV) process.<br>This service is used only by the customer of CDV flow.<br>In the CDV process, the user-provided microtransaction details (i.e., credit and debit) is matched against the microtransactions posted by Yodlee. For a successful verification of the account's ownership both the microtransaction details should match.<br>The CDV process is currently supported only in the United States.<br><br><b>Notes:</b><ul><li>This endpoint cannot be used to test the CDV functionality in the developer sandbox or test environment. You will need a money transmitter license to implement the CDV functionality and also require the Yodlee Professional Services team's assistance to set up a dedicated environment.</li></ul>
   */
  'verifyChallengeDeposit'(
    parameters?: Parameters | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.VerifyChallengeDeposit.Responses.$200>
  /**
   * initiateMatchingOrChallengeDepositeVerification - Initiaite Challenge Deposit
   *
   * The post verification service is used to initiate the matching service (MS) and the challenge deposit account verification (CDV) process to verify account ownership.<br>The MS and CDV process can verify ownership of only bank accounts (i.e., checking and savings).<br>The MS verification can be initiated only for an already aggregated account or a providerAccount.<br>The prerequisite for the MS verification process is to request the ACCT_PROFILE dataset with the HOLDER_NAME attribute.<br>In the MS verification process, a string-match of the account holder name with the registered user name is performed instantaneously. You can contact the Yodlee CustomerCare to configure the full name or only the last name match.<br>Once the CDV process is initiated Yodlee will post the microtransaction (i.e., credit and debit) in the user's account. The CDV process takes 2 to 3 days to complete as it requires the user to provide the microtransaction details.<br>The CDV process is currently supported only in the United States.<br>The verificationId in the response can be used to track the verification request.<br><br><b>Notes:</b><li>This endpoint cannot be used to test the CDV functionality in the developer sandbox or test environment. You will need a money transmitter license to implement the CDV functionality and also require the Yodlee Professional Services team's assistance to set up a dedicated environment.
   */
  'initiateMatchingOrChallengeDepositeVerification'(
    parameters?: Parameters | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.InitiateMatchingOrChallengeDepositeVerification.Responses.$200>
  /**
   * getSecurities - Get Security Details
   *
   * The get security details service is used to get all the security information for the holdings<br>
   */
  'getSecurities'(
    parameters?: Parameters<Paths.GetSecurities.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.GetSecurities.Responses.$200>
  /**
   * updateSubscribedNotificationEvent - Update Notification Subscription
   *
   * The update events service is used to update the callback URL.<br>If the callback URL is invalid or inaccessible, the subscription will be unsuccessful, and an error will be thrown.<br><br><b>Note:</b> <li>The content type has to be passed as application/json for the body parameter. <br>
   */
  'updateSubscribedNotificationEvent'(
    parameters?: Parameters<Paths.UpdateSubscribedNotificationEvent.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<any>
  /**
   * createSubscriptionNotificationEvent - Subscribe For Notification Event
   *
   * The subscribe events service is used to subscribe to an event for receiving notifications.<br>The callback URL, where the notification will be posted should be provided to this service.<br>If the callback URL is invalid or inaccessible, the subscription will be unsuccessful, and an error will be thrown.<br>Customers can subscribe to REFRESH,DATA_UPDATES,AUTO_REFRESH_UPDATES and LATEST_BALANCE_UPDATES event.<br><br><b>Notes:</b><li>This service is not available in developer sandbox/test environment and will be made available for testing in your dedicated environment, once the contract is signed.<li>The content type has to be passed as application/json for the body parameter.</li>
   */
  'createSubscriptionNotificationEvent'(
    parameters?: Parameters<Paths.CreateSubscriptionNotificationEvent.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<any>
  /**
   * deleteSubscribedNotificationEvent - Delete Notification Subscription
   *
   * The delete events service is used to unsubscribe from an events service.<br>
   */
  'deleteSubscribedNotificationEvent'(
    parameters?: Parameters<Paths.DeleteSubscribedNotificationEvent.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<any>
  /**
   * getSubscribedEvents - Get Subscribed Events
   *
   * <b>Refer GET /configs/notifications/events.</b><br>The get events service provides the list of events for which consumers subscribed <br>to receive notifications. <br>
   */
  'getSubscribedEvents'(
    parameters?: Parameters<Paths.GetSubscribedEvents.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.GetSubscribedEvents.Responses.$200>
  /**
   * getHoldings - Get Holdings
   *
   * The get holdings service is used to get the list of holdings of a user.<br>Supported holding types can be employeeStockOption, moneyMarketFund, bond, etc. and is obtained using get holding type list service. <br>Asset classifications for the holdings need to be requested through the "include" parameter.<br>Asset classification information for holdings are not available by default, as it is a premium feature.<br>
   */
  'getHoldings'(
    parameters?: Parameters<Paths.GetHoldings.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.GetHoldings.Responses.$200>
  /**
   * getApiKeys - Get API Keys
   *
   * This endpoint provides the list of API keys that exist for a customer.<br>You can use one of the following authorization methods to access this API:<br><ol><li>cobsession</li><li>JWT token</li></ol><b>Notes:</b><li>This service is not available in developer sandbox environment and will be made available for testing in your dedicated environment.
   */
  'getApiKeys'(
    parameters?: Parameters | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.GetApiKeys.Responses.$200>
  /**
   * generateApiKey - Generate API Key
   *
   * This endpoint is used to generate an API key. The RSA public key you provide should be in 2048 bit PKCS#8 encoded format. <br>A public key is a mandatory input for generating the API key.<br/>The public key should be a unique key. The apiKeyId you get in the response is what you should use to generate the JWT token.<br> You can use one of the following authorization methods to access<br/>this API:<br><ol><li>cobsession</li><li>JWT token</li></ol> Alternatively, you can use base 64 encoded cobrandLogin and cobrandPassword in the Authorization header (Format: Authorization: Basic <encoded value of cobrandLogin: cobrandPassword>)<br><br><b>Note:</b><br><li>This service is not available in developer sandbox environment and will be made available for testing in your dedicated environment. The content type has to be passed as application/json for the body parameter.</li>
   */
  'generateApiKey'(
    parameters?: Parameters | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.GenerateApiKey.Responses.$201>
  /**
   * getInstitutions - Get institutions
   *
   * Yodlee classifies providers into credential-based aggregation and Open Banking (OB) providers. The get institutions service helps in identifying credential and related OB sites in a financial institution. The service searches for an institution regardless of the authentication types associated with the providers. Using the get institutions service, retrieve institutions enabled for the customer, search an institution by its name or routing number, and retrieve the popular institutions for a region. Searching for an institution using a routing number applies only to the USA and Canada regions.<br> The valid values for the priority parameter are: <br/> 1.	all: Returns all the institutions enabled for the customer (the default value for the priority parameter).<br/> 2.	search: Returns institutions matching the name provided by the user. The name parameter is mandatory if the priority parameter is set as search.<br/> 3.	popular: Returns institutions that are popular among the customer's users.<br/> Only the datasets, attributes, and containers that are enabled for the customer will be returned in the response.<br/>Input for the dataset$filter should adhere to the following expression:<dataset.name>[<attribute.name>.container[<container> OR <container>] OR <attribute.name>.container[<container>]] <br>OR <dataset.name>[<attribute.name> OR <attribute.name>]<br><b>dataset$filter value examples:</b><br>ACCT_PROFILE[FULL_ACCT_NUMBER.container[bank OR investment OR creditCard]]<br>ACCT_PROFILE[FULL_ACCT_NUMBER.container[bank]]<br>BASIC_AGG_DATA[ACCOUNT_DETAILS.container[bank OR investment] OR HOLDINGS.container[bank]] OR ACCT_PROFILE[FULL_ACCT_NUMBER.container[bank]]<br>BASIC_AGG_DATA<br>BASIC_AGG_DATA OR ACCT_PROFILE<br>BASIC_AGG_DATA [ ACCOUNT_DETAILS OR HOLDINGS ]<br>BASIC_AGG_DATA [ ACCOUNT_DETAILS] OR DOCUMENT <br>BASIC_AGG_DATA [ BASIC_ACCOUNT_INFO OR ACCOUNT_DETAILS ] <br><br>The skip and top parameters are used for pagination. In the skip and top parameters, pass the number of records to be skipped and retrieved, respectively.<br>The response header provides the links to retrieve the next and previous set of transactions.<br><br><b>Note:</b> <br><br/> 1. If no value is set for the priority parameter, all the institutions enabled for the customer will be returned.<br/> 2. In a product flow involving user interaction, Yodlee recommends invoking this service with filters.<br/> Without filters, the service may perform slowly as it takes a few minutes to return data in the response.<br/> 3. The response includes comma separated provider IDs that are associated with the institution.<br/> 4. This service supports the localization feature and accepts locale as a header parameter.<br>
   */
  'getInstitutions'(
    parameters?: Parameters<Paths.GetInstitutions.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.GetInstitutions.Responses.$200>
  /**
   * getPublicKey - Get Public Key
   *
   * <b>Refer GET /configs/publicKey.</b><br>The get public key service provides the customer the public key that should be used to encrypt the user credentials before sending it to Yodlee.<br>This endpoint is useful only for PKI enabled.<br>
   */
  'getPublicKey'(
    parameters?: Parameters | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.GetPublicKey.Responses.$200>
  /**
   * getTransactionCategories - Get Transaction Category List
   *
   * The categories service returns the list of available transaction categories.<br>High level category is returned in the response only if it is opted by the customer.<br>When invoked by passing the cobrand session or admin access token, this service returns the supported transaction categories at the cobrand level. <br>When invoked by passing the cobrand session and the user session or user access token, this service returns the transaction categories <br>along with user-defined categories.<br>Double quotes in the user-defined category name will be prefixed by backslashes (&#92;) in the response, <br>e.g. Toys "R" Us.<br/>Source and id are the primary attributes of the category entity.<br><br><b>Note:</b><li>This service supports the localization feature and accepts locale as a header parameter.</li>
   */
  'getTransactionCategories'(
    parameters?: Parameters | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.GetTransactionCategories.Responses.$200>
  /**
   * updateTransactionCategory - Update Category
   *
   * The update transaction categories service is used to update the transaction category name<br>for a high level category, a system-defined category and a user-defined category.<br>The renamed category can be set back to the original name by passing an empty string for categoryName.<br>The categoryName can accept minimum of 1, maximum of 50 alphanumeric or special characters.<br>The HTTP response code is 204 (Success without content).<br>
   */
  'updateTransactionCategory'(
    parameters?: Parameters | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<any>
  /**
   * createTransactionCategory - Create Category
   *
   * The create transaction categories service is used to create user-defined categories for a system-defined category.<br>The parentCategoryId is the system-defined category id.This can be retrieved using get transaction categories service.<br>The categoryName can accept minimum of 1, maximum of 50 alphanumeric or special characters.<br>The HTTP response code is 201 (Created successfully).<br>
   */
  'createTransactionCategory'(
    parameters?: Parameters | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<any>
  /**
   * getTransactionCategorizationRulesDeprecated - Get Transaction Categorization Rules
   *
   * The get transaction categorization rule service is used to get all the categorization rules.<br>
   */
  'getTransactionCategorizationRulesDeprecated'(
    parameters?: Parameters | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.GetTransactionCategorizationRulesDeprecated.Responses.$200>
  /**
   * createOrRunTransactionCategorizationRules - Create or Run Transaction Categorization Rule
   *
   * The Create or Run Transaction Categorization Rule endpoint is used to: <br>Create transaction categorization rules for both system and user-defined categories.<br>Run all the transaction categorization rules to categorize transactions by calling the endpoint with action=run as the query parameter. <br><br>The input body parameters to create transaction categorization rules follow:<br>     categoryId - This field is mandatory and numeric<br>     priority - This field is optional and numeric. Priority decides the order in which the rule gets applied on transactions.<br>     ruleClause - This field is mandatory and should contain at least one rule<br>     field - The value can be description or amount<br><br>       If the field value is description then,<br>         1. operation - value can be stringEquals or stringContains<br>         2. value - value should be min of 3 and max of 50 characters<br><br>       If the field value is amount then, <br>         1. operation - value can be numberEquals, numberLessThan, numberLessThanEquals, numberGreaterThan or numberGreaterThanEquals<br>         2. value - min value 0 and a max value of 99999999999.99 is allowed<br>The HTTP response code is 201 (Created Successfully).
   */
  'createOrRunTransactionCategorizationRules'(
    parameters?: Parameters<Paths.CreateOrRunTransactionCategorizationRules.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<any>
  /**
   * getConsents - Get Consents
   *
   * The get consent service is used to retrieve all the consents submitted to Yodlee. <br>The service can be used to build a manage consent interface or a consent dashboard to implement the renew and revoke consent flows.<br><b>Note:</b>This service supports the localization feature and accepts locale as a header parameter.<br>
   */
  'getConsents'(
    parameters?: Parameters<Paths.GetConsents.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.GetConsents.Responses.$200>
  /**
   * createConsent - Post Consent
   *
   * The generate consent service is used to generate all the consent information and permissions associated to a provider. <br/>The scope provided in the response is based on the providerId and the datasets provided in the input. <br/>If no dataset value is provided, the datasets that are configured for the customer will be considered. <br/>The configured dataset can be overridden by providing the dataset as an input. <br/>If no applicationName is provided in the input, the default applicationName will be considered. <b>Note:</b>This service supports the localization feature and accepts locale as a header parameter.<br>
   */
  'createConsent'(
    parameters?: Parameters | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.CreateConsent.Responses.$200>
  /**
   * getStatements - Get Statements
   *
   * The statements service is used to get the list of statement related information. <br>By default, all the latest statements of active and to be closed accounts are retrieved for the user. <br>Certain sites do not have both a statement date and a due date. When a fromDate is passed as an input, all the statements that have the due date on or after the passed date are retrieved. <br>For sites that do not have the due date, statements that have the statement date on or after the passed date are retrieved. <br>The default value of "isLatest" is true. To retrieve historical statements isLatest needs to be set to false.<br>
   */
  'getStatements'(
    parameters?: Parameters<Paths.GetStatements.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.GetStatements.Responses.$200>
  /**
   * getLatestBalances - Get Latest Balances
   *
   * The latest balances service provides the latest account balance by initiating a new balance refresh request
   */
  'getLatestBalances'(
    parameters?: Parameters<Paths.GetLatestBalances.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.GetLatestBalances.Responses.$200>
  /**
   * getHoldingTypeList - Get Holding Type List
   *
   * The get holding types list service is used to get the supported holding types.<br>The response includes different holding types such as future, moneyMarketFund, stock, etc. and it returns the supported holding types <br>
   */
  'getHoldingTypeList'(
    parameters?: Parameters | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.GetHoldingTypeList.Responses.$200>
  /**
   * updateTransaction - Update Transaction
   *
   * The update transaction service is used to update the category,consumer description, memo, isPhysical, merchantType, detailCategory for a transaction.<br>The HTTP response code is 204 (Success without content).<br>
   */
  'updateTransaction'(
    parameters?: Parameters<Paths.UpdateTransaction.PathParameters> | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<any>
  /**
   * userLogout - User Logout
   *
   * <b>Deprecated</b>: This endpoint is deprecated for API Key-based authentication. The user logout service allows the user to log out of the application.<br>The service does not return a response body. The HTTP response code is 204 (Success with no content).<br>
   */
  'userLogout'(
    parameters?: Parameters | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<any>
  /**
   * getDataExtractsEvents - Get Events
   *
   * The get extracts events service is used to learn about occurrences of data extract related events. This service currently supports only the DATA_UPDATES event.<br>Passing the event name as DATA_UPDATES provides information about users for whom data has been modified in the system for the specified time range. To learn more, please refer to the <a href="https://developer.yodlee.com/docs/api/1.1/DataExtracts">dataExtracts</a> page.<br>You can retrieve data in increments of no more than 60 minutes over the period of the last 7 days from today's date.<br>This service is only invoked with either admin access token or a cobrand session.<br>
   */
  'getDataExtractsEvents'(
    parameters?: Parameters<Paths.GetDataExtractsEvents.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.GetDataExtractsEvents.Responses.$200>
  /**
   * getHoldingSummary - Get Holding Summary
   *
   * The get holding summary service is used to get the summary of asset classifications for the user.<br>By default, accounts with status as ACTIVE and TO BE CLOSED will be considered.<br>If the include parameter value is passed as details then a summary with holdings and account information is returned.<br>
   */
  'getHoldingSummary'(
    parameters?: Parameters<Paths.GetHoldingSummary.QueryParameters> | null,
    data?: any,
    config?: AxiosRequestConfig,
  ): OperationResponse<Paths.GetHoldingSummary.Responses.$200>
}

export interface PathsDictionary {
  ['/enrichData/userData']: {
    /**
     * pushUserData - Push UserData
     *
     * <b>Push User Data </b><br>The data enrich API v1.1 allows customers to get the transactions enriched in real-time by feeding the data into the Yodlee Platform. To get the transactions enriched, it is necessary that users, accounts, and transactions are updated to the Yodlee Platform.<br>The following features are supported through the data enrich API:<ul><li>Add user</li><li>Add account</li><li>Update account</li><li>Add transactions</li><li>Update transactions</li></ul>Yodlee will enrich the transactions with the following information:<ul><li>Category</li><li>High Level Category</li><li>Detail Category</li><li>Simple description</li><li>Merchant details<ul><li>Name</li><li>Address</li></ul></li><li>Transaction type</li><li>Transaction subtype</li></ul>The data feed through the enrich APIs will be updated to the Yodlee Platform in real time. The updated accounts and transactions information can then be retrieved from the system using the respective Yodlee 1.1 APIs.<br><b> Implementation Notes </b><ul><li>Supported only through credential-based authentication mechanisms.</li><li>Customer must be TLS 1.2 compliant to integrate with the data enrich API.</li><li>Supported account types are savings, checking, and credit.</li><li>A maximum of 128 transactions can be passed to the API.</li><li>As the data enrich API is a premium offering and is priced per API call, Yodlee recommends not to call the API to update accounts and transactions.</li><li>The minimum required parameters to create account and transaction is accepted. The Yodlee data model supports more parameters than what is accepted in this API. Customers can make the rest of the parameters available during the auto-refresh process of the accounts.</li><li>Though few input parameters are optional, Yodlee recommends passing them as the account information will make complete sense to the consumers when it is displayed in the Yodlee applications or widgets.</li></ul>
     */
    'post'(
      parameters?: Parameters | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.PushUserData.Responses.$200>
  }
  ['/transactions']: {
    /**
     * getTransactions - Get Transactions
     *
     * The Transaction service is used to get a list of transactions for a user.<br>By default, this service returns the last 30 days of transactions from today's date.<br>The keyword parameter performs a contains search on the original, consumer, and simple description attributes, replace the special characters #, &, and + with percent-encoding values %23, %26, and %2B respectively. Eg: for -Debit# , pass the input as -Debit%23.<br>Values for categoryId parameter can be fetched from get transaction category list service.<br> The categoryId is used to filter transactions based on system-defined category as well as user-defined category.<br>User-defined categoryIds should be provided in the filter with the prefix ''U''. E.g. U10002<br>The skip and top parameters are used for pagination. In the skip and top parameters pass the number of records to be skipped and retrieved, respectively. The response header provides the links to retrieve the next and previous set of transactions.<br>Double quotes in the merchant name will be prefixed by backslashes (&#92;) in the response, e.g. Toys "R" Us. <br>sourceId is a unique ID that the provider site has assigned to the transaction. The source ID is only available for the pre-populated accounts. Pre-populated accounts are the accounts that the FI customers shares with Yodlee, so that the user does not have to add or aggregate those accounts.<br><br><b>Note</b><ul><li><a href="https://developer.yodlee.com/docs/api/1.1/Transaction_Data_Enrichment">TDE</a> is made available for bank and card accounts. The address field in the response is available only when the TDE key is turned on.</li><li>The pagination feature is available by default. If no values are passed in the skip and top parameters, the API will only return the first 500 transactions.</li><li>This service supports the localization feature and accepts locale as a header parameter.</li></ul>
     */
    'get'(
      parameters?: Parameters<Paths.GetTransactions.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.GetTransactions.Responses.$200>
  }
  ['/accounts/associatedAccounts/{providerAccountId}']: {
    /**
     * getAssociatedAccounts - Associated Accounts
     *
     * Yodlee classifies providers into credential-based aggregation and Open Banking (OB) providers.<br>This service is associated with the OB aggregation flow. As part of the OB solution, financial institutions may merge their subsidiaries and provide data as a single OB provider.<br>Before the OB solution, this data was aggregated with different provider IDs.<br>This service accepts the providerAccountId and returns all accounts of the associated providerAccounts that belong to the subsidiary of the financial institution.<br>This data should be displayed to the user to let them select the accounts that they wish to provide consent to share account data.<br>
     */
    'get'(
      parameters?: Parameters<Paths.GetAssociatedAccounts.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.GetAssociatedAccounts.Responses.$200>
  }
  ['/verification/verifiedAccounts']: {
    /**
     * getVerifiedAccounts - Get Verified Accounts
     *
     * The Verified Accounts API v1.1 provides information about the bank and investment accounts that the user  has selected for verification, during the Account Verification flow on FastLink 4. By default, the API only returns information of the accounts that were selected and have been successfully verified. <br><br>
     */
    'get'(
      parameters?: Parameters<Paths.GetVerifiedAccounts.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.GetVerifiedAccounts.Responses.$200>
  }
  ['/cobrand/login']: {
    /**
     * cobrandLogin - Cobrand Login
     *
     * The cobrand login service authenticates a cobrand.<br>Cobrand session in the response includes the cobrand session token (cobSession) <br>which is used in subsequent API calls like registering or signing in the user. <br>The idle timeout for a cobrand session is 2 hours and the absolute timeout is 24 hours. This service can be <br>invoked to create a new cobrand session token. <br><b>Note:</b> This endpoint is deprecated for customers using the API Key-based authentication and is applicable only to customers who use the SAML-based authentication.<br>The content type has to be passed as application/json for the body parameter. <br>
     */
    'post'(
      parameters?: Parameters | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.CobrandLogin.Responses.$200>
  }
  ['/dataExtracts/userData']: {
    /**
     * getDataExtractsUserData - Get userData
     *
     * The get user data service is used to get a user's modified data for a particular period of time for accounts, transactions, holdings, and provider account information.<br>The time difference between fromDate and toDate fields cannot be more than 60 minutes.<br>By default, pagination is available for the transaction entity in this API. In the first response, the API will retrieve 500 transactions along with other data. The response header will provide a link to retrieve the next set of transactions.<br>In the response body of the first API response, totalTransactionsCount indicates the total number of transactions the API will retrieve for the user.<br>This service is only invoked with either admin access token or a cobrand session.<br/>Refer to <a href="https://developer.yodlee.com/docs/api/1.1/DataExtracts">dataExtracts</a> page for more information.<br><br><b>Note:</b><li>This service supports the localization feature and accepts locale as a header parameter.</li>
     */
    'get'(
      parameters?: Parameters<Paths.GetDataExtractsUserData.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.GetDataExtractsUserData.Responses.$200>
  }
  ['/providers']: {
    /**
     * getAllProviders - Get Providers
     *
     * The get provider service is used to get all the providers that are enabled, search a provider service by name or routing number and get popular sites of a region. <br>Searching for a provider using a routing number is applicable only to the USA and Canada regions.<br>The valid values for priority are: <br>   1. cobrand: Returns providers enabled for the cobrand (Default priority)<br>   2. popular: Returns providers popular among users of the customer<br><br>Only the datasets, attributes, and containers that are enabled for the customer will be returned in the response.<br>Input for the dataset$filter should adhere to the following expression:<br><dataset.name>[<attribute.name>.container[<container> OR <container>] OR <attribute.name>.container[<container>]] <br>OR <dataset.name>[<attribute.name> OR <attribute.name>]<br><b>dataset$filter value examples:</b><br>ACCT_PROFILE[FULL_ACCT_NUMBER.container[bank OR investment OR creditCard]]<br>ACCT_PROFILE[FULL_ACCT_NUMBER.container[bank]]<br>BASIC_AGG_DATA[ACCOUNT_DETAILS.container[bank OR investment] OR HOLDINGS.container[bank]] OR ACCT_PROFILE[FULL_ACCT_NUMBER.container[bank]]<br>BASIC_AGG_DATA<br>BASIC_AGG_DATA OR ACCT_PROFILE<br>BASIC_AGG_DATA [ ACCOUNT_DETAILS OR HOLDINGS ]<br>BASIC_AGG_DATA [ ACCOUNT_DETAILS] OR DOCUMENT <br>BASIC_AGG_DATA [ BASIC_ACCOUNT_INFO OR ACCOUNT_DETAILS ] <br><br>The fullAcountNumberFields is specified to filter the providers that have paymentAccountNumber or unmaskedAccountNumber support in the FULL_ACCT_NUMBER dataset attribute.<br><b>Examples for usage of fullAccountNumberFields </b><br>dataset$filter=ACCT_PROFILE[ FULL_ACCT_NUMBER.container [ bank ]] &amp; fullAccountNumberFields=paymentAccountNumber<br>dataset$filter=ACCT_PROFILE[ FULL_ACCT_NUMBER.container [ bank ]] &amp; fullAccountNumberFields=unmaskedAccountNumber<br>dataset$filter=ACCT_PROFILE[ FULL_ACCT_NUMBER.container [ bank ]] &amp; fullAccountNumberFields=unmaskedAccountNumber,paymentAccountNumber<br><br>The skip and top parameters are used for pagination. In the skip and top parameters, pass the number of records to be skipped and retrieved, respectively.<br>The response header provides the links to retrieve the next and previous set of transactions.<br><br><b>Note:</b> <ol><li>In a product flow involving user interaction, Yodlee recommends invoking this service with filters.<li>Without filters, the service may perform slowly as it takes a few minutes to return data in the response.<li>The AuthParameter appears in the response only in case of token-based aggregation sites.<li>The pagination feature only applies when the priority parameter is set as cobrand. If no values are provided in the skip and top parameters, the API will only return the first 500 records.<li>This service supports the localization feature and accepts locale as a header parameter.<li>The capability has been deprecated in query parameter and response.</li></ol>
     */
    'get'(
      parameters?: Parameters<Paths.GetAllProviders.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.GetAllProviders.Responses.$200>
  }
  ['/providers/{providerId}']: {
    /**
     * getProvider - Get Provider Details
     *
     * The get provider detail service is used to get detailed information including the login form for a provider.<br>The response is a provider object that includes information such as name of the provider, <br>provider's base URL, a list of containers supported by the provider, the login form details of the provider, etc.<br>Only enabled datasets, attributes and containers gets returned in the response.<br><br><b>Note:</b><li>This service supports the localization feature and accepts locale as a header parameter.<li>The capability has been deprecated in the response.
     */
    'get'(
      parameters?: Parameters<Paths.GetProvider.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.GetProvider.Responses.$200>
  }
  ['/cobrand/config/notifications/events/{eventName}']: {
    /**
     * createSubscriptionEvent - Subscribe Event
     *
     * <b>Refer POST /configs/notifications/events/{eventName}.</b><br>The subscribe events service is used to subscribe to an event for receiving notifications.<br>The callback URL, where the notification will be posted should be provided to this service.<br>If the callback URL is invalid or inaccessible, the subscription will be unsuccessful, and an error will be thrown.<br>Customers can subscribe to REFRESH,DATA_UPDATES and AUTO_REFRESH_UPDATES event.<br><br><b>Notes</b>:<br>This service is not available in developer sandbox/test environment and will be made available for testing in your dedicated environment, once the contract is signed.<br>The content type has to be passed as application/json for the body parameter.<br>
     */
    'post'(
      parameters?: Parameters<Paths.CreateSubscriptionEvent.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<any>
    /**
     * deleteSubscribedEvent - Delete Subscription
     *
     * <b>Refer DELETE /configs/notifications/events/{eventName}.</b><br>The delete events service is used to unsubscribe from an events service.<br>
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteSubscribedEvent.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<any>
    /**
     * updateSubscribedEvent - Update Subscription
     *
     * <b>Refer PUT /configs/notifications/events/{eventName}.</b><br>The update events service is used to update the callback URL.<br>If the callback URL is invalid or inaccessible, the subscription will be unsuccessful, and an error will be thrown.<br><b>Note:</b> The content type has to be passed as application/json for the body parameter. <br>
     */
    'put'(
      parameters?: Parameters<Paths.UpdateSubscribedEvent.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<any>
  }
  ['/configs/notifications/events']: {
    /**
     * getSubscribedNotificationEvents - Get Subscribed Notification Events
     *
     * The get events service provides the list of events for which consumers subscribed to receive notifications. <br>
     */
    'get'(
      parameters?: Parameters<Paths.GetSubscribedNotificationEvents.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.GetSubscribedNotificationEvents.Responses.$200>
  }
  ['/providers/count']: {
    /**
     * getProvidersCount - Get Providers Count
     *
     * The count service provides the total number of providers that get returned in the GET /providers depending on the input parameters passed.<br>If you are implementing pagination for providers, call this endpoint before calling GET /providers to know the number of providers that are returned for the input parameters passed.<br>The functionality of the input parameters remains the same as that of the GET /providers endpoint<br><br><b>Note:</b> <li>The capability has been deprecated in the query parameter.</li>
     */
    'get'(
      parameters?: Parameters<Paths.GetProvidersCount.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.GetProvidersCount.Responses.$200>
  }
  ['/derived/networth']: {
    /**
     * getNetworth - Get Networth Summary
     *
     * The get networth service is used to get the networth for the user.<br>If the include parameter value is passed as details then networth with historical balances is returned. <br>
     */
    'get'(
      parameters?: Parameters<Paths.GetNetworth.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.GetNetworth.Responses.$200>
  }
  ['/user/samlLogin']: {
    /**
     * samlLogin - Saml Login
     *
     * The SAML login service is used to authenticate system users with a SAML response.<br>A new user will be created with the input provided if that user isn't already in the system.<br>For existing users, the system will make updates based on changes or new information.<br>When authentication is successful, a user session token is returned.<br><br><b>Note:</b> <li>The content type has to be passed as application/x-www-form-urlencoded. <li>issuer, source and samlResponse should be passed as body parameters.</li>
     */
    'post'(
      parameters?: Parameters<Paths.SamlLogin.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.SamlLogin.Responses.$200>
  }
  ['/verification/holderProfile']: {
    /**
     * getHolderProfile - Get Holder Profile
     *
     * The Holder Profile API service allows retrieving the user's profile details (i.e., PII data such as name, email, phone number, and address) that are available at the provider account and each account level. The API accepts the providerAccountId and retrieves the profile information available under it and all the details available under each of the associated accounts.  <br><br>This service can only be invoked by Yodlee API v1.1, FastLink 3, and FastLink 4 customers. <br><br>
     */
    'get'(
      parameters?: Parameters<Paths.GetHolderProfile.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.GetHolderProfile.Responses.$200>
  }
  ['/documents/{documentId}']: {
    /**
     * downloadDocument - Download a Document
     *
     * The get document details service allows consumers to download a document. The document is provided in base64.<br>This API is a premium service which requires subscription in advance to use.  Please contact Yodlee Client Services for more information. <br>
     */
    'get'(
      parameters?: Parameters<Paths.DownloadDocument.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.DownloadDocument.Responses.$200>
    /**
     * deleteDocument - Delete Document
     *
     * The delete document service allows the consumer to delete a document. The deleted document will not be returned in the get documents API. The HTTP response code is 204 (success without content).<br>Documents can be deleted only if the document related dataset attributes are subscribed.<br>
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteDocument.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<any>
  }
  ['/transactions/categories/rules/{ruleId}']: {
    /**
     * runTransactionCategorizationRule - Run Transaction Categorization Rule
     *
     * The run transaction categorization rule service is used to run a rule on transactions, to categorize the transactions.<br>The HTTP response code is 204 (Success with no content).<br>
     */
    'post'(
      parameters?: Parameters<
        Paths.RunTransactionCategorizationRule.PathParameters &
          Paths.RunTransactionCategorizationRule.QueryParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<any>
    /**
     * deleteTransactionCategorizationRule - Delete Transaction Categorization Rule
     *
     * The delete transaction categorization rule service is used to delete the given user-defined transaction categorization rule for both system-defined category as well as user-defined category.<br>This will delete all the corresponding rule clauses associated with the rule.<br>The HTTP response code is 204 (Success without content).<br>
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteTransactionCategorizationRule.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<any>
    /**
     * updateTransactionCategorizationRule - Update Transaction Categorization Rule
     *
     * The update transaction categorization rule service is used to update a categorization rule for both system-defined category as well as user-defined category.<br>ruleParam JSON input should be as explained in the create transaction categorization rule service.<br>The HTTP response code is 204 (Success without content).<br>
     */
    'put'(
      parameters?: Parameters<Paths.UpdateTransactionCategorizationRule.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<any>
  }
  ['/user/accessTokens']: {
    /**
     * getAccessTokens - Get Access Tokens
     *
     * The Get Access Tokens service is used to retrieve the access tokens for the application id(s) provided.<br>URL in the response can be used to launch the application for which token is requested.<br><br><b>Note:</b> <li>This endpoint is deprecated for customers using the API Key-based authentication and is applicable only to customers who use the SAML-based authentication.<br>
     */
    'get'(
      parameters?: Parameters<Paths.GetAccessTokens.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.GetAccessTokens.Responses.$200>
  }
  ['/cobrand/logout']: {
    /**
     * cobrandLogout - Cobrand Logout
     *
     * The cobrand logout service is used to log out the cobrand.<br>This service does not return a response. The HTTP response code is 204 (Success with no content).<br><b>Note:</b> This endpoint is deprecated for customers using the API Key-based authentication and is applicable only to customers who use the SAML-based authentication.<br>
     */
    'post'(
      parameters?: Parameters | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<any>
  }
  ['/consents/{consentId}']: {
    /**
     * getConsentDetails - Get Authorization Details
     *
     * The get authorization URL for consent service provides the authorization URL for the renew consent flow, within the consent dashboard.<b>Note:</b>This service supports the localization feature and accepts locale as a header parameter.<br>
     */
    'get'(
      parameters?: Parameters<Paths.GetConsentDetails.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.GetConsentDetails.Responses.$200>
    /**
     * updateConsent - Put Consent
     *
     * The update consent service is used to capture the user acceptance of the consent presented to him or her. <br/>This service returns the authorization-redirect URL that should be used to display to the user, the bank's authentication interface.<b>Note:</b>This service supports the localization feature and accepts locale as a header parameter.<br>
     */
    'put'(
      parameters?: Parameters<Paths.UpdateConsent.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.UpdateConsent.Responses.$200>
  }
  ['/providerAccounts/{providerAccountId}/preferences']: {
    /**
     * updatePreferences - Update Preferences
     *
     * This endpoint is used to update preferences like data extracts and auto refreshes without triggering refresh for the providerAccount.<br>Setting isDataExtractsEnabled to false will not trigger data extracts notification and dataExtracts/events will not reflect any data change that is happening for the providerAccount.<br>Modified data will not be provided in the dataExtracts/userData endpoint.<br>Setting isAutoRefreshEnabled to false will not trigger auto refreshes for the provider account.<br>
     */
    'put'(
      parameters?: Parameters<Paths.UpdatePreferences.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<any>
  }
  ['/auth/token']: {
    /**
     * generateAccessToken - Generate Access Token
     *
     * <b>Generate Access Token using client credential authentication.</b><br>This service returns access tokens required to access Yodlee 1.1 APIs. These tokens are the simplest and easiest of several alternatives for authenticating with Yodlee servers.<br>The most commonly used services obtain data specific to an end user (your customer). For these services, you need a <b>user access token</b>. These are simply tokens created with the user name parameter (<b>loginName</b>) set to the id of your end user.  <i><br><br><b>Note:</b> You determine this id and you must ensure it's unique among all your customers.</i> <br><br>Each token issued has an associated user. The token passed in the http headers explicitly names the user referenced in that API call.<br><br>Some of the APIs do administrative work, and don't reference an end user. <br/>One example of administrative work is key management. Another example is registering a new user explicitly, with <b>POST /user/register</b> call or subscribe to webhook, with <b>POST /config/notifications/events/{eventName}</b>. <br/>To invoke these, you need an <b>admin access token</b>. Create this by passing in your admin user login name in place of a regular user name.<br><br>This service also allows for simplified registration of new users. Any time you pass in a user name not already in use, the system will automatically implicitly create a new user for you. <br>This user will naturally have very few associated details. You can later provide additional user information by calling the <b>PUT user/register service</b>.<br><br><b>Notes:</b><ul><li>The header <code>Authorization</code> does not apply to this service.</li><li>The content type has to be passed as application/x-www-form-urlencoded.<li>Upgrading to client credential authentication requires infrastructure reconfiguration. <li>Customers wishing to switch from another authentication scheme to client credential authentication, please contact Yodlee Client Services.</li><li>Default expiry time of user access token and admin access token is 30 minutes.</li></ul>
     */
    'post'(
      parameters?: Parameters | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.GenerateAccessToken.Responses.$201>
    /**
     * deleteToken - Delete Token
     *
     * This endpoint revokes the token passed in the Authorization header. This service is applicable for JWT-based (and all API key-based) authentication and also client credential (clientId and secret) based authentication. This service does not return a response body. The HTTP response code is 204 (success with no content). <br>Tokens generally have limited lifetime of up to 30 minutes. You will call this service when you finish working with one user, and you want to delete the valid token rather than simply letting it expire.<br><br><b>Note:</b> <li>Revoking an access token (either type, admin or a user token) can take up to 2 minutes, as the tokens are stored on a distributed system.<br/>
     */
    'delete'(
      parameters?: Parameters | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<any>
  }
  ['/providerAccounts/{providerAccountId}']: {
    /**
     * getProviderAccount - Get Provider Account Details
     *
     * The get provider account details service is used to learn the status of adding accounts and updating accounts.<br>This service has to be called continuously to know the progress level of the triggered process. This service also provides the MFA information requested by the provider site.<br>When <i>include = credentials</i>, questions is passed as input, the service returns the credentials (non-password values) and questions stored in the Yodlee system for that provider account. <br><br><b>Note:</b> <li>The password and answer fields are not returned in the response.</li>
     */
    'get'(
      parameters?: Parameters<
        Paths.GetProviderAccount.PathParameters &
          Paths.GetProviderAccount.QueryParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.GetProviderAccount.Responses.$200>
    /**
     * deleteProviderAccount - Delete Provider Account
     *
     * The delete provider account service is used to delete a provider account from the Yodlee system. This service also deletes the accounts that are created in the Yodlee system for that provider account. <br>This service does not return a response. The HTTP response code is 204 (Success with no content).<br>
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteProviderAccount.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<any>
  }
  ['/user']: {
    /**
     * getUser - Get User Details
     *
     * The get user details service is used to get the user profile information and the application preferences set at the time of user registration.<br>
     */
    'get'(
      parameters?: Parameters | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.GetUser.Responses.$200>
    /**
     * updateUser - Update User Details
     *
     * The update user details service is used to update user details like name, address, currency preference, etc.<br>Currency provided in the input will be respected in the <a href="https://developer.yodlee.com/api-reference#tag/Derived">derived</a> services and the amount fields in the response will be provided in the preferred currency.<br>The HTTP response code is 204 (Success without content). <br>
     */
    'put'(
      parameters?: Parameters | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<any>
  }
  ['/accounts']: {
    /**
     * createManualAccount - Add Manual Account
     *
     * The add account service is used to add manual accounts.<br>The response of add account service includes the account name , account number and Yodlee generated account id.<br>All manual accounts added will be included as part of networth calculation by default.<br>Add manual account support is available for bank, card, investment, insurance and loan container only.<br><br><b>Note:</b><ul> <li>A real estate account addition is only supported for SYSTEM and MANUAL valuation type.</li></ul>
     */
    'post'(
      parameters?: Parameters | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.CreateManualAccount.Responses.$200>
    /**
     * getAllAccounts - Get Accounts
     *
     * The get accounts service provides information about accounts added by the user.<br>By default, this service returns information for active and to be closed accounts.<br>If requestId is provided, the accounts that are updated in the context of the requestId will be provided in the response.<br><br><b>Note:</b><br><ul><li>fullAccountNumber is deprecated and is replaced with fullAccountNumberList in include parameter and response.</li><li>fullAccountNumberList, PII (Personal Identifiable Information) and holder details are not available by default, as it is a premium feature that needs security approval. This will not be available for testing in Sandbox environment.</li></ul>
     */
    'get'(
      parameters?: Parameters<Paths.GetAllAccounts.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.GetAllAccounts.Responses.$200>
  }
  ['/user/unregister']: {
    /**
     * unregister - Delete User
     *
     * The delete user service is used to delete or unregister a user from Yodlee. <br>Once deleted, the information related to the users cannot be retrieved. <br>The HTTP response code is 204 (Success without content)<br>
     */
    'delete'(
      parameters?: Parameters | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<any>
  }
  ['/holdings/assetClassificationList']: {
    /**
     * getAssetClassificationList - Get Asset Classification List
     *
     * The get asset classifications list service is used to get the supported asset classifications. <br>The response includes different classification types like assetClass, country, sector, style, etc. and the values corresponding to each type.<br>
     */
    'get'(
      parameters?: Parameters | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.GetAssetClassificationList.Responses.$200>
  }
  ['/verifyAccount/{providerAccountId}']: {
    /**
     * initiateAccountVerification - Verify Accounts Using Transactions
     *
     * The verify account service is used to verify the account's ownership by  matching the transaction details with the accounts aggregated for the user.<br><ul><li>If a match is identified, the service returns details of all the accounts along with the matched transaction's details.<li>If no transaction match is found, an empty response will be returned.<li>A maximum of 5 transactionCriteria can be passed in a request.<li>The baseType, date, and amount parameters should mandatorily be passed.<li>The optional dateVariance parameter cannot be more than 7 days. For example, +7, -4, or +/-2.<li>Pass the container or accountId parameters for better performance.<li>This service supports the localization feature and accepts locale as a header parameter.</li></ul>
     */
    'post'(
      parameters?: Parameters<Paths.InitiateAccountVerification.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.InitiateAccountVerification.Responses.$200>
  }
  ['/configs/publicKey']: {
    /**
     * getPublicEncryptionKey - Get Public Key
     *
     * The get public key service provides the public key that should be used to encrypt user credentials while invoking POST /providerAccounts and PUT /providerAccounts endpoints.<br>This service will only work if the PKI (public key infrastructure) feature is enabled for the customer.<br><br><b>Note:</b><li> The key in the response is a string in PEM format.</li><li>This endpoint is not available in the Sandbox environment and it is useful only if the PKI feature is enabled.</li>
     */
    'get'(
      parameters?: Parameters | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.GetPublicEncryptionKey.Responses.$200>
  }
  ['/auth/apiKey/{key}']: {
    /**
     * deleteApiKey - Delete API Key
     *
     * This endpoint allows an existing API key to be deleted.<br>You can use one of the following authorization methods to access this API:<br><ol><li>cobsession</li><li>JWT token</li></ol> <b>Notes:</b> <li>This service is not available in developer sandbox environment and will be made availablefor testing in your dedicated environment.
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteApiKey.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<any>
  }
  ['/providerAccounts']: {
    /**
     * linkProviderAccount - Add Account
     *
     * The add account service is used to link the user's account with the provider site in the Yodlee system. Providers that require multifactor authentication or open banking are also supported by this service. The response includes the Yodlee generated ID (providerAccountId) of the account along with the refresh information.<br><br>Open Banking Implementation Notes: <br>To link the user's account of the Open Banking provider site in the Yodlee system, pass the field entity that contains:<br>1. id - From the authParameters provided in the get provider details service<br>2. value - From the redirect URL of the Open Banking site<br><br>Credential-based Implementation Notes: <br>1. The loginForm or the field array are the objects under the provider object, obtained from the <a href="https://developer.yodlee.com/apidocs/index.php#!/providers/getSiteDetail">get provider details</a> service response.<br>2. The credentials provided by the user should be embedded in the loginForm or field array object.<br>3. While testing the <a href="https://developer.yodlee.com/KnowledgeBase/How_to_use_PKI">PKI feature</a>, encrypt the credentials using the <a href="https://developer.yodlee.com/apidocs/utility/encrypt.html">encryption utility</a>.<br>4. The data to be retrieved from the provider site can be passed using datasetName or dataset. If datasetName is passed, all the attributes that are implicitly configured for the dataset will be retrieved.<br>5. If the customer has not subscribed to the REFRESH event webhooks notification for accounts that require multifactor authentication (MFA), the get providerAccount service has to be called continuously till the login form (supported types are token, question & answer, and captcha) is returned in the response.<br>6. The <a href="https://developer.yodlee.com/apidocs/index.php#!/providerAccounts/updateAccount">update account</a> service should be called to post the MFA information to continue adding the account.<br><br>Generic Implementation Notes:<br>1. Refer to the <a href="https://developer.yodlee.com/Yodlee_API/docs/v1_1/API_Flow">add account</a> flow chart for implementation.<br>2. The get provider account details has <a href="https://developer.yodlee.com/Yodlee_API/docs/v1_1/Webhooks">webhooks support</a>. If the customer has subscribed to the REFRESH event notification and has invoked this service to add an account, relevant notifications will be sent to the callback URL.<br>3. If you had not subscribed for notifications, the <a href="https://developer.yodlee.com/apidocs/index.php#!/providerAccounts/getRefreshForProviderAccount">get provider account </a> details service has to be polled continuously till the account addition status is FAILED or PARTIAL_SUCCESS or SUCCESS. <br>4. A dataset may depend on another dataset for retrieval, so the response will include the requested datasets and the dependent datasets.<br>   It is necessary to check all the dataset additional statuses returned in the response, as the provider account status is drawn from the dataset additional statuses.<br>5. Pass linkedProviderAccountId in the input to link a user's credential-based providerAccount with the open banking providerAccount. Ensure that the credential-based providerAccount belongs to the same institution. <br>6. The content type has to be passed as application/json in the body parameter.
     */
    'post'(
      parameters?: Parameters<Paths.LinkProviderAccount.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.LinkProviderAccount.Responses.$200>
    /**
     * getAllProviderAccounts - Get Provider Accounts
     *
     * The get provider accounts service is used to return all the provider accounts added by the user. <br>This includes the failed and successfully added provider accounts.<br>
     */
    'get'(
      parameters?: Parameters<Paths.GetAllProviderAccounts.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.GetAllProviderAccounts.Responses.$200>
    /**
     * editCredentialsOrRefreshProviderAccount - Update Account
     *
     * <b>Credential-based Implementation Notes:</b> <br>The update account API is used to:  &bull; Retrieve the latest information for accounts that belong to one providerAccount from the provider site. You must allow at least 15 min between requests. <br> &bull; Update account credentials when the user has changed the authentication information at the provider site. <br> &bull; Post MFA information for the MFA-enabled provider accounts during add and update accounts. <br> &bull; Retrieve the latest information of all the eligible accounts that belong to the user. <br><br><b>Edit Credentials - Notes: </b> <br> &bull; If credentials have to be updated in the Yodlee system, one of the following should be provided: <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#9702; LoginForm <br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&#9702; Field array <br> &bull; LoginForm or the field array, can be obtained from the GET providerAccounts/{providerAccountId}?include=credentials API response. <br> &bull; The credentials provided by the user should be embedded in the loginForm or field array object before you pass to this API. <br><b>Posting MFA Info - Notes: </b> <br>1. You might receive the MFA request details to be presented to the end user in the GET providerAccounts/{providerAccount} API during polling or through REFRESH webhooks notificaiton. <br>2. After receiving the inputs from your user: <br>&nbsp;&nbsp;&nbsp;&nbsp;a.Embed the MFA information provided by the user in the loginForm or field array object.<br>&nbsp;&nbsp;&nbsp;&nbsp;b.Pass one of the following objects as input to this API:<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&bull; LoginForm<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&bull; Field array<br/><br><b>Points to consider:</b><br>&bull; Data to be retrieved from the provider site can be overridden using datasetName or dataset. If you do pass datasetName, all the datasets that are implicitly configured for <br>the dataset will be retrieved. This action is allowed for edit credentials and single provider account refresh flows only. <br>&bull; Encrypt the credentials and MFA information using the public key.<br>&bull; While testing the PKI feature in sandbox environment, encrypt the password credentials and answers to the MFA questions using the encryption tool.<br/><br><b>--------------------------------------------------------------------------------------------------------------------------------</b><br><b>Open Banking (OB)-based Authentication - Notes:</b><br>The update account API is used to:<br>&bull; Retrieve the latest information for accounts from the provider site.<br>&bull; Update the renewed consent for an existing provider account.<br>&bull; Retrieve the latest information for all the eligible accounts that belong to the user.<br/><br>Yodlee recommendations: <br/>&bull; Create the field entity with the authParameters provided in the get provider details API.<br>&bull; Populate the field entity with the values received from the OB site and pass it to this API.<br/><br><b>--------------------------------------------------------------------------------------------------------------------------------</b><br><b>Update All Eligible Accounts - Notes: </b><br>&bull; This API will trigger a refresh for all the eligible provider accounts(both OB and credential-based accounts).<br>&bull; This API will not refresh closed, inactive, or UAR accounts, or accounts with refreshes in-progress or recently refreshed non-OB accounts.<br>&bull; No parameters should be passed to this API to trigger this action.<br>&bull; Do not call this API often. Our recommendation is to call this only at the time the user logs in to your app because it can hamper other API calls performance. <br>&bull; The response only contains information for accounts that were refreshed. If no accounts are eligible for refresh, no response is returned.<br/><br><b>--------------------------------------------------------------------------------------------------------------------------------</b><br><b>What follows are common to both OB and credential-based authentication implementations:  </b><br>&bull; Check the status of the providerAccount before invoking this API. Do not call this API to trigger any action on a providerAccount when an action is already in progress for the providerAccount. <br>&bull; If the customer has subscribed to the REFRESH event notification and invoked this API, relevant notifications will be sent to the customer.<br>&bull; A dataset may depend on another dataset for retrieval, so the response will include the requested and dependent datasets.<br>&bull; Check all the dataset additional statuses returned in the response because the provider account status is drawn from the dataset additional statuses.<br>&bull; Updating preferences using this API will trigger refreshes.<br>&bull; Pass linkedProviderAccountId in the input to link a user's credential-based providerAccount with the OB providerAccount or viceversa. Ensure that the both the providerAccounts belong to the same institution. <br>&bull; The content type has to be passed as application/json for the body parameter.<br>
     */
    'put'(
      parameters?: Parameters<Paths.EditCredentialsOrRefreshProviderAccount.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.EditCredentialsOrRefreshProviderAccount.Responses.$200>
  }
  ['/derived/transactionSummary']: {
    /**
     * getTransactionSummary - Get Transaction Summary
     *
     * The transaction summary service provides the summary values of transactions for the given date range by category type, high-level categories, or system-defined categories.<br><br>Yodlee has the transaction data stored for a day, month, year and week per category as per the availability of user's data. If the include parameter value is passed as details, then summary details will be returned depending on the interval passed-monthly is the default.<br><br><b>Notes:</b><ol> <li> Details can be requested for only one system-defined category<li>Passing categoryType is mandatory except when the groupBy value is CATEGORY_TYPE<li>Dates will not be respected for monthly, yearly, and weekly details<li>When monthly details are requested, only the fromDate and toDate month will be respected<li>When yearly details are requested, only the fromDate and toDate year will be respected<li>For weekly data points, details will be provided for every Sunday date available within the fromDate and toDate<li>This service supports the localization feature and accepts locale as a header parameter</li></ol>
     */
    'get'(
      parameters?: Parameters<Paths.GetTransactionSummary.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.GetTransactionSummary.Responses.$200>
  }
  ['/transactions/count']: {
    /**
     * getTransactionsCount - Get Transactions Count
     *
     * The count service provides the total number of transactions for a specific user depending on the input parameters passed.<br>If you are implementing pagination for transactions, call this endpoint before calling GET /transactions to know the number of transactions that are returned for the input parameters passed.<br>The functionality of the input parameters remains the same as that of the GET /transactions endpoint.<br>
     */
    'get'(
      parameters?: Parameters<Paths.GetTransactionsCount.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.GetTransactionsCount.Responses.$200>
  }
  ['/consents/{consentId}/renewal']: {
    /**
     * renewConsent - Renew Consent
     *
     * The consent renewal service is used to renew the consent by validating the consent state. This API supports both UK and AU Open Banking. </br><b>Renewing an UK Open Banking consent:</b><br><li>Before the grace period of 90 days: The consent will be renewed using the third-party provider (TPP) renewal process that Yodlee does, and no consent reauthorisation is required.The API response will contain the complete renewed consent object.</li><li>After the grace period of 90 days: The API will provide an authorisation URL to redirect the user to the financial institution site to complete the consent reauthorization process.<br><b>Renewing an AU Open Banking consent:</b><br><li>Invoke this API, and in the API response, an authorisation URL will be provided to redirect the user to the financial institution site to complete the consent reauthorisation process.</li><br>
     */
    'put'(
      parameters?: Parameters<Paths.RenewConsent.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.RenewConsent.Responses.$200>
  }
  ['/accounts/migrateAccounts/{providerAccountId}']: {
    /**
     * migrateAccounts - Migrate Accounts
     *
     * This service is associated with the open banking (OB) flow.<br>Before invoking this service, display all the associated accounts to the user by calling the GET /associatedAccounts API.<br>The migrate accounts API treats the user's consent acceptance to initiate account migration. Invoking this service indicates that the user has given the consent to access the associated account information from the financial institution.<br>If an existing provider supports bank, card, and loan accounts, and chose only to provide bank and card through OB APIs, a new providerAccountId for OB will be created.<br>The bank and card account information will be moved to the new providerAccountId. The loan account will be retained in the existing provider account.<br>This service returns the OB providerId and the OB providerAccountId. Note that, as part of this process, there is a possibility of one or more providerAccounts getting merged.<br>The update or delete actions will not be allowed for the providerAccounts involved in the migration process until the user completes the authorization on the OB provider.<br>The oauthMigrationEligibilityStatus attribute in the GET /accounts API response indicates the accounts included in the migration process.<br>
     */
    'put'(
      parameters?: Parameters<Paths.MigrateAccounts.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.MigrateAccounts.Responses.$200>
  }
  ['/transactions/categories/txnRules']: {
    /**
     * getTransactionCategorizationRules - Get Transaction Categorization Rules
     *
     * The get transaction categorization rule service is used to get all the categorization rules.<br>
     */
    'get'(
      parameters?: Parameters | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.GetTransactionCategorizationRules.Responses.$200>
  }
  ['/transactions/categories/{categoryId}']: {
    /**
     * deleteTransactionCategory - Delete Category
     *
     * The delete transaction categories service is used to delete the given user-defined category.<br>The HTTP response code is 204 (Success without content).<br>
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteTransactionCategory.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<any>
  }
  ['/documents']: {
    /**
     * getDocuments - Get Documents
     *
     * The get documents service allows customers to search or retrieve metadata related to documents. <br>The API returns the document as per the input parameters passed. If no date range is provided then all downloaded documents will be retrieved. Details of deleted documents or documents associated to closed providerAccount will not be returned. <br>This API is a premium service which requires subscription in advance to use.  Please contact Yodlee Client Services for more information. <br>
     */
    'get'(
      parameters?: Parameters<Paths.GetDocuments.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.GetDocuments.Responses.$200>
  }
  ['/accounts/evaluateAddress']: {
    /**
     * evaluateAddress - Evaluate Address
     *
     * Use this service to validate the address before adding the real estate account.<br>If the address is valid, the service will return the complete address information.<br>The response will contain multiple addresses if the user-provided input matches with multiple entries in the vendor database.<br>In the case of multiple matches, the user can select the appropriate address from the list and then invoke the add account service with the complete address.<br><br><b>Note:</b> <ul><li>Yodlee recommends to use this service before adding the real estate account to avoid failures.</li></ul>
     */
    'post'(
      parameters?: Parameters | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.EvaluateAddress.Responses.$200>
  }
  ['/accounts/{accountId}']: {
    /**
     * getAccount - Get Account Details
     *
     * The get account details service provides detailed information of an account.<br><br><b>Note:</b><li> fullAccountNumber is deprecated and is replaced with fullAccountNumberList in include parameter and response.</li>
     */
    'get'(
      parameters?: Parameters<
        Paths.GetAccount.PathParameters & Paths.GetAccount.QueryParameters
      > | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.GetAccount.Responses.$200>
    /**
     * deleteAccount - Delete Account
     *
     * The delete account service allows an account to be deleted.<br>This service does not return a response. The HTTP response code is 204 (Success with no content).<br>
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteAccount.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<any>
    /**
     * updateAccount - Update Account
     *
     * The update account service is used to update manual and aggregated accounts.<br>The HTTP response code is 204 (Success without content).<br>Update manual account support is available for bank, card, investment, insurance, loan, otherAssets, otherLiabilities and realEstate containers only.<br><br><b>Note:</b><li> A real estate account update is only supported for SYSTEM and MANUAL valuation type.</li> <li> A real estate account can be linked to a loan account by passing accountId of a loan account in linkedAccountIds .</li> <li> Attribute <b>isEbillEnrolled</b> is deprecated as it is applicable for bill accounts only.</li>
     */
    'put'(
      parameters?: Parameters<Paths.UpdateAccount.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<any>
  }
  ['/accounts/historicalBalances']: {
    /**
     * getHistoricalBalances - Get Historical Balances
     *
     * The historical balances service is used to retrieve the historical balances for an account or a user.<br>Historical balances are daily (D), weekly (W), and monthly (M). <br>The interval input should be passed as D, W, and M to retrieve the desired historical balances. The default interval is daily (D). <br>When no account id is provided, historical balances of the accounts that are active, to be closed, and closed are provided in the response. <br>If the fromDate and toDate are not passed, the last 90 days of data will be provided. <br>The fromDate and toDate should be passed in the YYYY-MM-DD format. <br>The date field in the response denotes the date for which the balance is requested.<br>includeCF needs to be sent as true if the customer wants to return carried forward balances for a date when the data is not available. <br>asofDate field in the response denotes the date as of which the balance was updated for that account.<br>When there is no balance available for a requested date and if includeCF is sent as true, the previous date for which the balance is available is provided in the response. <br>When there is no previous balance available, no data will be sent. <br>By default, pagination is available for the historicalBalances entity in this API. The skip and top parameters are used for pagination. In the skip and top parameters, pass the number of records to be skipped and retrieved, respectively. The response header provides the links to retrieve the next and previous set of historical balances.<br> The API will only retrieve a maximum 500 records by default when values for skip and top parameters are not provided.
     */
    'get'(
      parameters?: Parameters<Paths.GetHistoricalBalances.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.GetHistoricalBalances.Responses.$200>
  }
  ['/providerAccounts/profile']: {
    /**
     * getProviderAccountProfiles - Get User Profile Details
     *
     * <b>Refer GET /verification/holderProfile</b><br>The get provider accounts profile service is used to return the user profile details that are associated to the provider account. <br>
     */
    'get'(
      parameters?: Parameters<Paths.GetProviderAccountProfiles.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.GetProviderAccountProfiles.Responses.$200>
  }
  ['/user/register']: {
    /**
     * registerUser - Register User
     *
     * The register user service is used to register a user in Yodlee.<br>The loginName cannot include spaces and must be between 3 and 150 characters.<br>locale passed must be one of the supported locales for the customer. <br>Currency provided in the input will be respected in the derived services and the amount fields in the response will be provided in the preferred currency.<br>userParam is accepted as a body parameter. <br><br><b>Note:</b> <li>The content type has to be passed as application/json for the body parameter.</li>
     */
    'post'(
      parameters?: Parameters | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.RegisterUser.Responses.$200>
  }
  ['/verification']: {
    /**
     * initiateMatchingOrChallengeDepositeVerification - Initiaite Challenge Deposit
     *
     * The post verification service is used to initiate the matching service (MS) and the challenge deposit account verification (CDV) process to verify account ownership.<br>The MS and CDV process can verify ownership of only bank accounts (i.e., checking and savings).<br>The MS verification can be initiated only for an already aggregated account or a providerAccount.<br>The prerequisite for the MS verification process is to request the ACCT_PROFILE dataset with the HOLDER_NAME attribute.<br>In the MS verification process, a string-match of the account holder name with the registered user name is performed instantaneously. You can contact the Yodlee CustomerCare to configure the full name or only the last name match.<br>Once the CDV process is initiated Yodlee will post the microtransaction (i.e., credit and debit) in the user's account. The CDV process takes 2 to 3 days to complete as it requires the user to provide the microtransaction details.<br>The CDV process is currently supported only in the United States.<br>The verificationId in the response can be used to track the verification request.<br><br><b>Notes:</b><li>This endpoint cannot be used to test the CDV functionality in the developer sandbox or test environment. You will need a money transmitter license to implement the CDV functionality and also require the Yodlee Professional Services team's assistance to set up a dedicated environment.
     */
    'post'(
      parameters?: Parameters | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.InitiateMatchingOrChallengeDepositeVerification.Responses.$200>
    /**
     * getVerificationStatus - Get Verification Status
     *
     * The get verification status service is used to retrieve the verification status of all accounts for which the MS or CDV process has been initiated.<br>For the MS process, the account details object returns the aggregated information of the verified accounts. For the CDV process, the account details object returns the user provided account information.<br>
     */
    'get'(
      parameters?: Parameters<Paths.GetVerificationStatus.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.GetVerificationStatus.Responses.$200>
    /**
     * verifyChallengeDeposit - Verify Challenge Deposit
     *
     * The put verification service is used to complete the challenge deposit verification (CDV) process.<br>This service is used only by the customer of CDV flow.<br>In the CDV process, the user-provided microtransaction details (i.e., credit and debit) is matched against the microtransactions posted by Yodlee. For a successful verification of the account's ownership both the microtransaction details should match.<br>The CDV process is currently supported only in the United States.<br><br><b>Notes:</b><ul><li>This endpoint cannot be used to test the CDV functionality in the developer sandbox or test environment. You will need a money transmitter license to implement the CDV functionality and also require the Yodlee Professional Services team's assistance to set up a dedicated environment.</li></ul>
     */
    'put'(
      parameters?: Parameters | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.VerifyChallengeDeposit.Responses.$200>
  }
  ['/holdings/securities']: {
    /**
     * getSecurities - Get Security Details
     *
     * The get security details service is used to get all the security information for the holdings<br>
     */
    'get'(
      parameters?: Parameters<Paths.GetSecurities.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.GetSecurities.Responses.$200>
  }
  ['/configs/notifications/events/{eventName}']: {
    /**
     * createSubscriptionNotificationEvent - Subscribe For Notification Event
     *
     * The subscribe events service is used to subscribe to an event for receiving notifications.<br>The callback URL, where the notification will be posted should be provided to this service.<br>If the callback URL is invalid or inaccessible, the subscription will be unsuccessful, and an error will be thrown.<br>Customers can subscribe to REFRESH,DATA_UPDATES,AUTO_REFRESH_UPDATES and LATEST_BALANCE_UPDATES event.<br><br><b>Notes:</b><li>This service is not available in developer sandbox/test environment and will be made available for testing in your dedicated environment, once the contract is signed.<li>The content type has to be passed as application/json for the body parameter.</li>
     */
    'post'(
      parameters?: Parameters<Paths.CreateSubscriptionNotificationEvent.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<any>
    /**
     * deleteSubscribedNotificationEvent - Delete Notification Subscription
     *
     * The delete events service is used to unsubscribe from an events service.<br>
     */
    'delete'(
      parameters?: Parameters<Paths.DeleteSubscribedNotificationEvent.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<any>
    /**
     * updateSubscribedNotificationEvent - Update Notification Subscription
     *
     * The update events service is used to update the callback URL.<br>If the callback URL is invalid or inaccessible, the subscription will be unsuccessful, and an error will be thrown.<br><br><b>Note:</b> <li>The content type has to be passed as application/json for the body parameter. <br>
     */
    'put'(
      parameters?: Parameters<Paths.UpdateSubscribedNotificationEvent.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<any>
  }
  ['/cobrand/config/notifications/events']: {
    /**
     * getSubscribedEvents - Get Subscribed Events
     *
     * <b>Refer GET /configs/notifications/events.</b><br>The get events service provides the list of events for which consumers subscribed <br>to receive notifications. <br>
     */
    'get'(
      parameters?: Parameters<Paths.GetSubscribedEvents.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.GetSubscribedEvents.Responses.$200>
  }
  ['/holdings']: {
    /**
     * getHoldings - Get Holdings
     *
     * The get holdings service is used to get the list of holdings of a user.<br>Supported holding types can be employeeStockOption, moneyMarketFund, bond, etc. and is obtained using get holding type list service. <br>Asset classifications for the holdings need to be requested through the "include" parameter.<br>Asset classification information for holdings are not available by default, as it is a premium feature.<br>
     */
    'get'(
      parameters?: Parameters<Paths.GetHoldings.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.GetHoldings.Responses.$200>
  }
  ['/auth/apiKey']: {
    /**
     * generateApiKey - Generate API Key
     *
     * This endpoint is used to generate an API key. The RSA public key you provide should be in 2048 bit PKCS#8 encoded format. <br>A public key is a mandatory input for generating the API key.<br/>The public key should be a unique key. The apiKeyId you get in the response is what you should use to generate the JWT token.<br> You can use one of the following authorization methods to access<br/>this API:<br><ol><li>cobsession</li><li>JWT token</li></ol> Alternatively, you can use base 64 encoded cobrandLogin and cobrandPassword in the Authorization header (Format: Authorization: Basic <encoded value of cobrandLogin: cobrandPassword>)<br><br><b>Note:</b><br><li>This service is not available in developer sandbox environment and will be made available for testing in your dedicated environment. The content type has to be passed as application/json for the body parameter.</li>
     */
    'post'(
      parameters?: Parameters | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.GenerateApiKey.Responses.$201>
    /**
     * getApiKeys - Get API Keys
     *
     * This endpoint provides the list of API keys that exist for a customer.<br>You can use one of the following authorization methods to access this API:<br><ol><li>cobsession</li><li>JWT token</li></ol><b>Notes:</b><li>This service is not available in developer sandbox environment and will be made available for testing in your dedicated environment.
     */
    'get'(
      parameters?: Parameters | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.GetApiKeys.Responses.$200>
  }
  ['/institutions']: {
    /**
     * getInstitutions - Get institutions
     *
     * Yodlee classifies providers into credential-based aggregation and Open Banking (OB) providers. The get institutions service helps in identifying credential and related OB sites in a financial institution. The service searches for an institution regardless of the authentication types associated with the providers. Using the get institutions service, retrieve institutions enabled for the customer, search an institution by its name or routing number, and retrieve the popular institutions for a region. Searching for an institution using a routing number applies only to the USA and Canada regions.<br> The valid values for the priority parameter are: <br/> 1.	all: Returns all the institutions enabled for the customer (the default value for the priority parameter).<br/> 2.	search: Returns institutions matching the name provided by the user. The name parameter is mandatory if the priority parameter is set as search.<br/> 3.	popular: Returns institutions that are popular among the customer's users.<br/> Only the datasets, attributes, and containers that are enabled for the customer will be returned in the response.<br/>Input for the dataset$filter should adhere to the following expression:<dataset.name>[<attribute.name>.container[<container> OR <container>] OR <attribute.name>.container[<container>]] <br>OR <dataset.name>[<attribute.name> OR <attribute.name>]<br><b>dataset$filter value examples:</b><br>ACCT_PROFILE[FULL_ACCT_NUMBER.container[bank OR investment OR creditCard]]<br>ACCT_PROFILE[FULL_ACCT_NUMBER.container[bank]]<br>BASIC_AGG_DATA[ACCOUNT_DETAILS.container[bank OR investment] OR HOLDINGS.container[bank]] OR ACCT_PROFILE[FULL_ACCT_NUMBER.container[bank]]<br>BASIC_AGG_DATA<br>BASIC_AGG_DATA OR ACCT_PROFILE<br>BASIC_AGG_DATA [ ACCOUNT_DETAILS OR HOLDINGS ]<br>BASIC_AGG_DATA [ ACCOUNT_DETAILS] OR DOCUMENT <br>BASIC_AGG_DATA [ BASIC_ACCOUNT_INFO OR ACCOUNT_DETAILS ] <br><br>The skip and top parameters are used for pagination. In the skip and top parameters, pass the number of records to be skipped and retrieved, respectively.<br>The response header provides the links to retrieve the next and previous set of transactions.<br><br><b>Note:</b> <br><br/> 1. If no value is set for the priority parameter, all the institutions enabled for the customer will be returned.<br/> 2. In a product flow involving user interaction, Yodlee recommends invoking this service with filters.<br/> Without filters, the service may perform slowly as it takes a few minutes to return data in the response.<br/> 3. The response includes comma separated provider IDs that are associated with the institution.<br/> 4. This service supports the localization feature and accepts locale as a header parameter.<br>
     */
    'get'(
      parameters?: Parameters<Paths.GetInstitutions.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.GetInstitutions.Responses.$200>
  }
  ['/cobrand/publicKey']: {
    /**
     * getPublicKey - Get Public Key
     *
     * <b>Refer GET /configs/publicKey.</b><br>The get public key service provides the customer the public key that should be used to encrypt the user credentials before sending it to Yodlee.<br>This endpoint is useful only for PKI enabled.<br>
     */
    'get'(
      parameters?: Parameters | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.GetPublicKey.Responses.$200>
  }
  ['/transactions/categories']: {
    /**
     * createTransactionCategory - Create Category
     *
     * The create transaction categories service is used to create user-defined categories for a system-defined category.<br>The parentCategoryId is the system-defined category id.This can be retrieved using get transaction categories service.<br>The categoryName can accept minimum of 1, maximum of 50 alphanumeric or special characters.<br>The HTTP response code is 201 (Created successfully).<br>
     */
    'post'(
      parameters?: Parameters | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<any>
    /**
     * getTransactionCategories - Get Transaction Category List
     *
     * The categories service returns the list of available transaction categories.<br>High level category is returned in the response only if it is opted by the customer.<br>When invoked by passing the cobrand session or admin access token, this service returns the supported transaction categories at the cobrand level. <br>When invoked by passing the cobrand session and the user session or user access token, this service returns the transaction categories <br>along with user-defined categories.<br>Double quotes in the user-defined category name will be prefixed by backslashes (&#92;) in the response, <br>e.g. Toys "R" Us.<br/>Source and id are the primary attributes of the category entity.<br><br><b>Note:</b><li>This service supports the localization feature and accepts locale as a header parameter.</li>
     */
    'get'(
      parameters?: Parameters | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.GetTransactionCategories.Responses.$200>
    /**
     * updateTransactionCategory - Update Category
     *
     * The update transaction categories service is used to update the transaction category name<br>for a high level category, a system-defined category and a user-defined category.<br>The renamed category can be set back to the original name by passing an empty string for categoryName.<br>The categoryName can accept minimum of 1, maximum of 50 alphanumeric or special characters.<br>The HTTP response code is 204 (Success without content).<br>
     */
    'put'(
      parameters?: Parameters | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<any>
  }
  ['/transactions/categories/rules']: {
    /**
     * createOrRunTransactionCategorizationRules - Create or Run Transaction Categorization Rule
     *
     * The Create or Run Transaction Categorization Rule endpoint is used to: <br>Create transaction categorization rules for both system and user-defined categories.<br>Run all the transaction categorization rules to categorize transactions by calling the endpoint with action=run as the query parameter. <br><br>The input body parameters to create transaction categorization rules follow:<br>     categoryId - This field is mandatory and numeric<br>     priority - This field is optional and numeric. Priority decides the order in which the rule gets applied on transactions.<br>     ruleClause - This field is mandatory and should contain at least one rule<br>     field - The value can be description or amount<br><br>       If the field value is description then,<br>         1. operation - value can be stringEquals or stringContains<br>         2. value - value should be min of 3 and max of 50 characters<br><br>       If the field value is amount then, <br>         1. operation - value can be numberEquals, numberLessThan, numberLessThanEquals, numberGreaterThan or numberGreaterThanEquals<br>         2. value - min value 0 and a max value of 99999999999.99 is allowed<br>The HTTP response code is 201 (Created Successfully).
     */
    'post'(
      parameters?: Parameters<Paths.CreateOrRunTransactionCategorizationRules.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<any>
    /**
     * getTransactionCategorizationRulesDeprecated - Get Transaction Categorization Rules
     *
     * The get transaction categorization rule service is used to get all the categorization rules.<br>
     */
    'get'(
      parameters?: Parameters | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.GetTransactionCategorizationRulesDeprecated.Responses.$200>
  }
  ['/consents']: {
    /**
     * createConsent - Post Consent
     *
     * The generate consent service is used to generate all the consent information and permissions associated to a provider. <br/>The scope provided in the response is based on the providerId and the datasets provided in the input. <br/>If no dataset value is provided, the datasets that are configured for the customer will be considered. <br/>The configured dataset can be overridden by providing the dataset as an input. <br/>If no applicationName is provided in the input, the default applicationName will be considered. <b>Note:</b>This service supports the localization feature and accepts locale as a header parameter.<br>
     */
    'post'(
      parameters?: Parameters | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.CreateConsent.Responses.$200>
    /**
     * getConsents - Get Consents
     *
     * The get consent service is used to retrieve all the consents submitted to Yodlee. <br>The service can be used to build a manage consent interface or a consent dashboard to implement the renew and revoke consent flows.<br><b>Note:</b>This service supports the localization feature and accepts locale as a header parameter.<br>
     */
    'get'(
      parameters?: Parameters<Paths.GetConsents.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.GetConsents.Responses.$200>
  }
  ['/statements']: {
    /**
     * getStatements - Get Statements
     *
     * The statements service is used to get the list of statement related information. <br>By default, all the latest statements of active and to be closed accounts are retrieved for the user. <br>Certain sites do not have both a statement date and a due date. When a fromDate is passed as an input, all the statements that have the due date on or after the passed date are retrieved. <br>For sites that do not have the due date, statements that have the statement date on or after the passed date are retrieved. <br>The default value of "isLatest" is true. To retrieve historical statements isLatest needs to be set to false.<br>
     */
    'get'(
      parameters?: Parameters<Paths.GetStatements.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.GetStatements.Responses.$200>
  }
  ['/accounts/latestBalances']: {
    /**
     * getLatestBalances - Get Latest Balances
     *
     * The latest balances service provides the latest account balance by initiating a new balance refresh request
     */
    'get'(
      parameters?: Parameters<Paths.GetLatestBalances.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.GetLatestBalances.Responses.$200>
  }
  ['/holdings/holdingTypeList']: {
    /**
     * getHoldingTypeList - Get Holding Type List
     *
     * The get holding types list service is used to get the supported holding types.<br>The response includes different holding types such as future, moneyMarketFund, stock, etc. and it returns the supported holding types <br>
     */
    'get'(
      parameters?: Parameters | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.GetHoldingTypeList.Responses.$200>
  }
  ['/transactions/{transactionId}']: {
    /**
     * updateTransaction - Update Transaction
     *
     * The update transaction service is used to update the category,consumer description, memo, isPhysical, merchantType, detailCategory for a transaction.<br>The HTTP response code is 204 (Success without content).<br>
     */
    'put'(
      parameters?: Parameters<Paths.UpdateTransaction.PathParameters> | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<any>
  }
  ['/user/logout']: {
    /**
     * userLogout - User Logout
     *
     * <b>Deprecated</b>: This endpoint is deprecated for API Key-based authentication. The user logout service allows the user to log out of the application.<br>The service does not return a response body. The HTTP response code is 204 (Success with no content).<br>
     */
    'post'(
      parameters?: Parameters | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<any>
  }
  ['/dataExtracts/events']: {
    /**
     * getDataExtractsEvents - Get Events
     *
     * The get extracts events service is used to learn about occurrences of data extract related events. This service currently supports only the DATA_UPDATES event.<br>Passing the event name as DATA_UPDATES provides information about users for whom data has been modified in the system for the specified time range. To learn more, please refer to the <a href="https://developer.yodlee.com/docs/api/1.1/DataExtracts">dataExtracts</a> page.<br>You can retrieve data in increments of no more than 60 minutes over the period of the last 7 days from today's date.<br>This service is only invoked with either admin access token or a cobrand session.<br>
     */
    'get'(
      parameters?: Parameters<Paths.GetDataExtractsEvents.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.GetDataExtractsEvents.Responses.$200>
  }
  ['/derived/holdingSummary']: {
    /**
     * getHoldingSummary - Get Holding Summary
     *
     * The get holding summary service is used to get the summary of asset classifications for the user.<br>By default, accounts with status as ACTIVE and TO BE CLOSED will be considered.<br>If the include parameter value is passed as details then a summary with holdings and account information is returned.<br>
     */
    'get'(
      parameters?: Parameters<Paths.GetHoldingSummary.QueryParameters> | null,
      data?: any,
      config?: AxiosRequestConfig,
    ): OperationResponse<Paths.GetHoldingSummary.Responses.$200>
  }
}

export type Client = OpenAPIClient<OperationMethods, PathsDictionary>
