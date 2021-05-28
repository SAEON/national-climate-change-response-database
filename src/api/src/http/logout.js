import { NCCRD_HOSTNAME } from '../config.js'

export default async ctx => {
  const { redirect = NCCRD_HOSTNAME } = ctx.request.query
  ctx.session = null
  ctx.redirect(redirect)
}
