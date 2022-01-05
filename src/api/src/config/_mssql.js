export const MSSQL_USERNAME = process.env.MSSQL_USERNAME || 'sa'
export const MSSQL_PASSWORD = process.env.MSSQL_PASSWORD || 'password!123#'
export const MSSQL_HOSTNAME = process.env.MSSQL_HOSTNAME || '127.0.0.1'
export const MSSQL_DATABASE = process.env.MSSQL_DATABASE || 'nccrd'
export const MSSQL_PORT = parseInt(process.env.MSSQL_PORT || 1433, 10)
export const LOG_SQL_QUERIES = (process.env.LOG_SQL_QUERIES || 'true').toBoolean()
