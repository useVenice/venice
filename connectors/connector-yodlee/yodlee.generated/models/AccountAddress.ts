/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type AccountAddress = {
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
