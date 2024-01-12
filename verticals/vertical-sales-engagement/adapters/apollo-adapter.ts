import type {ApolloSDK, ApolloSDKTypes} from '@usevenice/connector-apollo'
import type {StrictObj} from '@usevenice/vdk'
import {mapper, zCast} from '@usevenice/vdk'
import type {VerticalSalesEngagement} from '../sales-engagement'
import {zSalesEngagement} from '../sales-engagement'

type Apollo = ApolloSDKTypes['oas']['components']['schemas']

const mappers = {
  contact: mapper(
    zCast<StrictObj<Apollo['contact']>>(),
    zSalesEngagement.contact,
    {
      id: 'id',
      first_name: (c) => c.first_name ?? '',
      last_name: (c) => c.last_name ?? '',
    },
  ),
}

export const apolloAdapter = {
  listContacts: async ({instance}) => {
    const res = await instance.POST('/v1/contacts/search', {})
    return {
      hasNextPage: true,
      items: res.data.contacts.map(mappers.contact),
    }
  },
} satisfies VerticalSalesEngagement<{instance: ApolloSDK}>
