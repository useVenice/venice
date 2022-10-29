/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type {Name} from './Name'
import type {UserAddress} from './UserAddress'
import type {UserRequestPreferences} from './UserRequestPreferences'

export type EnrichDataUser = {
  preferences?: UserRequestPreferences
  address?: UserAddress
  loginName: string
  name?: Name
  email: string
  segmentName?: string
}
