import {createApiClient} from './airbyte-client.gen'

const client = createApiClient('http://localhost:8000/api', {
  // axiosConfig: {auth: {username: 'airbyte', password: 'password'}},
})

void client
  .post('/v1/connections/list', {
    body: {
      workspaceId: '',
    },
  })
  .then((_res) => {})
