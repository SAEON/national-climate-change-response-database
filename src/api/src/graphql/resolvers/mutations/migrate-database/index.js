import * as migrations from './migrations/index.js'

export default async (self, { migration: key, input = {} }, ctx) => {
  console.info('Running DB migration', key)
  const fn = migrations[key]

  try {
    const result = await fn(ctx, { ...input })
    if (result === true || result === undefined) {
      return true
    } else {
      return false
    }
  } catch (error) {
    console.error('Error running DB migration', key, error)
    throw error
  }
}
