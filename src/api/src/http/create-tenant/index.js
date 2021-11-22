import PERMISSIONS from '../../user-model/permissions.js'
import { pool } from '../../mssql/pool.js'
import mssql from 'mssql'
import { IMAGES_DIRECTORY } from '../../config.js'
import { nanoid } from 'nanoid'

/**
 * Creates the new tenant
 */
export default async ctx => {
  const { user } = ctx
  const { ensurePermission } = user
  await ensurePermission({ ctx, permission: PERMISSIONS['create-tenant'] })

  const {
    hostname,
    title = null,
    shortTitle = null,
    description = null,
    theme = null,
  } = JSON.parse(ctx.request.body.json)

  const logo = ctx.request.files['logo']
  const flag = ctx.request.files['flag']
  const shapefiles = Object.entries(ctx.request.files)
    .filter(([name]) => name.includes('geofence-'))
    .map(([, file]) => file)

  /**
   * Insert tenant details
   * into the database as a
   * transaction - the transaction
   * needs the file operations to
   * succeed
   */

  const transaction = new mssql.Transaction(await pool.connect())
  await transaction.begin()

  try {
    await transaction
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

    /**
     * If logo included, copy to the
     * file system and keep track of
     * path
     */
    if (logo) {
      // TODO
      console.log('logo', logo)
    }

    /**
     * If flag included, copy to the
     * file system and keep track of
     * path
     */
    if (flag) {
      // TODO
    }

    await transaction.commit()
  } catch (error) {
    console.error('Unable to create tenant', error)
    // Remove logo if added
    // Remove flag if added
    // Remove shapefiles if added

    if (error.message.includes('Violation of UNIQUE KEY constraint')) {
      return (ctx.status = 409)
    } else {
      return (ctx.status = 400)
    }
  }

  ctx.status = 201
}
