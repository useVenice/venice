/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Identifier = {
  /**
   * Type of Identifier
   */
  readonly type?: 'NIE' | 'DNI' | 'EIN' | 'BN' | 'AADHAR' | 'NIN' | 'NRIC'
  /**
   * Value of the identifier
   */
  readonly value?: string
}
