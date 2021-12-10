import passport from 'koa-passport'

export default async (ctx, next) => {
  console.log('This is the redirect route')
  console.log('session', ctx.session)
  return passport.authenticate('oidc')(ctx, next)
}
