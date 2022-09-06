/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DocumentDownloadResponse } from '../models/DocumentDownloadResponse';
import type { DocumentResponse } from '../models/DocumentResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class DocumentsService {

  constructor(public readonly httpRequest: BaseHttpRequest) {}

  /**
   * Download a Document
   * The get document details service allows consumers to download a document. The document is provided in base64.<br>This API is a premium service which requires subscription in advance to use.  Please contact Yodlee Client Services for more information. <br>
   * @returns DocumentDownloadResponse OK
   * @throws ApiError
   */
  public downloadDocument({
    documentId,
  }: {
    /**
     * documentId
     */
    documentId: string,
  }): CancelablePromise<DocumentDownloadResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/documents/{documentId}',
      path: {
        'documentId': documentId,
      },
      errors: {
        400: `Y800 : Invalid value for documentId`,
        401: `Unauthorized`,
        404: `Not Found`,
      },
    });
  }

  /**
   * Delete Document
   * The delete document service allows the consumer to delete a document. The deleted document will not be returned in the get documents API. The HTTP response code is 204 (success without content).<br>Documents can be deleted only if the document related dataset attributes are subscribed.<br>
   * @returns void
   * @throws ApiError
   */
  public deleteDocument({
    documentId,
  }: {
    /**
     * documentId
     */
    documentId: string,
  }): CancelablePromise<void> {
    return this.httpRequest.request({
      method: 'DELETE',
      url: '/documents/{documentId}',
      path: {
        'documentId': documentId,
      },
      errors: {
        400: `Y800 : Invalid value for documentId<br>Y868 : No action is allowed, as the data is being migrated to the Open Banking provider<br>`,
        401: `Unauthorized`,
        404: `Not Found`,
      },
    });
  }

  /**
   * Get Documents
   * The get documents service allows customers to search or retrieve metadata related to documents. <br>The API returns the document as per the input parameters passed. If no date range is provided then all downloaded documents will be retrieved. Details of deleted documents or documents associated to closed providerAccount will not be returned. <br>This API is a premium service which requires subscription in advance to use.  Please contact Yodlee Client Services for more information. <br>
   * @returns DocumentResponse OK
   * @throws ApiError
   */
  public getDocuments({
    keyword,
    accountId,
    docType,
    fromDate,
    toDate,
  }: {
    /**
     * The string used to search a document by its name.
     */
    keyword?: string,
    /**
     * The unique identifier of an account. Retrieve documents for a given accountId.
     */
    accountId?: string,
    /**
     * Accepts only one of the following valid document types: STMT, TAX, and EBILL.
     */
    docType?: string,
    /**
     * The date from which documents have to be retrieved.
     */
    fromDate?: string,
    /**
     * The date to which documents have to be retrieved.
     */
    toDate?: string,
  }): CancelablePromise<DocumentResponse> {
    return this.httpRequest.request({
      method: 'GET',
      url: '/documents',
      query: {
        'Keyword': keyword,
        'accountId': accountId,
        'docType': docType,
        'fromDate': fromDate,
        'toDate': toDate,
      },
      errors: {
        400: `Y800 : Invalid value for accountId<br>Y800 : Invalid value for fromDate<br>Y800 : Invalid value for toDate<br>Y800 : Invalid value for docType`,
        401: `Unauthorized`,
        404: `Not Found`,
      },
    });
  }

}
