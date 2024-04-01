import {createVeniceClient} from '@usevenice/sdk'

const venice = createVeniceClient({
  apiKey: process.env['_VENICE_API_KEY'],
  apiHost: process.env['_VENICE_API_HOST'],
  // resourceId: process.env['_QBO_RESOURCE_ID'],
  resourceId: process.env['_XERO_RESOURCE_ID'],
})

void venice.GET('/verticals/banking/category').then((r) => {
  console.log(r.data)
})

// void venice
//   .POST('/core/resource/{id}/source_sync', {
//     params: {path: {id: process.env['_APOLLO_RESOURCE_ID']!}},
//     body: {streams: {contact: true}},
//   })
//   .then((r) => {
//     console.log(r.data)
//   })
