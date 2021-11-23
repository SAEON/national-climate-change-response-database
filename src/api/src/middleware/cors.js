import { pool } from '../mssql/pool.js'

export default async (ctx, next) => {
  const { method, headers } = ctx.req
  const { origin } = headers

  if (origin) {
    const result = await (await pool.connect())
      .request()
      .input('hostname', new URL(origin).hostname)
      .query(`select hostname from Tenants where hostname = @hostname`)

    const allowed = result.recordset.length
    if (allowed) {
      ctx.set('Access-Control-Allow-Origin', origin)
    }
  }

  ctx.set('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')

  ctx.set(
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, credentials, Authorization'
  )

  ctx.set('Access-Control-Allow-Credentials', true)

  if (method === 'OPTIONS') {
    ctx.status = 200
  } else {
    await next()
  }
}
