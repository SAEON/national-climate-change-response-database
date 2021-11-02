import passport from 'koa-passport'
import { pool } from '../../mssql/pool.js'
import mssql from 'mssql'
import { Issuer, Strategy } from 'openid-client'
import base64url from 'base64url'
import { user as userRole } from '../../user-model/roles.js'
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
            console.log('token set', tokenSet)
            const { id_token } = tokenSet
            const { email, sub: saeonId, name } = userInfo
            const emailAddress = email.toLowerCase()

            try {
              const transaction = new mssql.Transaction(await pool.connect())
              await transaction.begin()

              // Create/retrieve user
              const upsertUserQuery = new mssql.PreparedStatement(transaction)
              upsertUserQuery.input('emailAddress', mssql.NVarChar)
              upsertUserQuery.input('saeonId', mssql.NVarChar)
              upsertUserQuery.input('name', mssql.NVarChar)
              upsertUserQuery.input('id_token', mssql.NVarChar)
              await upsertUserQuery.prepare(`
                ;with currentUser as (
                  select
                  @emailAddress emailAddress,
                  @saeonId saeonId,
                  @name name,
                  @id_token id_token
                )
                
                merge Users as target
                using currentUser as source on target.emailAddress = source.emailAddress
                
                when matched then update
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

              await upsertUserQuery
                .execute({
                  emailAddress,
                  name,
                  saeonId,
                  id_token,
                })
                .finally(() => upsertUserQuery.unprepare())

              // Make sure that the user has at least the basic role
              const userXRoleQuery = new mssql.PreparedStatement(transaction)
              userXRoleQuery.input('emailAddress', mssql.NVarChar)
              userXRoleQuery.input('roleName', mssql.NVarChar)
              await userXRoleQuery.prepare(`
                insert into UserRoleXref (userId, roleId)
                select distinct
                  u.id userId,
                  ( select id from Roles r where r.name =  @roleName) roleId
                from Users u
                where
                  u.emailAddress = @emailAddress
                  and not exists (
                    select 1
                    from UserRoleXref
                    where userId = u.id
                  );`)

              await userXRoleQuery
                .execute({
                  emailAddress,
                  roleName: userRole.name,
                })
                .finally(() => userXRoleQuery.unprepare())

              // Get the user back
              const userQuery = new mssql.PreparedStatement(transaction)
              userQuery.input('emailAddress', mssql.NVarChar)
              await userQuery.prepare(`
                select *
                from Users u
                where emailAddress = @emailAddress
                for json auto, without_array_wrapper;`)

              const user = await userQuery
                .execute({ emailAddress })
                .then(async result => result.recordset[0])
                .finally(() => userQuery.unprepare())

              // Commit transaction
              await transaction.commit()

              cb(null, user)
            } catch (error) {
              console.error('Error authenticating user', error)
              cb(error, null)
            }
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
