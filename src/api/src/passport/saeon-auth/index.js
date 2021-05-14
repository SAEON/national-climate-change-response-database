import passport from 'koa-passport'
import fetch from 'node-fetch'
import query from '../../mssql/query.js'
import { OAuth2Strategy } from 'passport-oauth'
import base64url from 'base64url'
import {
  NCCRD_API_ADDRESS,
  SAEON_AUTH_CLIENT_SECRET,
  SAEON_AUTH_CLIENT_ID,
  SAEON_AUTH_CLIENT_SCOPES,
  SAEON_AUTH_OAUTH_REDIRECT_ADDRESS,
  SAEON_AUTH_ADDRESS,
} from '../../config.js'

export default () => {
  if (SAEON_AUTH_CLIENT_ID && SAEON_AUTH_CLIENT_SECRET) {
    console.info('SAEON OAUTH authentication enabled')

    passport.use(
      'provider',
      new OAuth2Strategy(
        {
          tokenURL: `${SAEON_AUTH_ADDRESS}/oauth2/token`,
          authorizationURL: `${SAEON_AUTH_ADDRESS}/oauth2/auth`,
          clientID: SAEON_AUTH_CLIENT_ID,
          clientSecret: SAEON_AUTH_CLIENT_SECRET,
          callbackURL: SAEON_AUTH_OAUTH_REDIRECT_ADDRESS,
        },
        async (token, tokenSecret, _, cb) => {
          const { email: saeonEmail, sub: saeonId } = await fetch(
            `${SAEON_AUTH_ADDRESS}/userinfo`,
            {
              headers: {
                Authorization: `bearer ${token}`,
              },
            }
          ).then(res => res.json())

          try {
            await query(`
              with currentUser as (
                select
                '${saeonEmail}' emailAddress,
                '${saeonId}' saeonId
              )
              
              merge Users as target
              using currentUser as source
              on target.emailAddress = source.emailAddress
              
              when matched and coalesce(target.saeonId, '') <> source.saeonId
              then update set target.saeonId = source.saeonId
              
              when not matched by target
              then insert (emailAddress, saeonId) values (source.emailAddress, source.saeonId);`)

            const user = (
              await query(`
                select
                u.*,
                roles.roleId id
                from Users u
                join UserRoleXref roles on roles.userId = u.id
                where saeonId = '${saeonId}'
                for json auto, without_array_wrapper;
              `)
            ).recordset[0]

            cb(null, user)
          } catch (error) {
            cb(error, null)
          }
        }
      )
    )

    passport.serializeUser((user, cb) => {
      cb(null, user)
    })

    passport.deserializeUser((user, cb) => {
      cb(null, user)
    })

    return {
      authenticate: async (ctx, next) => {
        return passport.authenticate('provider')(ctx, next)
      },
      login: async (ctx, next) => {
        /**
         * If /http/login/google is called without a 'redirect'
         * query param, then the result is 'undefined' as
         * a string
         */
        const redirect = ctx.request.query.redirect
          ? ctx.request.query.redirect == 'undefined'
            ? `${NCCRD_API_ADDRESS}`
            : ctx.request.query.redirect
          : NCCRD_API_ADDRESS

        return passport.authenticate('provider', {
          scope: SAEON_AUTH_CLIENT_SCOPES.split(','),
          state: base64url(JSON.stringify({ redirect })),
        })(ctx, next)
      },
    }
  } else {
    console.info('SAEON OAUTH credentials not provided. Skipping setup')
    return {
      authenticate: ctx => ctx.throw(401),
      login: ctx => ctx.throw(401),
    }
  }
}
