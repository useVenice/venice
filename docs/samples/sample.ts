/* eslint-disable unicorn/prefer-top-level-await */
import {createClient} from '@usevenice/openapi-client'
import {createSdk, createVeniceClient} from '@usevenice/sdk'
import discordSdkDef from '@usevenice/sdk-discord'
import slackSdkDef from '@usevenice/sdk-slack'
import openaiSdkDef from '../../opensdks/sdk-openai'

const discord = createSdk(discordSdkDef)

void discord
  .GET('/channels/{channel_id}', {params: {path: {channel_id: ''}}})
  .then((r) => {
    r.data.flags
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

const openai = createSdk(openaiSdkDef)
const apiKey = process.env['OPENAI_API_KEY']
void openai
  .POST('/chat/completions', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: {
      model: 'gpt-3.5-turbo',
      max_tokens: 1000,
      messages: [{role: 'user', content: 'What is OpenAPI'}],
    },
  })
  .then((r) => {
    console.log(r.data.choices[0]?.message)
    r.data.choices[0]?.message
  })

const venice = createVeniceClient({})

void venice.GET('/core/resource').then((r) => {
  r.data[0]?.connectorConfigId
})
