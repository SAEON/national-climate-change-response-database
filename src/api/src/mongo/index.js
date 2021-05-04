import MongoClient from 'mongodb'
import {
  MONGO_DB as DB,
  MONGO_DB_ADDRESS,
  MONGO_DB_USERNAME,
  MONGO_DB_PASSWORD,
  NCCRD_API_NODE_ENV,
} from '../config.js'
import _collections from './_collections.js'
import _Logger from './_logger.js'
import DataLoader from 'dataloader'
import sift from 'sift'

const CONNECTION_STRING = `${MONGO_DB_ADDRESS}`

export const db = MongoClient.connect(CONNECTION_STRING, {
  auth: {
    user: MONGO_DB_USERNAME,
    password: MONGO_DB_PASSWORD,
  },
  authMechanism: 'SCRAM-SHA-256',
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(client => client.db(DB))
  .catch(error => {
    console.error('Unable to connect to MongoDB', error)
    if (NCCRD_API_NODE_ENV === 'production') process.exit(1) // Allow local development without Mongo
  })

export const collections = Object.entries(_collections)
  .reduce(async (accumulator, [alias, { name }]) => {
    const _accumulator = await accumulator
    _accumulator[alias] = (await db).collection(name)
    return _accumulator
  }, Promise.resolve({}))
  .catch(error => console.error('Unable to load MongoDB collections', error))

export const getDataFinders = () =>
  Object.entries(_collections).reduce((acc, [alias, { name }]) => {
    const loader = new DataLoader(filters =>
      db
        .then(db => db.collection(name))
        .then(collection => collection.find({ $or: filters }).toArray())
        .then(docs => filters.map(filter => docs.filter(sift(filter))))
    )
    acc[`find${alias}`] = filter => loader.load(filter)
    return acc
  }, {})

/**
 * ================================================
 * Configure MongoDB on API startup
 * ================================================
 */

// Create collections
await db.then(db =>
  Promise.all(
    Object.entries(_collections).map(([, { name, validator = {} }]) =>
      db.createCollection(name, { validator }).catch(error => {
        if (error.code == 48) {
          console.info(`Collection already exists`, name)
        } else {
          console.error(error)
          process.exit(1)
        }
      })
    )
  )
)

// Apply indices
await db.then(db =>
  Promise.all(
    Object.entries(_collections)
      .map(([, { name, indices = [] }]) =>
        indices.map(({ index, options }) => db.collection(name).createIndex(index, options))
      )
      .flat()
  )
)

console.info('MongoDB configured')

/**
 * Application-level batching for inserting UI logs
 * to MongoDB.
 */
export const Logger = _Logger(collections)
