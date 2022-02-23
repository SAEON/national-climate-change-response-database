import passport from 'koa-passport'

export default async (ctx, next) => passport.authenticate(ctx.tenant.hostname)(ctx, next)
