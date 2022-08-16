import {
  AnyEntityPayload,
  handlersLink,
  makeSyncProvider,
} from '@ledger-sync/core-sync'
import {z, zCast, zFunction} from '@ledger-sync/util'
import * as mongoDB from 'mongodb'

const zWatchPathsInput = z.object({
  providerName: z.string(),
})

const def = makeSyncProvider.def({
  ...makeSyncProvider.def.defaults,
  name: z.literal('mongodb'),
  connectionSettings: zWatchPathsInput,
  destinationInputEntity: zCast<AnyEntityPayload>(),
})

export const mongodbProvider = makeSyncProvider({
  ...makeSyncProvider.defaults,
  def,
  destinationSync: ({settings: {providerName}}) =>
    handlersLink({
      data: ({data}) => {
        mongoDBConnection(providerName).insertData(data)
      },
    }),
})
const zData = zCast<AnyEntityPayload>()

export const mongoDBConnection = zFunction(z.string(), (providerName) => {
  let db: mongoDB.Db
  const initMongoDB = async () => {
    const client: mongoDB.MongoClient = new mongoDB.MongoClient(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      process.env['DB_CONN_STRING_MONGODB']!, // TODO: Consider it as env or make it as a dest setting
    )
    await client.connect()

    db = client.db(`${process.env['DB_NAME_MONGODB']}-${providerName}`) // Consider it to be separate DBs for each provider

    // For initialize collection of each entity
    db.collection('transaction')
    db.collection('account')

    console.log(`Successfully connected to database: ${db.databaseName}`)
  }

  return {
    insertData: zFunction(zData, (data) =>
      initMongoDB().then(async (_) => {
        await db.collection(data.entityName).insertOne(data)
      }),
    ),
  }
})
