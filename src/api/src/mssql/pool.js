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
    const request = (await pool.connect()).request()
    request.stream = true
    request.on('error', error => cb(error, null))
    request.on('row', row => cb(null, row))
    request.on('done', result => cb(null, null, true))

    return function iterate() {
      return {}
    }
  }

  return (sql, cb) =>
    pool.connect().then(pool => {
      const request = pool.request()
      request.stream = true

      return request.query(sql).catch(error => {
        console.error(error)
        throw error
      })
    })

  return function iterator() {
    return {
      next: 'hi',
    }
  }
}
