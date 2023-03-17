import * as migrations from './migrations/index.js'
import logger from '../../../../lib/logger.js'

export default async (self, { migration: key, input = {} }, ctx) => {
  logger.info('Running DB migration', key)
  const fn = migrations[key]

  try {
    const result = await fn(ctx, { ...input })
    if (result === true || result === undefined) {
      return true
    } else {
      return false
    }
  } catch (error) {
    logger.error('Error running DB migration', key, error)
    throw error
  }
}
