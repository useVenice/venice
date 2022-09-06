/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Document = {
  /**
   * The unique identifier for the account. The account ID to which the document is linked.<br><br><b>Applicable containers</b>: bank, investment, creditCard, loan, insurance<br>
   */
  readonly accountID?: number;
  /**
   * Indicates the date and time the document was last updated.<br><br><b>Applicable containers</b>: bank, investment, creditCard, loan, insurance<br>
   */
  readonly lastUpdated?: string;
  /**
   * Indicates the type of the tax form.<br><br><b>Applicable containers</b>: bank, investment, creditCard, loan, insurance<br>
   */
  readonly formType?: string;
  /**
   * Indicates the type of the document.<br><br><b>Applicable containers</b>: bank, investment, creditCard, loan, insurance<br>
   */
  readonly docType?: 'STMT' | 'TAX' | 'EBILL';
  /**
   * Indicates the name of the document.<br><br><b>Applicable containers</b>: bank, investment, creditCard, loan, insurance<br>
   */
  readonly name?: string;
  /**
   * The document's primary key and unique identifier.<br><br><b>Applicable containers</b>: bank, investment, creditCard, loan, insurance<br>
   */
  readonly id?: string;
  /**
   * Indicates the source of the document download.<br><br><b>Applicable containers</b>: bank, investment, creditCard, loan, insurance<br>
   */
  readonly source?: string;
  /**
   * Indicates the status of the document download.<br><br><b>Applicable containers</b>: bank, investment, creditCard, loan, insurance<br>
   */
  readonly status?: string;
};

