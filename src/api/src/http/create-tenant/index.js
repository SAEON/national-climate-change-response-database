import PERMISSIONS from '../../user-model/permissions.js'
import { pool } from '../../mssql/pool.js'
import { IMAGES_DIRECTORY } from '../../config.js'

/**
 * Creates the new tenant
 */
export default async ctx => {
  const { user } = ctx
  const { ensurePermission } = user
  await ensurePermission({ ctx, permission: PERMISSIONS['create-tenant'] })

  const logo = ctx.request.files['logo']
  const flag = ctx.request.files['flag']
  const shapefiles = Object.entries(ctx.request.files)
    .filter(([name]) => name.includes('geofence-'))
    .map(([, file]) => file)

  /**
   * If logo included, copy to the
   * file system and keep track of
   * path
   */
  if (logo) {
    // TODO
  }

  /**
   * If flag included, copy to the
   * file system and keep track of
   * path
   */
  if (flag) {
    // TODO
  }

  const {
    hostname,
    title = null,
    shortTitle = null,
    description = null,
    theme = null,
  } = JSON.parse(ctx.request.body.json)

  await (await pool.connect())
    .request()
    .input('hostname', hostname)
    .input('title', title)
    .input('shortTitle', shortTitle)
    .input('description', description)
    .input('theme', JSON.stringify(theme)).query(`
      insert into Tenants (
        hostname,
        title,
        shortTitle,
        description,
        theme
      )
      output inserted.*
      values (
        @hostname,
        @title,
        @shortTitle,
        @description,
        @theme
      );`)

  ctx.status = 201
}
