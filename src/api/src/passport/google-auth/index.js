import passport from 'koa-passport'
import query from '../../mssql/query.js'
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth'
import base64url from 'base64url'
import {
  NCCRD_API_ADDRESS,
  NCCRD_API_GOOGLE_CLIENT_SECRET,
  NCCRD_API_GOOGLE_CLIENT_ID,
  NCCRD_API_GOOGLE_OAUTH_REDIRECT_ADDRESS,
} from '../../config.js'

export default () => {
  if (NCCRD_API_GOOGLE_CLIENT_ID && NCCRD_API_GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: NCCRD_API_GOOGLE_CLIENT_ID,
          clientSecret: NCCRD_API_GOOGLE_CLIENT_SECRET,
          callbackURL: NCCRD_API_GOOGLE_OAUTH_REDIRECT_ADDRESS,
        },
        async (accessToken, refreshToken, profile, cb) => {
          const { _json: googleProfile } = profile

          try {
            await query(`
              with currentUser as (
                select
                '${googleProfile.email}' emailAddress,
                '${googleProfile.sub}' googleId
              )
              
              merge Users as target
              using currentUser as source
              on target.emailAddress = source.emailAddress
              
              when matched and coalesce(target.googleId, '') <> source.googleId
              then update set target.googleId = source.googleId
              
              when not matched by target
              then insert (emailAddress, googleId) values (source.emailAddress, source.googleId);`)

            const user = (
              await query(`
                select
                u.*,
                roles.roleId id
                from Users u
                join UserRoleXref roles on roles.userId = u.id
                where googleId = '${googleProfile.sub}'
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
      authenticate: passport.authenticate('google'),
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

        return passport.authenticate('google', {
          scope: ['email'],
          prompt: 'select_account',
          state: base64url(JSON.stringify({ redirect })),
        })(ctx, next)
      },
    }
  } else {
    console.info('Google API OAUTH credentials not provided. Skipping setup')
    return {
      authenticate: ctx => ctx.throw(401),
      login: ctx => ctx.throw(401),
    }
  }
}
