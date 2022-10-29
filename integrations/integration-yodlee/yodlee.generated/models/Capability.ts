/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type Capability = {
  readonly container?: Array<
    | 'bank'
    | 'creditCard'
    | 'investment'
    | 'insurance'
    | 'loan'
    | 'reward'
    | 'bill'
    | 'realEstate'
    | 'otherAssets'
    | 'otherLiabilities'
  >
  readonly name?: string
}
