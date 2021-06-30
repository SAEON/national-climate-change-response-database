import { createReadStream, createWriteStream, stat } from 'fs'
import { join, normalize, sep } from 'path'
import { UPLOADS_DIRECTORY } from '../config.js'
import { format } from 'date-fns'

export default async ctx => {
  const { PERMISSIONS, user, mssql } = ctx
  const { query } = mssql
  const { ensurePermission } = user
  await ensurePermission({ ctx, permission: PERMISSIONS.createProject })

  const { path, name } = ctx.request.files['upload-project-file']
  const filePath = normalize(join(UPLOADS_DIRECTORY, `.${sep}${name}`))

  try {
    const readStream = createReadStream(path)
    const writeStream = createWriteStream(filePath)

    await new Promise((resolve, reject) => {
      readStream.pipe(writeStream).on('finish', () => resolve())
      readStream.on('error', error => reject(error))
      writeStream.on('error', error => reject(error))
    })

    /**
     * Register this file in the DB, along with
     * the in-progress-project and user
     */
    // await query(`
    //   insert into ExcelSubmissionTemplates (filePath, createdBy, createdAt)
    //   values (
    //     '${sanitizeSqlValue(filePath)}',
    //     ${user.info(ctx).id},
    //     '${new Date().toISOString()}'
    //   );`)

    ctx.response.status = 201
    ctx.body = 'File upload successful'
  } catch (error) {
    ctx.response.status = 409
    ctx.body = error.message
  }
}
