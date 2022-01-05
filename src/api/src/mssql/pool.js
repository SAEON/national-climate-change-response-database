import packageJson from '../../package.json' assert { type: 'json' }
import mssql from 'mssql'
import {
  MSSQL_USERNAME,
  MSSQL_PASSWORD,
  MSSQL_HOSTNAME,
  MSSQL_DATABASE,
  MSSQL_PORT,
} from '../config/index.js'

const { ConnectionPool } = mssql

const makePool = ({ user, password, server, database, port }) => {
  return new ConnectionPool({
    user,
    password,
    server,
    database,
    port,
    connectionTimeout: 15 * 1000,
    requestTimeout: 15 * 1000,
    parseJSON: true,
    driver: 'tedious',
    pool: {
      max: 20,
      min: 0,
      idleTimeoutMillis: 30 * 1000,
    },
    arrayRowMode: false,
    options: {
      enableArithAbort: true,
      useUTC: true,
      encrypt: true,
      appName: packageJson.name,
      abortTransactionOnError: true,
      trustServerCertificate: true,
    },
  })
}

export const pool = makePool({
  user: MSSQL_USERNAME,
  password: MSSQL_PASSWORD,
  server: MSSQL_HOSTNAME,
  database: MSSQL_DATABASE,
  port: MSSQL_PORT,
})

const getPool = ({
  user = MSSQL_USERNAME,
  password = MSSQL_PASSWORD,
  server = MSSQL_HOSTNAME,
  database = MSSQL_DATABASE,
  port = MSSQL_PORT,
} = {}) => {
  if (
    user !== MSSQL_USERNAME ||
    server !== MSSQL_HOSTNAME ||
    database ||
    MSSQL_DATABASE ||
    port !== MSSQL_PORT
  ) {
    return makePool({
      user,
      password,
      server,
      database,
      port,
    })
  } else {
    return pool
  }
}

export default ({
  user = MSSQL_USERNAME,
  password = MSSQL_PASSWORD,
  server = MSSQL_HOSTNAME,
  database = MSSQL_DATABASE,
  port = MSSQL_PORT,
  batchSize = 100,
} = {}) => {
  const pool = getPool({ user, password, server, database, port })

  return async sql => {
    let done = false

    const connection = await pool.connect()
    const request = connection.request()
    request.stream = true
    request.query(sql)

    return (async function iterate() {
      const rows = []

      await new Promise((resolve, reject) => {
        if (done) resolve()

        const rowListener = row => {
          rows.push(row)
          if (rows.length >= batchSize) {
            request.pause()
            request.off('row', rowListener)
            request.off('done', doneListener)
            request.off('error', errorListener)
            resolve()
          }
        }

        const errorListener = error => {
          reject(error)
        }

        const doneListener = result => {
          done = result
          resolve()
        }

        request.on('row', rowListener)
        request.on('done', doneListener)
        request.on('error', errorListener)
      })

      return {
        next: () => {
          request.resume()
          return iterate()
        },
        done: !rows.length && Boolean(done),
        result: done,
        rows,
      }
    })()
  }
}
