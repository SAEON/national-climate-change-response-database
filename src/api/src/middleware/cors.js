import { pool } from '../mssql/pool.js'
import getHostnameFromOrigin from '../lib/get-hostname-from-origin.js'

export default app => async (ctx, next) => {
  const { method, headers } = ctx.req
  const { origin } = headers

  if (origin) {
    const hostname = getHostnameFromOrigin(origin)
    const result = await (await pool.connect()).request().input('hostname', hostname).query(`
      select
        id,
        hostname
      from Tenants
      where hostname = @hostname`)

    const allowed = result.recordset.length
    if (allowed) {
      ctx.set('Access-Control-Allow-Origin', origin)

      /**
       * Add the tenant ID to the request context
       * This should probably be done in create-request-context.js
       * But then there's an additional DB trip
       */
      app.context.tenant = {
        ...result.recordset[0],
      }
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
