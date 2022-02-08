import { createReadStream } from 'fs'
import { basename } from 'path'
import PERMISSIONS from '../user-model/permissions.js'
import { pool } from '../mssql/pool.js'

export default async ctx => {
  const { user } = ctx
  const { ensurePermission } = user
  await ensurePermission({ ctx, permission: PERMISSIONS['create-submission'] })
  const { id = undefined } = ctx.query

  try {
    /**
     * Get path of most recent Excel template
     */
    const filePath = await pool
      .connect()
      .then(pool =>
        id
          ? pool.request().input('id', id).query(`
              select top 1 filePath
              from ExcelSubmissionTemplates
              where id = @id
              order by createdAt desc;`)
          : pool.request().query(`
              select top 1 filePath
              from ExcelSubmissionTemplates
              order by createdAt desc;`)
      )
      .then(result => result.recordset[0].filePath)

    /**
     * Send the file as a download
     */
    ctx.body = createReadStream(filePath)
    ctx.attachment(basename(filePath))
  } catch (error) {
    console.error('Error retrieving Excel template', error.message)
    ctx.throw(404)
  }
}
