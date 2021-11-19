import PERMISSIONS from '../../user-model/permissions.js'
import { pool } from '../../mssql/pool.js'

export default async ctx => {
  const { user } = ctx
  const { ensurePermission } = user
  await ensurePermission({ ctx, permission: PERMISSIONS['create-tenant'] })
  const {
    hostname,
    title = null,
    shortTitle = null,
    description = null,
    flag = null,
    logo = null,
    shapefiles = null,
    theme = null,
  } = ctx.request.body

  const result = await (await pool.connect())
    .request()
    .input('hostname', hostname)
    .input('title', title)
    .input('shortTitle', shortTitle)
    .input('description', description)
    .input('logoImagePath', null)
    .input('fileImagePath', null)
    .input('geofence', null)
    .input('theme', JSON.stringify(theme)).query(`
      insert into Tenants (
        hostname,
        title,
        shortTitle,
        description,
        theme,
        logoImagePath,
        fileImagePath,
        geofence
      )
      output inserted.*
      values (
        @hostname,
        @title,
        @shortTitle,
        @description,
        @theme,
        @logoImagePath,
        @fileImagePath,
        @geofence
      );`)

  await new Promise(res => setTimeout(res, 5000))

  ctx.body = result.recordset[0]
}
