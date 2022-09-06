/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type PaymentIdentifier = {
  /**
   * Type of Identifier
   */
  readonly type?: 'REFERENCE_NUMBER' | 'PLATFORM_CODE';
  /**
   * Value of the identifier
   */
  readonly value?: string;
};

