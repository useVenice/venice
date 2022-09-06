/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type DocumentDownload = {
  /**
   * Contents of the document in Base64 format.<br><br><b>Applicable containers</b>: bank, investment, creditCard, loan, insurance<br>
   */
  readonly docContent?: string;
  /**
   * The document's primary key and unique identifier.<br><br><b>Applicable containers</b>: bank, investment, creditCard, loan, insurance<br>
   */
  readonly id?: string;
};

