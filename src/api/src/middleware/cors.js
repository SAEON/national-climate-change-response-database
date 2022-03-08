import { pool } from '../mssql/pool.js'
import getHostnameFromOrigin from '../lib/get-hostname-from-origin.js'

/**
 * Since CORS is configured via a DB query,
 * the tenant is appended to the ctx object here
 * to prevent an extra DB trip
 */

export default app => async (ctx, next) => {
  const { method, headers } = ctx.req
  const { origin, referer } = headers

  const hostname = getHostnameFromOrigin(origin || referer)
  const allowed = await (await pool.connect()).request().input('hostname', hostname).query(`
      select
        id,
        hostname
      from Tenants
      where
        hostname = @hostname;`)

  if (allowed.recordset.length) {
    ctx.set('Access-Control-Allow-Origin', origin)
  }

  app.context.tenant = {
    ...(allowed.recordset[0] ||
      (
        await (await pool.connect()).request().query(`
          select
            id,
            hostname
          from Tenants
          where
            isDefault = 1;`)
      ).recordset[0]),
  }

  ctx.set('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  ctx.set('Access-Control-Allow-Credentials', true)
  ctx.set(
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, credentials, Authorization'
  )

  if (method === 'OPTIONS') {
    ctx.status = 200
  } else {
    await next()
  }
}
