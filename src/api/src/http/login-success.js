import base64url from 'base64url'
import { NCCRD_HOSTNAME } from '../config.js'

export default async ctx => {
  const { state } = ctx.request.query
  const { redirect } = JSON.parse(base64url.decode(state))
  ctx.redirect(redirect || NCCRD_HOSTNAME)
}
