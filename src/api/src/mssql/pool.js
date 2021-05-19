import packageJson from '../../package.json'
import mssql from 'mssql'
import {
  MSSQL_USERNAME,
  MSSQL_PASSWORD,
  MSSQL_HOSTNAME,
  MSSQL_DATABASE,
  MSSQL_PORT,
} from '../config.js'

const { ConnectionPool } = mssql

export default ({
  user = MSSQL_USERNAME,
  password = MSSQL_PASSWORD,
  server = MSSQL_HOSTNAME,
  database = MSSQL_DATABASE,
  port = MSSQL_PORT,
  batchSize = 100,
} = {}) => {
  const pool = new ConnectionPool({
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
    arrayRowMode: true,
    options: {
      enableArithAbort: true,
      useUTC: true,
      encrypt: true,
      appName: packageJson.name,
      abortTransactionOnError: true,
    },
  })

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