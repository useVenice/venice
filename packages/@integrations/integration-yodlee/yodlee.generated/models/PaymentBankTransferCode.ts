/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type PaymentBankTransferCode = {
  /**
   * Value of the identifier
   */
  readonly id?: string;
  /**
   * Type of BankTransferCode
   */
  readonly type?: 'ROUTING_NUMBER' | 'BSB' | 'IFSC' | 'SORT_CODE';
};

