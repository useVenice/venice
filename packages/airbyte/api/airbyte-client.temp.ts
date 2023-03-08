/* eslint-disable unicorn/prefer-top-level-await */

import {createApiClient} from './airbyte-client.gen'

const client = createApiClient('http://localhost:8000/api', {
  axiosConfig: {auth: {username: 'airbyte', password: 'password'}},
})

client
  .post('/v1/connections/list', {
    workspaceId: '329b673d-ebe2-4b8d-ab95-256734139b98',
  })
  .then(console.log)
  .catch(console.error)
