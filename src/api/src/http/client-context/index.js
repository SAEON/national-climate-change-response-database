import { HOSTNAME, DEFAULT_SHORTNAME } from '../../config/index.js'
import { pool } from '../../mssql/pool.js'
import getHostnameFromOrigin from '../../lib/get-hostname-from-origin.js'

export default async ctx => {
  const ipAddress = ctx.request.headers['X-Real-IP'] || ctx.request.ip
  const userAgent = ctx.request.headers['user-agent']
  const origin = ctx.request.headers['origin'] || HOSTNAME
  const hostname_ = getHostnameFromOrigin(origin)

  const tenant = (
    await (await pool.connect()).request().input('hostname', hostname_).query(`
      select
        hostname,
        isDefault,
        title,
        shortTitle,
        coalesce(frontMatter, ( select frontMatter from Tenants where shortTitle = '${DEFAULT_SHORTNAME}' ) ) frontMatter,
        description,
        theme,
        coalesce(logoUrl, ( select logoUrl from Tenants where shortTitle = '${DEFAULT_SHORTNAME}' ) ) logoUrl,
        coalesce(flagUrl, ( select flagUrl from Tenants where shortTitle = '${DEFAULT_SHORTNAME}' ) ) flagUrl
      from Tenants
      where
        hostname = @hostname;`)
  ).recordset[0]

  const {
    hostname,
    theme,
    title,
    isDefault,
    description,
    shortTitle,
    frontMatter,
    logoUrl,
    flagUrl,
  } = tenant || {}

  ctx.body = {
    hostname,
    ipAddress,
    userAgent,
    origin,
    isDefault,
    title,
    shortTitle,
    frontMatter,
    description,
    logoUrl,
    flagUrl,
    theme,
  }
}
