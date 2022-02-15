import { join, normalize, sep } from 'path'
import getCurrentDirectory from '../lib/get-current-directory.js'
import ensureDirectory from '../lib/ensure-directory.js'

const __dirname = getCurrentDirectory(import.meta)
const p = (...args) => normalize(join(...args))
const _ = (k, _p) => p(process.env[k] || join(__dirname, _p))

export const HOSTNAME = process.env.HOSTNAME || 'http://localhost:3000'

export const API_KEY = process.env.API_KEY || '7cwANClfrqqNFmpOmcP0OzWDzdcras0EdIqD3RAUUCU='
export const CLIENT_COOKIE_ID = process.env.CLIENT_COOKIE_ID || 'client.session'
export const DEFAULT_ADMIN_EMAIL_ADDRESSES = process.env.DEFAULT_ADMIN_EMAIL_ADDRESSES || ''
export const DEFAULT_SHORTNAME = 'NCCRD'
export const DEFAULT_SYSADMIN_EMAIL_ADDRESSES = process.env.DEFAULT_SYSADMIN_EMAIL_ADDRESSES || ''
export const DEPLOYMENT_ENV = process.env.DEPLOYMENT_ENV || 'development'
export const FILES_DIRECTORY = _('FILES_DIRECTORY', `..${sep}..${sep}assets`)
export const GQL_HOSTNAME = `${HOSTNAME}/graphql`
export const IMAGES_DIRECTORY = p(FILES_DIRECTORY, `.${sep}images`)
export const MIGRATION_LOGS_DIRECTORY = p(FILES_DIRECTORY, `.${sep}migration-logs`)
export const LOG_REQUEST_DETAILS = (process.env.LOG_REQUEST_DETAILS || 'true').toBoolean()
export const PORT = process.env.PORT || 3000
export const SKIP_INSTALLS = (process.env.SKIP_INSTALLS || 'false').toBoolean() // For debugging only
export const SSL_ENV = process.env.SSL_ENV || 'development'
export const SUBMISSION_TEMPLATES_DIRECTORY = p(FILES_DIRECTORY, `.${sep}submission-templates`)
export const SUBMITTED_TEMPLATES_DIRECTORY = p(FILES_DIRECTORY, `.${sep}submitted-templates`)
export const TEMP_DIRECTORY = p(FILES_DIRECTORY, `.${sep}temp`)
export const UPLOADS_DIRECTORY = p(FILES_DIRECTORY, `.${sep}uploads`)

if (DEPLOYMENT_ENV === 'production') {
  if (SKIP_INSTALLS) {
    throw new Error(
      'SKIP_INSTALLS is set to true. This is for local development only and should be set to false for deployments'
    )
  }
}

/**
 * Ensure required directories exists
 */
;(async () => {
  await ensureDirectory(FILES_DIRECTORY)
  await ensureDirectory(SUBMISSION_TEMPLATES_DIRECTORY)
  await ensureDirectory(SUBMITTED_TEMPLATES_DIRECTORY)
  await ensureDirectory(UPLOADS_DIRECTORY)
  await ensureDirectory(TEMP_DIRECTORY)
  await ensureDirectory(IMAGES_DIRECTORY)
  await ensureDirectory(MIGRATION_LOGS_DIRECTORY)
})().catch(error => {
  if (FILES_DIRECTORY.includes('snapshot')) {
    console.error(
      'ERROR - missing application directory.',
      'Please specify the FILES_DIRECTORY environment variable when starting the application',
      `If you are executing this application via Powershell, try: $env:FILES_DIRECTORY="./assets"; .\\nccrd-win.exe'`,
      error
    )
  } else {
    console.error(
      'ERROR - missing application directory.',
      'Please create directory',
      FILES_DIRECTORY,
      'that can be used by the current process',
      error
    )
  }

  process.exit(1)
})
