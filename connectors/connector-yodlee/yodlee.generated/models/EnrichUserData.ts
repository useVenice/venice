/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type {EnrichDataAccount} from './EnrichDataAccount'
import type {EnrichDataTransaction} from './EnrichDataTransaction'
import type {EnrichDataUser} from './EnrichDataUser'

export type EnrichUserData = {
  user: Array<EnrichDataUser>
  account: Array<EnrichDataAccount>
  transaction: Array<EnrichDataTransaction>
}
