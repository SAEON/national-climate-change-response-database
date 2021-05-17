export default async ctx => {
  const ipAddress = ctx.request.headers['X-Real-IP'] || ctx.request.ip
  const userAgent = ctx.request.headers['user-agent']
  const origin = ctx.request.headers['origin'] || ''

  console.log(ctx.request.headers)

  ctx.body = {
    ipAddress,
    userAgent,
    origin,
  }
}
