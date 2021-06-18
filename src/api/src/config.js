import { join, normalize, sep } from 'path'
import { mkdirSync, rmdirSync } from 'fs'
import { config } from 'dotenv'
import getCurrentDirectory from './lib/get-current-directory.js'
import ensureDirectory from './lib/ensure-directory.js'
config()

const __dirname = getCurrentDirectory(import.meta)

export const NCCRD_API_KEY =
  process.env.NCCRD_API_KEY || '7cwANClfrqqNFmpOmcP0OzWDzdcras0EdIqD3RAUUCU='

export const NCCRD_DEFAULT_ADMIN_EMAIL_ADDRESSES =
  process.env.NCCRD_DEFAULT_ADMIN_EMAIL_ADDRESSES || ''

export const NCCRD_DEFAULT_SYSADMIN_EMAIL_ADDRESSES =
  process.env.NCCRD_DEFAULT_SYSADMIN_EMAIL_ADDRESSES || ''

export const ODP_ADDRESS = process.env.ODP_ADDRESS || 'https://odp.saeon.ac.za'
export const CATALOGUE_API_ODP_AUTH_ADDRESS = `${ODP_ADDRESS}/auth`
export const SAEON_AUTH_ADDRESS = `${ODP_ADDRESS}/auth`

export const NCCRD_HOSTNAME = process.env.NCCRD_HOSTNAME || 'http://localhost:3000'

export const SAEON_AUTH_CLIENT_SECRET = process.env.SAEON_AUTH_CLIENT_SECRET || ''
export const SAEON_AUTH_CLIENT_ID = process.env.SAEON_AUTH_CLIENT_ID || 'SAEON.NCCIS'
export const SAEON_AUTH_CLIENT_SCOPES = process.env.SAEON_AUTH_CLIENT_SCOPES || 'SAEON.NCCIS'
export const SAEON_AUTH_OAUTH_REDIRECT_ADDRESS = `${NCCRD_HOSTNAME}/http/authenticate/redirect/saeon`

export const NCCRD_DEPLOYMENT_ENV = process.env.NCCRD_DEPLOYMENT_ENV || 'development'

export const NCCRD_SSL_ENV = process.env.NCCRD_SSL_ENV || 'development'

export const NCCRD_PORT = process.env.NCCRD_PORT || 3000

export const NCCRD_API_GQL_ADDRESS = `${NCCRD_HOSTNAME}/graphql`

export const NCCRD_API_ALLOWED_ORIGINS =
  process.env.NCCRD_API_ALLOWED_ORIGINS || 'http://localhost:3000,http://localhost:3001'

export const NCCRD_CLIENT_ID = process.env.NCCRD_CLIENT_ID || 'client.sess'

export const MSSQL_USERNAME = process.env.MSSQL_USERNAME || 'sa'

export const MSSQL_PASSWORD = process.env.MSSQL_PASSWORD || 'password!123#'

export const MSSQL_HOSTNAME = process.env.MSSQL_HOSTNAME || '127.0.0.1'

export const MSSQL_DATABASE = process.env.MSSQL_DATABASE || 'nccrd'

export const MSSQL_PORT = parseInt(process.env.MSSQL_PORT || 1433, 10)

export const LOG_SQL_QUERIES = (process.env.LOG_SQL_QUERIES || 'true').toBoolean()

export const FILES_DIRECTORY = normalize(
  join(__dirname, `..${sep}`, process.env.FILE_ASSETS_PATH || `.${sep}file-assets`)
)

export const SUBMISSION_TEMPLATES_DIRECTORY = normalize(
  join(FILES_DIRECTORY, `.${sep}submission-templates`)
)

export const SUBMITTED_TEMPLATES_DIRECTORY = normalize(
  join(FILES_DIRECTORY, `.${sep}submitted-templates`)
)

/**
 * Ensure data directory exists
 */
try {
  ensureDirectory(FILES_DIRECTORY)
  ensureDirectory(SUBMISSION_TEMPLATES_DIRECTORY)
  ensureDirectory(SUBMITTED_TEMPLATES_DIRECTORY)
  mkdirSync(join(FILES_DIRECTORY, '.test-write-permissions'))
  rmdirSync(join(FILES_DIRECTORY, '.test-write-permissions'))
} catch (error) {
  console.error(
    'Please create directory',
    FILES_DIRECTORY,
    'that can be used by the current process',
    error
  )
  process.exit(1)
}
