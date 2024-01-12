import type {
  SalesloftSDK,
  SalesloftSDKTypes,
} from '@usevenice/connector-salesloft'
import type {StrictObj} from '@usevenice/types'
import {mapper, zCast} from '@usevenice/vdk'
import type {VerticalSalesEngagement} from '../sales-engagement'
import {zSalesEngagement} from '../sales-engagement'

type Salesloft = SalesloftSDKTypes['oas']['components']['schemas']

const mappers = {
  contact: mapper(
    zCast<StrictObj<Salesloft['Person']>>(),
    zSalesEngagement.contact,
    {
      // TODO: Mapper should be able to enforce types as well so number does not automatically become string.
      id: (p) => p.id?.toString() ?? '',
      first_name: (p) => p.first_name ?? '',
      last_name: (p) => p.last_name ?? '',
    },
  ),
}

export const salesloftAdapter = {
  listContacts: async ({instance}) => {
    const res = await instance.GET('/v2/people.json', {})
    // TODO: Fix openAPI spec to return the right types here
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
    const people = (res.data as any).data as Array<Salesloft['Person']>
    return {hasNextPage: true, items: people.map(mappers.contact)}
  },
} satisfies VerticalSalesEngagement<{instance: SalesloftSDK}>
