import type {QBOSDK, QBOSDKTypes} from '@usevenice/connector-qbo'
import type {StrictObj} from '@usevenice/vdk'
import {mapper, zCast} from '@usevenice/vdk'
import type {VerticalBanking} from '../banking'
import {zBanking} from '../banking'

type QBO = QBOSDKTypes['oas']['components']['schemas']

const mappers = {
  category: mapper(zCast<StrictObj<QBO['Account']>>(), zBanking.category, {
    id: 'Id',
    name: 'Name',
  }),
}

export const qboAdapter = {
  listCategories: async ({instance}) => {
    const res = await instance.query(
      // QBO API does not support OR in SQL query...
      "SELECT * FROM Account WHERE Classification IN ('Revenue', 'Expense')",
    )
    return {
      hasNextPage: false,
      items: (res.Account ?? []).map(mappers.category),
    }
  },
} satisfies VerticalBanking<{instance: QBOSDK}>
