import {createVeniceClient} from '@usevenice/sdk'

const venice = createVeniceClient({
  apiKey: process.env['VENICE_API_KEY'],
  apiHost: process.env['VENICE_API_HOST'],
  resourceId: 'reso_apollo_01HJDW9217ZMSSMMJ53P1NTESQ',
})

void venice.GET('/verticals/sales-engagement/contacts').then((r) => {
  console.log(r.data)
})
