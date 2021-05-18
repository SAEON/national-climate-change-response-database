import packageJson from '../../../../../package.json'
import mssql from 'mssql'
import {
  MSSQL_USERNAME as user,
  MSSQL_PASSWORD as password,
  MSSQL_HOSTNAME as server,
  MSSQL_PORT as port,
} from '../../../../config.js'

const { ConnectionPool } = mssql

const database = 'VMS'

export default () => {
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
    return (await pool.connect()).query(sql)
  }
}
