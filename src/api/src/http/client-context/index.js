import { NCCRD_HOSTNAME } from '../../config.js'
import { pool } from '../../mssql/pool.js'

export default async ctx => {
  const ipAddress = ctx.request.headers['X-Real-IP'] || ctx.request.ip
  const userAgent = ctx.request.headers['user-agent']
  const origin = ctx.request.headers['origin'] || NCCRD_HOSTNAME

  const tenant = (
    await (await pool.connect()).request().input('hostname', new URL(origin).hostname).query(`
      select
        title,
        shortTitle,
        description,
        theme,
        logoUrl,
        flagUrl
      from Tenants
      where
        hostname = @hostname;`)
  ).recordset[0]

  const { theme, title, description, shortTitle, logoUrl, flagUrl } = tenant || {}

  ctx.body = {
    ipAddress,
    userAgent,
    origin,
    title,
    shortTitle,
    description,
    logoUrl,
    flagUrl,
    theme,
  }
}
