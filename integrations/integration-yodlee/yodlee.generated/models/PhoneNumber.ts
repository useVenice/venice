/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type PhoneNumber = {
  /**
   * type of phone number
   */
  readonly type?: 'HOME' | 'WORK' | 'LANDLINE' | 'MOBILE'
  /**
   * Phone Number
   */
  readonly value?: string
}
