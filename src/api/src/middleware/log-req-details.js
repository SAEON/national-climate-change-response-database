import { LOG_REQUEST_DETAILS } from '../config/index.js'

export default async (ctx, next) => {
  if (LOG_REQUEST_DETAILS) {
    console.info('REQUEST', ctx.request)
  }
  await next()
}
