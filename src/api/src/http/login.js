import passport from 'koa-passport'
import base64url from 'base64url'
import { HOSTNAME, ODP_AUTH_SCOPES } from '../config/index.js'

/**
 * If /login is called without a 'redirect'
 * query param, then the result is 'undefined' as
 * a string, which needs to be parsed to be read
 * as undefined as a JavaScript value
 */
export default async (ctx, next) =>
  passport.authenticate(ctx.tenant.hostname, {
    scope: ODP_AUTH_SCOPES,
    state: base64url(
      JSON.stringify({
        redirect: ctx.request.query.redirect
          ? ctx.request.query.redirect == 'undefined'
            ? `${HOSTNAME}`
            : ctx.request.query.redirect
          : HOSTNAME,
      })
    ),
  })(ctx, next)
