import * as config from '../config/index.js'
import logger from './logger.js'

const mask = str => str?.replace(/./g, '*').padEnd(60, '*')

const { DEPLOYMENT_ENV } = config

const MASKED_FIELDS =
  DEPLOYMENT_ENV === 'production'
    ? ['API_KEY', 'ODP_AUTH_CLIENT_SECRET', 'MSSQL_USERNAME', 'MSSQL_PASSWORD']
    : []

logger.info(
  'Configuration',
  Object.fromEntries(
    Object.entries(config)
      .map(([field, value]) => [
        field,
        MASKED_FIELDS.includes(field)
          ? mask(value)
          : typeof value === 'function'
          ? value.toString()
          : value,
      ])
      .sort(([aKey], [bKey]) => {
        if (aKey > bKey) return 1
        if (bKey > aKey) return -1
        return 0
      })
  )
)
