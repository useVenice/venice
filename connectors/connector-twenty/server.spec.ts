// /* eslint-disable jest/no-standalone-expect */
import type {
  EndUserId,
  EntityPayloadWithRaw,
  SyncOperation,
} from '@usevenice/cdk'
import {rxjs, toCompletion} from '@usevenice/util'
import twentyServer from './server'

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const accessToken = process.env['TWENTY_ACCESS_TOKEN']!
const maybeTest = accessToken ? test : test.skip

maybeTest('destinationSync', async () => {
  const destLink = twentyServer.destinationSync({
    config: {},
    endUser: {id: 'esur_12' as EndUserId},
    settings: {access_token: accessToken},
    source: {id: 'reso_123'},
    state: {},
  })
  const src = rxjs.from([
    {
      data: {
        id: '123',
        connectorName: 'salesforce',
        entity: {
          name: 'sfdc',
          website: 'sfdc.com',
        },
        entityName: 'account',
        sourceId: 'reso_123',
      },
      type: 'data',
    } satisfies SyncOperation<EntityPayloadWithRaw>,
  ])

  await toCompletion(destLink(src))
})
