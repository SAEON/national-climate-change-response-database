import passport from 'koa-passport'
import { pool } from '../../mssql/pool.js'
import mssql from 'mssql'
import logSql from '../../lib/log-sql.js'
import { Issuer, Strategy } from 'openid-client'
import base64url from 'base64url'
import {
  NCCRD_HOSTNAME,
  SAEON_AUTH_CLIENT_SECRET,
  SAEON_AUTH_CLIENT_ID,
  SAEON_AUTH_CLIENT_SCOPES,
  SAEON_AUTH_OAUTH_REDIRECT_ADDRESS,
  SAEON_AUTH_LOGOUT_REDIRECT_ADDRESS,
  SAEON_AUTH_ADDRESS_WELLKNOWN,
} from '../../config.js'

export default () => {
  /**
   * Allowing for the app to be started without
   * authentication makes it easier to setup deployments
   * and incrementally debug
   */
  if (!SAEON_AUTH_CLIENT_ID || !SAEON_AUTH_CLIENT_SECRET) {
    console.info('SAEON OAUTH credentials not provided. Skipping setup')
    return {
      authenticate: ctx => ctx.throw(401),
      login: ctx => ctx.throw(401),
    }
  } else {
    console.info('SAEON OAUTH authentication enabled')
  }

  /**
   * https://codeburst.io/how-to-implement-openid-authentication-with-openid-client-and-passport-in-node-js-43d020121e87
   *
   * This tutorial was helpful in getting openid-client
   * and passport to work together
   */
  try {
    Issuer.discover(SAEON_AUTH_ADDRESS_WELLKNOWN)
      .then(hydra => {
        const client = new hydra.Client({
          client_id: SAEON_AUTH_CLIENT_ID,
          client_secret: SAEON_AUTH_CLIENT_SECRET,
          redirect_uris: [SAEON_AUTH_OAUTH_REDIRECT_ADDRESS],
          post_logout_redirect_uris: [SAEON_AUTH_LOGOUT_REDIRECT_ADDRESS],
          token_endpoint_auth_method: 'client_secret_post',
          response_types: ['code'],
        })

        passport.use(
          'oidc',
          new Strategy({ client }, async (tokenSet, userInfo, cb) => {
            const { id_token } = tokenSet
            const { email, sub: saeonId, name } = userInfo

            const transaction = new mssql.Transaction(await pool.connect())
            await transaction.begin()

            // Create/retrieve user
            const userQuery = new mssql.PreparedStatement(transaction)
            userQuery.input('emailAddress', mssql.NVarChar)
            userQuery.input('saeonId', mssql.NVarChar)
            userQuery.input('name', mssql.NVarChar)
            userQuery.input('id_token', mssql.NVarChar)
            await userQuery.prepare(`
              ;with currentUser as (
                select
                @emailAddress emailAddress,
                @saeonId saeonId,
                @name name,
                @id_token id_token
              )
              merge Users as target
              using currentUser as source on target.emailAddress = source.emailAddress
              when matched and coalesce(target.saeonId, '') <> source.saeonId then update
                set
                  target.saeonId = source.saeonId,
                  target.name = source.name,
                  target.id_token = source.id_token
              when not matched by target then insert (emailAddress, saeonId, name, id_token)
                values (
                  source.emailAddress,
                  source.saeonId,
                  source.name,
                  source.id_token
                );`)

            const userQueryResult = await userQuery.execute({
              emailAddress: email.toLowerCase(),
              name,
              saeonId,
              id_token,
            })

            await userQuery.unprepare()

            console.log('result', userQueryResult)

            // Commit transaction
            await transaction.commit()

            // const result = await query(sql)
            // const user = result.recordset[0]
            // cb(null, user)
            cb(new Error('no user'), null)
          })
        )
      })
      .catch(error => {
        console.error('Unable to configure oauth2 oidc strategy', error)
      })

    passport.serializeUser((user, cb) => cb(null, user))
    passport.deserializeUser((user, cb) => cb(null, user))

    return {
      authenticate: async (ctx, next) => passport.authenticate('oidc')(ctx, next),
      /**
       * If /login is called without a 'redirect'
       * query param, then the result is 'undefined' as
       * a string, which needs to be parsed to be read
       * as undefined as a JavaScript value
       */
      login: async (ctx, next) =>
        passport.authenticate('oidc', {
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
        })(ctx, next),
    }
  } catch (error) {
    console.error('Error setting up passport authentication', error)
  }
}
