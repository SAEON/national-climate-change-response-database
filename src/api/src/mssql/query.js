import packageJson from '../../package.json'
import sql from 'mssql'
import {
  MSSQL_USERNAME as user,
  MSSQL_PASSWORD as password,
  MSSQL_HOSTNAME as server,
  MSSQL_DATABASE as database,
  MSSQL_PORT as port,
} from '../config.js'

export default async query =>
  sql
    .connect({
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
    .then(pool => pool.request({ multiple: true }).query(query))
    .catch(error => {
      console.error(error)
      throw error
    })
