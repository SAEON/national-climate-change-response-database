import * as charts from './chart-types/index.js'
import logger from '../../../../lib/logger.js'

export default async (self, { id }, ...props) => {
  const fn = charts[id]

  try {
    return { id, data: await fn(...props) }
  } catch (error) {
    logger.error('Error creating chart', id, error.message)
    throw error
  }
}
