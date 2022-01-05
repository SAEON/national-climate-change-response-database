import base64url from 'base64url'
import { HOSTNAME } from '../config/index.js'

export default async ctx => {
  console.log('this is the login success route')
  console.log('session', ctx.session)
  const { state } = ctx.request.query
  const { redirect } = JSON.parse(base64url.decode(state))
  ctx.redirect(redirect || HOSTNAME)
}
