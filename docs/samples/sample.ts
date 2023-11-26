/* eslint-disable unicorn/prefer-top-level-await */
import {createSdk} from '@usevenice/sdk'
import discordSdkDef from '@usevenice/sdk-discord'
import slackSdkDef from '@usevenice/sdk-slack'

const discord = createSdk(discordSdkDef)

void discord
  .GET('/channels/{channel_id}', {params: {path: {channel_id: ''}}})
  .then((r) => {
    r.data?.type
  })

const slack = createSdk(slackSdkDef)
void slack
  .GET('/admin.teams.admins.list', {
    params: {query: {team_id: '', token: ''}},
  })
  .then((r) => {
    r.data?.ok
  })
