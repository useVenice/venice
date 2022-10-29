/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type {DerivedHoldingsLinks} from './DerivedHoldingsLinks'
import type {DerivedHoldingsSummary} from './DerivedHoldingsSummary'

export type DerivedHoldingSummaryResponse = {
  readonly holdingSummary?: Array<DerivedHoldingsSummary>
  readonly link?: DerivedHoldingsLinks
}
