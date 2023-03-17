import { LOG_REQUEST_DETAILS } from '../config/index.js'
import logger from '../lib/logger.js'

export default async (ctx, next) => {
  if (LOG_REQUEST_DETAILS) {
    logger.info('REQUEST', ctx.request)
  }
  await next()
}
