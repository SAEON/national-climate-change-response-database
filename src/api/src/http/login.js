import passport from 'koa-passport'
import base64url from 'base64url'
import { NCCRD_HOSTNAME, SAEON_AUTH_CLIENT_SCOPES } from '../config.js'

/**
 * If /login is called without a 'redirect'
 * query param, then the result is 'undefined' as
 * a string, which needs to be parsed to be read
 * as undefined as a JavaScript value
 */
export default async (ctx, next) => {
  console.log('This is the login route')
  console.log('session', ctx.session)
  return passport.authenticate('oidc', {
    scope: SAEON_AUTH_CLIENT_SCOPES,
    state: base64url(
      JSON.stringify({
        redirect: ctx.request.query.redirect
          ? ctx.request.query.redirect == 'undefined'
            ? `${NCCRD_HOSTNAME}`
            : ctx.request.query.redirect
          : NCCRD_HOSTNAME,
      })
    ),
  })(ctx, next)
}
