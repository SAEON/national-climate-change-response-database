import { HOSTNAME, DEFAULT_SHORTNAME } from '../../../../config/index.js'
import getHostnameFromOrigin from '../../../../lib/get-hostname-from-origin.js'

export default async (self, args, ctx) => {
  const { pool } = ctx.mssql
  const ipAddress = ctx.request.headers['X-Real-IP'] || ctx.request.ip
  const userAgent = ctx.request.headers['user-agent']
  const origin = ctx.request.headers['origin'] || HOSTNAME
  const hostname_ = getHostnameFromOrigin(origin)

  const tenant = (
    await (await pool.connect()).request().input('hostname', hostname_).query(`
      select
        id,
        hostname,
        isDefault,
        title,
        shortTitle,
        contactEmailAddress,
        coalesce(frontMatter, ( select frontMatter from Tenants where shortTitle = '${DEFAULT_SHORTNAME}' ) ) frontMatter,
        description,
        theme,
        regionId,
        coalesce(logoUrl, ( select logoUrl from Tenants where shortTitle = '${DEFAULT_SHORTNAME}' ) ) logoUrl,
        coalesce(flagUrl, ( select flagUrl from Tenants where shortTitle = '${DEFAULT_SHORTNAME}' ) ) flagUrl
      from Tenants
      where
        hostname = @hostname;`)
  ).recordset[0]

  const {
    id,
    hostname,
    theme,
    title,
    isDefault,
    description,
    contactEmailAddress,
    regionId,
    shortTitle,
    frontMatter,
    logoUrl,
    flagUrl,
  } = tenant || {}

  return {
    id,
    hostname,
    ipAddress,
    userAgent,
    origin,
    isDefault,
    contactEmailAddress,
    regionId,
    title,
    shortTitle,
    frontMatter,
    description,
    logoUrl,
    flagUrl,
    theme,
  }
}
