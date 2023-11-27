/* eslint-disable unicorn/prefer-top-level-await */
import {createClient} from '@usevenice/openapi-client'
import {createSdk, createVeniceClient} from '@usevenice/sdk'
import discordSdkDef from '@usevenice/sdk-discord'
import slackSdkDef from '@usevenice/sdk-slack'

const discord = createSdk(discordSdkDef)

void discord
  .GET('/channels/{channel_id}', {params: {path: {channel_id: ''}}})
  .then((r) => {
    r.last_message_id
  })

const slack = createSdk(slackSdkDef)
void slack
  .GET('/admin.teams.admins.list', {
    params: {query: {team_id: '', token: ''}},
  })
  .then((r) => {
    r.data?.ok
  })

const slack2 = createClient<(typeof slackSdkDef)['_types']['paths']>()
void slack2
  .GET('/admin.teams.admins.list', {
    params: {query: {team_id: '', token: ''}},
  })
  .then((r) => {
    r.data?.ok
  })

const venice = createVeniceClient({})

void venice.GET('/core/resource').then((r) => {
  r.data[0]?.connectorConfigId
})
