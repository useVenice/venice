/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type {DataExtractsEventUserData} from './DataExtractsEventUserData'

export type DataExtractsEventData = {
  readonly fromDate?: string
  readonly userData?: Array<DataExtractsEventUserData>
  readonly userCount?: number
  readonly toDate?: string
}
