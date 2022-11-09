/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type {BaseHttpRequest} from '../core/BaseHttpRequest'
import type {CancelablePromise} from '../core/CancelablePromise'
import type {TransactionCategorizationRule} from '../models/TransactionCategorizationRule'
import type {TransactionCategorizationRuleRequest} from '../models/TransactionCategorizationRuleRequest'
import type {TransactionCategorizationRuleResponse} from '../models/TransactionCategorizationRuleResponse'
import type {TransactionCategoryRequest} from '../models/TransactionCategoryRequest'
import type {TransactionCategoryResponse} from '../models/TransactionCategoryResponse'
import type {TransactionCountResponse} from '../models/TransactionCountResponse'
import type {TransactionRequest} from '../models/TransactionRequest'
import type {TransactionResponse} from '../models/TransactionResponse'
import type {UpdateCategoryRequest} from '../models/UpdateCategoryRequest'

export class TransactionsService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Get Transactions
   * The Transaction service is used to get a list of transactions for a user.<br>By default, this service returns the last 30 days of transactions from today's date.<br>The keyword parameter performs a contains search on the original, consumer, and simple description attributes, replace the special characters #, &, and + with percent-encoding values %23, %26, and %2B respectively. Eg: for -Debit# , pass the input as -Debit%23.<br>Values for categoryId parameter can be fetched from get transaction category list service.<br> The categoryId is used to filter transactions based on system-defined category as well as user-defined category.<br>User-defined categoryIds should be provided in the filter with the prefix ''U''. E.g. U10002<br>The skip and top parameters are used for pagination. In the skip and top parameters pass the number of records to be skipped and retrieved, respectively. The response header provides the links to retrieve the next and previous set of transactions.<br>Double quotes in the merchant name will be prefixed by backslashes (&#92;) in the response, e.g. Toys "R" Us. <br>sourceId is a unique ID that the provider site has assigned to the transaction. The source ID is only available for the pre-populated accounts. Pre-populated accounts are the accounts that the FI customers shares with Yodlee, so that the user does not have to add or aggregate those accounts.<br><br><b>Note</b><ul><li><a href="https://developer.yodlee.com/docs/api/1.1/Transaction_Data_Enrichment">TDE</a> is made available for bank and card accounts. The address field in the response is available only when the TDE key is turned on.</li><li>The pagination feature is available by default. If no values are passed in the skip and top parameters, the API will only return the first 500 transactions.</li><li>This service supports the localization feature and accepts locale as a header parameter.</li></ul>
   * @returns TransactionResponse OK
   * @throws ApiError
   */
  public getTransactions({
    accountId,
    baseType,
    categoryId,
    categoryType,
    container,
    detailCategoryId,
    fromDate,
    highLevelCategoryId,
    keyword,
    skip,
    toDate,
    top,
    type,
  }: {
    /**
     * Comma separated accountIds
     */
    accountId?: string
    /**
     * DEBIT/CREDIT
     */
    baseType?: string
    /**
     * Comma separated categoryIds
     */
    categoryId?: string
    /**
     * Transaction Category Type(UNCATEGORIZE, INCOME, TRANSFER, EXPENSE or DEFERRED_COMPENSATION)
     */
    categoryType?: string
    /**
     * bank/creditCard/investment/insurance/loan
     */
    container?: string
    /**
     * Comma separated detailCategoryIds
     */
    detailCategoryId?: string
    /**
     * Transaction from date(YYYY-MM-DD)
     */
    fromDate?: string
    /**
     * Comma separated highLevelCategoryIds
     */
    highLevelCategoryId?: string
    /**
     * Transaction search text
     */
    keyword?: string
    /**
     * skip (Min 0)
     */
    skip?: number
    /**
     * Transaction end date (YYYY-MM-DD)
     */
    toDate?: string
    /**
     * top (Max 500)
     */
    top?: number
    /**
     * Transaction Type(SELL,SWEEP, etc.) for bank/creditCard/investment
     */
    type?: string
  }): CancelablePromise<TransactionResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/transactions',
      query: {
        accountId: accountId,
        baseType: baseType,
        categoryId: categoryId,
        categoryType: categoryType,
        container: container,
        detailCategoryId: detailCategoryId,
        fromDate: fromDate,
        highLevelCategoryId: highLevelCategoryId,
        keyword: keyword,
        skip: skip,
        toDate: toDate,
        top: top,
        type: type,
      },
      errors: {
        400: `Y800 : Invalid value for baseType<br>Y800 : Invalid value for fromDate<br>Y800 : Invalid value for category<br>Y800 : Invalid value for toDate<br>Y800 : Invalid value for container<br>Y809 : Invalid date range<br>Y804 : Permitted values of top between 1 - 500<br>Y805 : Multiple containers not supported<br>Y800 : Invalid value for transaction type<br>Y824 : The maximum number of accountIds permitted is 100<br>Y824 : The maximum number of categoryIds permitted is 100<br>Y824 : The maximum number of highLevelCategoryIds permitted is 100<br>Y848 : detailCategoryId cannot be provided as input, as the detailedCategory feature is not enabled<br>Y823 : detailCategoryId is not for applicable containers other than bank and card<br>Y824 : The maximum number of detailCategoryIds permitted is 100<br>Y800 : Invalid value for detailCategoryId`,
        401: `Unauthorized`,
        404: `Not Found`,
      },
    })
  }

  /**
   * Run Transaction Categorization Rule
   * The run transaction categorization rule service is used to run a rule on transactions, to categorize the transactions.<br>The HTTP response code is 204 (Success with no content).<br>
   * @returns void
   * @throws ApiError
   */
  public runTransactionCategorizationRule({
    ruleId,
    action = 'run',
  }: {
    /**
     * Unique id of the categorization rule
     */
    ruleId: number
    action?: 'run'
  }): CancelablePromise<void> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/transactions/categories/rules/{ruleId}',
      path: {
        ruleId: ruleId,
      },
      query: {
        action: action,
      },
      errors: {
        400: `Y800 : Invalid value for ruleId<br>Y400 : Categorization already in progress`,
        401: `Unauthorized`,
        404: `Not Found`,
      },
    })
  }

  /**
   * Delete Transaction Categorization Rule
   * The delete transaction categorization rule service is used to delete the given user-defined transaction categorization rule for both system-defined category as well as user-defined category.<br>This will delete all the corresponding rule clauses associated with the rule.<br>The HTTP response code is 204 (Success without content).<br>
   * @returns void
   * @throws ApiError
   */
  public deleteTransactionCategorizationRule({
    ruleId,
  }: {
    /**
     * ruleId
     */
    ruleId: number
  }): CancelablePromise<void> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/transactions/categories/rules/{ruleId}',
      path: {
        ruleId: ruleId,
      },
      errors: {
        400: `Y800 : Invalid value for ruleId`,
        401: `Unauthorized`,
        404: `Not Found`,
      },
    })
  }

  /**
   * Update Transaction Categorization Rule
   * The update transaction categorization rule service is used to update a categorization rule for both system-defined category as well as user-defined category.<br>ruleParam JSON input should be as explained in the create transaction categorization rule service.<br>The HTTP response code is 204 (Success without content).<br>
   * @returns void
   * @throws ApiError
   */
  public updateTransactionCategorizationRule({
    ruleId,
    transactionCategoriesRuleRequest,
  }: {
    /**
     * ruleId
     */
    ruleId: number
    /**
     * transactionCategoriesRuleRequest
     */
    transactionCategoriesRuleRequest: TransactionCategorizationRuleRequest
  }): CancelablePromise<void> {
    return this.httpRequest.request({
      method: 'PUT',
      url: '/transactions/categories/rules/{ruleId}',
      path: {
        ruleId: ruleId,
      },
      body: transactionCategoriesRuleRequest,
      errors: {
        400: `Y800 : Invalid value for ruleId<br>Y806 : Invalid input`,
        401: `Unauthorized`,
        404: `Not Found`,
      },
    })
  }

  /**
   * Get Transactions Count
   * The count service provides the total number of transactions for a specific user depending on the input parameters passed.<br>If you are implementing pagination for transactions, call this endpoint before calling GET /transactions to know the number of transactions that are returned for the input parameters passed.<br>The functionality of the input parameters remains the same as that of the GET /transactions endpoint.<br>
   * @returns TransactionCountResponse OK
   * @throws ApiError
   */
  public getTransactionsCount({
    accountId,
    baseType,
    categoryId,
    categoryType,
    container,
    detailCategoryId,
    fromDate,
    highLevelCategoryId,
    keyword,
    toDate,
    type,
  }: {
    /**
     * Comma separated accountIds
     */
    accountId?: string
    /**
     * DEBIT/CREDIT
     */
    baseType?: string
    /**
     * Comma separated categoryIds
     */
    categoryId?: string
    /**
     * Transaction Category Type(UNCATEGORIZE, INCOME, TRANSFER, EXPENSE or DEFERRED_COMPENSATION)
     */
    categoryType?: string
    /**
     * bank/creditCard/investment/insurance/loan
     */
    container?: string
    /**
     * Comma separated detailCategoryIds
     */
    detailCategoryId?: string
    /**
     * Transaction from date(YYYY-MM-DD)
     */
    fromDate?: string
    /**
     * Comma separated highLevelCategoryIds
     */
    highLevelCategoryId?: string
    /**
     * Transaction search text
     */
    keyword?: string
    /**
     * Transaction end date (YYYY-MM-DD)
     */
    toDate?: string
    /**
     * Transaction Type(SELL,SWEEP, etc.)
     */
    type?: string
  }): CancelablePromise<TransactionCountResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/transactions/count',
      query: {
        accountId: accountId,
        baseType: baseType,
        categoryId: categoryId,
        categoryType: categoryType,
        container: container,
        detailCategoryId: detailCategoryId,
        fromDate: fromDate,
        highLevelCategoryId: highLevelCategoryId,
        keyword: keyword,
        toDate: toDate,
        type: type,
      },
      errors: {
        400: `Y800 : Invalid value for detailCategoryId<br>Y848 : detailCategoryId cannot be provided as input, as the detailedCategory feature is not enabled<br>Y823 : detailCategoryId is not applicable for containers other than bank and card<br>Y824 : The maximum number of detailCategoryIds permitted is 100<br>`,
        401: `Unauthorized`,
        404: `Not Found`,
      },
    })
  }

  /**
   * Get Transaction Categorization Rules
   * The get transaction categorization rule service is used to get all the categorization rules.<br>
   * @returns TransactionCategorizationRuleResponse OK
   * @throws ApiError
   */
  public getTransactionCategorizationRules(): CancelablePromise<TransactionCategorizationRuleResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/transactions/categories/txnRules',
      errors: {
        401: `Unauthorized`,
        404: `Not Found`,
      },
    })
  }

  /**
   * Delete Category
   * The delete transaction categories service is used to delete the given user-defined category.<br>The HTTP response code is 204 (Success without content).<br>
   * @returns void
   * @throws ApiError
   */
  public deleteTransactionCategory({
    categoryId,
  }: {
    /**
     * categoryId
     */
    categoryId: number
  }): CancelablePromise<void> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/transactions/categories/{categoryId}',
      path: {
        categoryId: categoryId,
      },
      errors: {
        400: `Y800 : Invalid value for categoryId`,
        401: `Unauthorized`,
        404: `Not Found`,
      },
    })
  }

  /**
   * Create Category
   * The create transaction categories service is used to create user-defined categories for a system-defined category.<br>The parentCategoryId is the system-defined category id.This can be retrieved using get transaction categories service.<br>The categoryName can accept minimum of 1, maximum of 50 alphanumeric or special characters.<br>The HTTP response code is 201 (Created successfully).<br>
   * @returns any Created Successfully
   * @throws ApiError
   */
  public createTransactionCategory({
    transactionCategoryRequest,
  }: {
    /**
     * User Transaction Category in JSON format
     */
    transactionCategoryRequest: TransactionCategoryRequest
  }): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/transactions/categories',
      body: transactionCategoryRequest,
      errors: {
        400: `Y800 : Invalid value for categoryParam<br>Y800 : Invalid value for source<br>Y801 : Invalid length for categoryName. Min 1 and max 50 is required<br>Y803 : parentCategoryId required<br>Y811 : categoryName value already exists`,
        401: `Unauthorized`,
        404: `Not Found`,
      },
    })
  }

  /**
   * Get Transaction Category List
   * The categories service returns the list of available transaction categories.<br>High level category is returned in the response only if it is opted by the customer.<br>When invoked by passing the cobrand session or admin access token, this service returns the supported transaction categories at the cobrand level. <br>When invoked by passing the cobrand session and the user session or user access token, this service returns the transaction categories <br>along with user-defined categories.<br>Double quotes in the user-defined category name will be prefixed by backslashes (&#92;) in the response, <br>e.g. Toys "R" Us.<br/>Source and id are the primary attributes of the category entity.<br><br><b>Note:</b><li>This service supports the localization feature and accepts locale as a header parameter.</li>
   * @returns TransactionCategoryResponse OK
   * @throws ApiError
   */
  public getTransactionCategories(): CancelablePromise<TransactionCategoryResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/transactions/categories',
      errors: {
        401: `Unauthorized`,
        404: `Not Found`,
      },
    })
  }

  /**
   * Update Category
   * The update transaction categories service is used to update the transaction category name<br>for a high level category, a system-defined category and a user-defined category.<br>The renamed category can be set back to the original name by passing an empty string for categoryName.<br>The categoryName can accept minimum of 1, maximum of 50 alphanumeric or special characters.<br>The HTTP response code is 204 (Success without content).<br>
   * @returns void
   * @throws ApiError
   */
  public updateTransactionCategory({
    updateCategoryRequest,
  }: {
    /**
     * updateCategoryRequest
     */
    updateCategoryRequest: UpdateCategoryRequest
  }): CancelablePromise<void> {
    return this.httpRequest.request({
      method: 'PUT',
      url: '/transactions/categories',
      body: updateCategoryRequest,
      errors: {
        400: `Y800 : Invalid value for categoryParam<br>Y800 : Invalid value for source<br>Y801 : Invalid length for categoryName. Min 1 and max 50 is required<br>Y803 : id required<br>Y811 : categoryName value already exists`,
        401: `Unauthorized`,
        404: `Not Found`,
      },
    })
  }

  /**
   * Create or Run Transaction Categorization Rule
   * The Create or Run Transaction Categorization Rule endpoint is used to: <br>Create transaction categorization rules for both system and user-defined categories.<br>Run all the transaction categorization rules to categorize transactions by calling the endpoint with action=run as the query parameter. <br><br>The input body parameters to create transaction categorization rules follow:<br>     categoryId - This field is mandatory and numeric<br>     priority - This field is optional and numeric. Priority decides the order in which the rule gets applied on transactions.<br>     ruleClause - This field is mandatory and should contain at least one rule<br>     field - The value can be description or amount<br><br>       If the field value is description then,<br>         1. operation - value can be stringEquals or stringContains<br>         2. value - value should be min of 3 and max of 50 characters<br><br>       If the field value is amount then, <br>         1. operation - value can be numberEquals, numberLessThan, numberLessThanEquals, numberGreaterThan or numberGreaterThanEquals<br>         2. value - min value 0 and a max value of 99999999999.99 is allowed<br>The HTTP response code is 201 (Created Successfully).
   * @returns any Created Successfully
   * @throws ApiError
   */
  public createOrRunTransactionCategorizationRules({
    action,
    ruleParam,
  }: {
    /**
     * To run rules, pass action=run. Only value run is supported
     */
    action?: string
    /**
     * rules(JSON format) to categorize the transactions
     */
    ruleParam?: string
  }): CancelablePromise<any> {
    return this.httpRequest.request({
      method: 'POST',
      url: '/transactions/categories/rules',
      query: {
        action: action,
        ruleParam: ruleParam,
      },
      errors: {
        400: `Y806 : Invalid input<br>Y400 : Rule already exists. Rule should be unique in terms of combination of description and amount`,
        401: `Unauthorized`,
        404: `Not Found`,
      },
    })
  }

  /**
   * @deprecated
   * Get Transaction Categorization Rules
   * The get transaction categorization rule service is used to get all the categorization rules.<br>
   * @returns TransactionCategorizationRule OK
   * @throws ApiError
   */
  public getTransactionCategorizationRulesDeprecated(): CancelablePromise<
    Array<TransactionCategorizationRule>
  > {
    return this.httpRequest.request({
      method: 'GET',
      url: '/transactions/categories/rules',
      errors: {
        401: `Unauthorized`,
        404: `Not Found`,
      },
    })
  }

  /**
   * Update Transaction
   * The update transaction service is used to update the category,consumer description, memo, isPhysical, merchantType, detailCategory for a transaction.<br>The HTTP response code is 204 (Success without content).<br>
   * @returns void
   * @throws ApiError
   */
  public updateTransaction({
    transactionId,
    transactionRequest,
  }: {
    /**
     * transactionId
     */
    transactionId: number
    /**
     * transactionRequest
     */
    transactionRequest: TransactionRequest
  }): CancelablePromise<void> {
    return this.httpRequest.request({
      method: 'PUT',
      url: '/transactions/{transactionId}',
      path: {
        transactionId: transactionId,
      },
      body: transactionRequest,
      errors: {
        400: `Y812 : Required field -container missing in the transactionParam parameter input<br>Y800 : Invalid value for transactionId<br>Y800 : Invalid value for merchantType<br>Y800 : Invalid value for detailCategoryId<br>Y800 : Invalid value for categoryId<br>Y868 : No action is allowed, as the data is being migrated to the Open Banking provider<br>`,
        401: `Unauthorized`,
        404: `Not Found`,
      },
    })
  }
}
