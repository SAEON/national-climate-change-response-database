import PERMISSIONS from '../../user-model/permissions.js'
import { pool } from '../../mssql/pool.js'
import mssql from 'mssql'
import { normalize, join, sep } from 'path'
import { IMAGES_DIRECTORY } from '../../config.js'
import { createReadStream, createWriteStream, readFileSync } from 'fs'
import sanitize from 'sanitize-filename'
import shp from 'shpjs'

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
  const shapefile = ctx.request.files['geofence']

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
    const newTenantResult = await transaction
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
        output inserted.id
        values (
          @hostname,
          @title,
          @shortTitle,
          @description,
          @theme
        );`)

    const newTenantId = newTenantResult.recordset[0].id

    /**
     * Add the geofence
     */
    if (shapefile) {
      const buffer = readFileSync(shapefile.path)
      const geoJson = await shp(buffer)
      console.log('data', geoJson)
    }

    /**
     * If logo included, copy to the
     * file system and keep track of
     * path
     */
    if (logo) {
      const filename = `logo-${sanitize(hostname)}-${logo.name}`
      const imgUrl = `http/public-image/${filename}`
      const filePath = normalize(join(IMAGES_DIRECTORY, `.${sep}${filename}`))
      const readStream = createReadStream(logo.path)
      const writeStream = createWriteStream(filePath)

      await new Promise((resolve, reject) => {
        readStream
          .pipe(writeStream)
          .on('finish', () => resolve())
          .on('error', () => reject())
      })

      await transaction.request().input('id', newTenantId).input('logoUrl', imgUrl).query(`
        update Tenants
        set logoUrl = @logoUrl
        where id = @id;`)
    }

    /**
     * If flag included, copy to the
     * file system and keep track of
     * path
     */
    if (flag) {
      const filename = `flag-${sanitize(hostname)}-${flag.name}`
      const imgUrl = `http/public-image/${filename}`
      const filePath = normalize(join(IMAGES_DIRECTORY, `.${sep}${filename}`))
      const readStream = createReadStream(flag.path)
      const writeStream = createWriteStream(filePath)

      await new Promise((resolve, reject) => {
        readStream
          .pipe(writeStream)
          .on('finish', () => resolve())
          .on('error', () => reject())
      })

      await transaction.request().input('id', newTenantId).input('flagUrl', imgUrl).query(`
        update Tenants
        set flagUrl = @flagUrl
        where id = @id;`)
    }

    await transaction.commit()

    /**
     * Return the new tenant
     */
    ctx.status = 201
    const tenant = await (
      await pool.connect()
    )
      .request()
      .input('id', newTenantId)
      .query(`select * from Tenants where id = @id`)
      .then(({ recordset: r }) => r[0])

    ctx.body = JSON.stringify(tenant)
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
}
