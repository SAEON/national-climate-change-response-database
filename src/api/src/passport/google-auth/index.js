import passport from 'koa-passport'
import { collections } from '../../mongo/index.js'
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth'
import base64url from 'base64url'
import {
  NCCRD_API_GOOGLE_CLIENT_SECRET,
  NCCRD_API_GOOGLE_CLIENT_ID,
  NCCRD_API_GOOGLE_OAUTH_REDIRECT_ADDRESS,
  NCCRD_API_ADDRESS,
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
          const { Users } = await collections
          const { _json: googleProfile } = profile

          try {
            cb(
              null,
              (
                await Users.findOneAndUpdate(
                  {
                    username: googleProfile.email,
                  },

                  {
                    $setOnInsert: {
                      username: googleProfile.email,
                    },
                    $set: {
                      google: Object.assign({ accessToken, modifiedAt: new Date() }, googleProfile),
                    },
                    $addToSet: {
                      emails: {
                        email: googleProfile.email,
                        verified: googleProfile.email_verified,
                      },
                    },
                  },
                  {
                    returnOriginal: false,
                    upsert: true,
                  }
                )
              ).value
            )
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
