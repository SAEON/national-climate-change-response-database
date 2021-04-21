import * as config from '../config.js'

const mask = str => str?.replace(/./g, '*').padEnd(60, '*')

const MASKED_FIELDS = [
  'NCCRD_API_KEY',
  'NCCRD_API_GOOGLE_CLIENT_ID',
  'NCCRD_API_GOOGLE_CLIENT_SECRET',
  'MONGO_DB_USERNAME',
  'MONGO_DB_PASSWORD',
]

console.log(
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
