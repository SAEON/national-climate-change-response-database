import * as config from '../config'

if (config.NCCRD_DEPLOYMENT_ENV !== 'production') {
  console.log(
    'Configuration',
    Object.fromEntries(
      Object.entries(config)
        .map(([field, value]) => [field, typeof value === 'function' ? value.toString() : value])
        .sort(([aKey], [bKey]) => {
          if (aKey > bKey) return 1
          if (bKey > aKey) return -1
          return 0
        })
    )
  )
}
