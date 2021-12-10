import passport from 'koa-passport'

export default async (ctx, next) => {
  console.log('This is the redirect route', 'session', ctx.session)
  return passport.authenticate('oidc')(ctx, next)
}
