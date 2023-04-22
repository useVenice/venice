import type {z} from '@usevenice/util'
import * as zCommon from './common-schemas'

export * as Standard from './standard-types'
export * from './standard-utils'

export {zCommon}
export type ZCommon = {
  [k in keyof typeof zCommon]: z.infer<(typeof zCommon)[k]>
}
