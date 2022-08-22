import {
  AnyEntityPayload,
  handlersLink,
  makeSyncProvider,
} from '@ledger-sync/core-sync'
import {defineProxyFn, z, zCast, zFunction} from '@ledger-sync/util'
import {Db, MongoClient} from 'mongodb'

export const zMongoConnection = z.object({
  providerName: z.string(),
  mongoDBConnString: z.string(),
  DBName: z.string(),
})

const def = makeSyncProvider.def({
  ...makeSyncProvider.def.defaults,
  name: z.literal('mongodb'),
  connectionSettings: zMongoConnection,
  destinationInputEntity: zCast<AnyEntityPayload>(),
})
export const $mongodb = defineProxyFn<() => typeof MongoClient>('$mongodb')
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
  ({providerName, mongoDBConnString, DBName}) => {
    let db: Db
    const initMongoDB = async () => {
      const client: MongoClient = new MongoClient(mongoDBConnString)
      await client.connect()

      db = client.db(`${DBName}-${providerName}`) // Consider it to be separate DBs for each provider

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
            .then((_) =>
              console.log(
                `Successfully insert the data for ${data.entityName} - ${data.id} of ${providerName}`,
              ),
            )
            .catch((err) => console.log(`Error: ${err}`)), // Need this format instead of just log the error when catch it to get the specific error, not sure why
      ),
    }
  },
)
