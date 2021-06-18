import { createReadStream, createWriteStream, stat } from 'fs'
import { join, normalize, sep } from 'path'
import { SUBMISSION_TEMPLATES_DIRECTORY } from '../config.js'

export default async ctx => {
  const { PERMISSIONS, user, mssql } = ctx
  const { query } = mssql
  const { ensurePermission } = user
  await ensurePermission({ ctx, permission: PERMISSIONS.uploadTemplate })

  const { path, name } = ctx.request.files['project-upload-excel-template']
  const filePath = normalize(join(SUBMISSION_TEMPLATES_DIRECTORY, `.${sep}${name}`))

  try {
    /**
     * The file must not exist. Therefore the stat() fn call
     * MUST fail for this to be a valid upload
     */
    await new Promise((resolve, reject) => {
      stat(filePath, error => {
        if (error) {
          resolve(false)
        } else {
          reject(
            new Error(
              'This file already exists. Please include the upload date in the file name so that versions can be identified uniquely'
            )
          )
        }
      })
    })

    const readStream = createReadStream(path)
    const writeStream = createWriteStream(filePath)

    await new Promise((resolve, reject) => {
      readStream.pipe(writeStream).on('finish', () => resolve())
      readStream.on('error', error => reject(error))
      writeStream.on('error', error => reject(error))
    })

    /**
     * Register this template in the DB
     * This allows for determining which is the
     * correct template users must download and
     * keeping track of old templates
     */
    await query(`
      insert into ExcelSubmissionTemplates (filePath, createdBy, createdAt)
      values (
        '${sanitizeSqlValue(filePath)}',
        ${user.info(ctx).id},
        '${new Date().toISOString()}'
      );`)

    ctx.response.status = 201
    ctx.body = 'File upload successful'
  } catch (error) {
    ctx.response.status = 409
    ctx.body = error.message
  }
}
