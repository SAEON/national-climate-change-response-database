import parse from 'co-body'

export default async (ctx, next) => {
  ctx.body = await parse(ctx)
  await next()
}
