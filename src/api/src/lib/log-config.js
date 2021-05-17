import * as config from '../config.js'

const mask = str => str?.replace(/./g, '*').padEnd(60, '*')

const { NCCRD_DEPLOYMENT_ENV } = config

const MASKED_FIELDS =
  NCCRD_DEPLOYMENT_ENV === 'production'
    ? ['NCCRD_API_KEY', 'SAEON_AUTH_CLIENT_SECRET', 'MSSQL_USERNAME', 'MSSQL_PASSWORD']
    : []

console.info(
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
