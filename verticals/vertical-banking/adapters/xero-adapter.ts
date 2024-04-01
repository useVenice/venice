import type {Oas_accounting, XeroSDK} from 'connectors/connector-xero'
import type {StrictObj} from '@usevenice/vdk'
import {mapper, z, zCast} from '@usevenice/vdk'
import type {VerticalBanking} from '../banking'
import {zBanking} from '../banking'

type Xero = Oas_accounting['components']['schemas']

const mappers = {
  category: mapper(
    zCast<StrictObj<Xero['Account']>>(),
    zBanking.category.extend({_raw: z.unknown().optional()}),
    {
      id: 'AccountID',
      name: 'Name',
      _raw: (a) => a,
    },
  ),
}

export const xeroAdapter = {
  listCategories: async ({instance}) => {
    // TODO: Abstract this away please...
    const tenantId = await instance.identity
      .GET('/Connections')
      .then((r) => r.data?.[0]?.tenantId)
    if (!tenantId) {
      throw new Error(
        'Missing access to any tenants. Check xero token permission',
      )
    }

    const res = await instance.accounting.GET('/Accounts', {
      params: {
        header: {'xero-tenant-id': tenantId},
        query: {
          where: 'Class=="REVENUE"||Class=="EXPENSE"',
        },
      },
    })
    return {
      hasNextPage: false,
      items: (res.data.Accounts ?? []).map(mappers.category),
    }
  },
} satisfies VerticalBanking<{instance: XeroSDK}>
