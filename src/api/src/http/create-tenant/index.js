import { pool } from '../../mssql/pool.js'
import mssql from 'mssql'
import { normalize, join, sep } from 'path'
import { IMAGES_DIRECTORY } from '../../config/index.js'
import { createReadStream, createWriteStream } from 'fs'
import mergeTenantsSubmissions from '../../lib/sql/merge-tenants-submissions.js'
import sanitize from 'sanitize-filename'

/**
 * Creates the new tenant
 */
export default async ctx => {
  const {
    hostname,
    title = null,
    shortTitle = null,
    description = null,
    theme = null,
    geofence: { id: vocabularyTerm = null } = {},
  } = JSON.parse(ctx.request.body.json)

  const logo = ctx.request.files['logo']
  const flag = ctx.request.files['flag']

  /**
   * Insert tenant details
   * into the database as a
   * transaction - the transaction
   * needs the file operations to
   * succeed
   */

  const transaction = new mssql.Transaction(await pool.connect())
  await transaction.begin()

  /**
   * Get the regional geometry ID
   */
  const regionId = await transaction
    .request()
    .input('vocabularyTerm', vocabularyTerm)
    .query(
      `select
        x.regionId
      from Vocabulary v
      join VocabularyXrefRegion x on x.vocabularyId = v.id
      where
        v.term = @vocabularyTerm;`
    )
    .then(({ recordset: r }) => r[0].regionId)

  try {
    const newTenantResult = await transaction
      .request()
      .input('hostname', hostname)
      .input('title', title)
      .input('shortTitle', shortTitle)
      .input('description', description)
      .input('regionId', regionId || null)
      .input('theme', JSON.stringify(theme)).query(`
        insert into Tenants (
          hostname,
          title,
          shortTitle,
          description,
          regionId,
          theme
        )
        output inserted.id
        values (
          @hostname,
          @title,
          @shortTitle,
          @description,
          @regionId,
          @theme
        );`)

    const newTenantId = newTenantResult.recordset[0].id

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

    // Associate existing submissions with the new tenant
    await transaction
      .request()
      .input('tenantId', newTenantId)
      .input('submissionId', null) // This means "all submissions"
      .query(mergeTenantsSubmissions)

    // Commit the transaction
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
    await transaction.rollback()
    if (error.message.includes('Violation of UNIQUE KEY constraint')) {
      ctx.throw(409)
    } else {
      ctx.throw(400)
    }
  }
}
