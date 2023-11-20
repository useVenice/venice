/* istanbul ignore file */

/* tslint:disable */

/* eslint-disable */
import type {Description} from './Description'

export type UpdateTransaction = {
  categorySource: 'SYSTEM' | 'USER'
  container:
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
  isPhysical?: boolean
  detailCategoryId?: number
  description?: Description
  memo?: string
  merchantType?: 'BILLERS' | 'SUBSCRIPTION' | 'OTHERS'
  categoryId: number
}
