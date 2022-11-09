/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type {BaseHttpRequest} from '../core/BaseHttpRequest'
import type {CancelablePromise} from '../core/CancelablePromise'
import type {StatementResponse} from '../models/StatementResponse'

export class StatementsService {
  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Get Statements
   * The statements service is used to get the list of statement related information. <br>By default, all the latest statements of active and to be closed accounts are retrieved for the user. <br>Certain sites do not have both a statement date and a due date. When a fromDate is passed as an input, all the statements that have the due date on or after the passed date are retrieved. <br>For sites that do not have the due date, statements that have the statement date on or after the passed date are retrieved. <br>The default value of "isLatest" is true. To retrieve historical statements isLatest needs to be set to false.<br>
   * @returns StatementResponse OK
   * @throws ApiError
   */
  public getStatements({
    accountId,
    container,
    fromDate,
    isLatest,
    status,
  }: {
    /**
     * accountId
     */
    accountId?: string
    /**
     * creditCard/loan/insurance
     */
    container?: string
    /**
     * from date for statement retrieval (YYYY-MM-DD)
     */
    fromDate?: string
    /**
     * isLatest (true/false)
     */
    isLatest?: string
    /**
     * ACTIVE,TO_BE_CLOSED,CLOSED
     */
    status?: string
  }): CancelablePromise<StatementResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/statements',
      query: {
        accountId: accountId,
        container: container,
        fromDate: fromDate,
        isLatest: isLatest,
        status: status,
      },
      errors: {
        400: `Y800 : Invalid value for accountId<br>Y800 : Invalid value for status<br>Y805 : Multiple containers not supported<br>Y800 : Invalid value for container<br>Y800 : Invalid value for isLatest<br>Y800 : Invalid value for fromDate<br>`,
        401: `Unauthorized`,
        404: `Not Found`,
      },
    })
  }
}
