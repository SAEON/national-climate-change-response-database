import passport from 'koa-passport'
import fetch from 'node-fetch'
import query from '../../mssql/query.js'
import logSql from '../../lib/log-sql.js'
import { OAuth2Strategy } from 'passport-oauth'
import base64url from 'base64url'
import {
  NCCRD_HOSTNAME,
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
          const {
            email: saeonEmail,
            sub: saeonId,
            family_name = '',
            given_name = '',
          } = await fetch(`${SAEON_AUTH_ADDRESS}/userinfo`, {
            headers: {
              Authorization: `bearer ${token}`,
            },
          }).then(res => res.json())

          try {
            const sql = `
              begin transaction T
              begin try
                with currentUser as (
                  select
                  '${sanitizeSqlValue(saeonEmail)}' emailAddress,
                  '${sanitizeSqlValue(saeonId)}' saeonId,
                  '${sanitizeSqlValue(given_name)}' name,
                  '${sanitizeSqlValue(family_name)}' familyName
                )
                merge Users as target
                using currentUser as source on target.emailAddress = source.emailAddress
                when matched and coalesce(target.saeonId, '') <> source.saeonId then update
                  set
                    target.saeonId = source.saeonId,
                    target.name = source.name,
                    target.familyName = source.familyName
                when not matched by target then insert (emailAddress, saeonId, name, familyName)
                  values (
                    source.emailAddress,
                    source.saeonId,
                    source.name,
                    source.familyName
                  );
                  
                insert into UserRoleXref (userId, roleId)
                select distinct
                  u.id userId,
                  ( select id from Roles r where r.name = 'public') roleId
                  from Users u
                where
                  u.emailAddress = '${sanitizeSqlValue(saeonEmail)}'
                  and not exists (
                    select 1
                    from UserRoleXref
                    where userId = u.id
                  );

                select
                *
                from Users u
                where saeonId = '${sanitizeSqlValue(saeonId)}'
                for json auto, without_array_wrapper;

                commit transaction T                
              end try
              begin catch
                  rollback transaction T
              end catch`

            logSql(sql, 'Authenticate user')
            const result = await query(sql)
            const user = result.recordset[0]
            cb(null, user)
          } catch (error) {
            console.error('Error authenticating', error.message)
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
      authenticate: async (ctx, next) => passport.authenticate('provider')(ctx, next),
      login: async (ctx, next) => {
        /**
         * If /http/login is called without a 'redirect'
         * query param, then the result is 'undefined' as
         * a string
         */
        const redirect = ctx.request.query.redirect
          ? ctx.request.query.redirect == 'undefined'
            ? `${NCCRD_HOSTNAME}`
            : ctx.request.query.redirect
          : NCCRD_HOSTNAME

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
