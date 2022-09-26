import type {Db} from 'mongodb'

import type {AnyEntityPayload} from '@usevenice/cdk-core'
import {handlersLink, makeSyncProvider} from '@usevenice/cdk-core'
import {defineProxyFn, z, zCast, zFunction} from '@usevenice/util'

export const $mongodb =
  defineProxyFn<() => typeof import('mongodb')>('$mongodb')

export const zMongoConnection = z.object({
  databaseUrl: z.string(),
  databaseName: z.string(),
})

const def = makeSyncProvider.def({
  ...makeSyncProvider.def.defaults,
  name: z.literal('mongodb'),
  connectionSettings: zMongoConnection,
  destinationInputEntity: zCast<AnyEntityPayload>(),
})

export const mongodbProvider = makeSyncProvider({
  ...makeSyncProvider.defaults,
  def,
  destinationSync: ({settings}) => {
    const mongodb = mongoDBConnection(settings)
    mongodb.initMongoDB()
    return handlersLink({
      data: ({data}) => {
        mongodb.insertData(data)
      },
    })
  },
})
const zData = zCast<AnyEntityPayload>()

export const mongoDBConnection = zFunction(
  zMongoConnection,
  ({databaseUrl, databaseName}) => {
    const {MongoClient} = $mongodb()
    let db: Db
    const initMongoDB = async () => {
      const client = new MongoClient(databaseUrl)
      await client.connect()
      db = client.db(databaseName)

      // For initialize collection of each entity and prevent duplicated document.
      // Consider to use create unique index instead using _id (mongodb's ObjectId) because
      // the ObjectId need to pass strict params/input format https://www.mongodb.com/docs/v5.2/reference/method/ObjectId/
      db.collection('transaction').createIndex(
        {id: 1, externalId: 1}, // TODO: Need to check the fields the should be unique or just use these fields
        {unique: true},
      )
      db.collection('account').createIndex(
        {id: 1, externalId: 1},
        {unique: true},
      )

      console.log(`Successfully connected to database: ${db.databaseName}`)
    }

    return {
      initMongoDB: zFunction(async () => await initMongoDB()),
      insertData: zFunction(
        zData,
        async (data) =>
          db
            .collection(data.entityName)
            .insertOne(data)
            .then((_) => console.log(`Insert ${data.entityName} - ${data.id}`))
            .catch((err) => console.log(`Error: ${err}`)), // Need this format instead of just log the error when catch it to get the specific error, not sure why
      ),
    }
  },
)
