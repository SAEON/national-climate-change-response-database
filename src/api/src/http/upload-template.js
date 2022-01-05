import { createReadStream, createWriteStream, stat } from 'fs'
import { join, normalize, sep } from 'path'
import { SUBMISSION_TEMPLATES_DIRECTORY } from '../config/index.js'
import PERMISSIONS from '../user-model/permissions.js'
import { pool } from '../mssql/pool.js'

const MAX_UPLOAD_SIZE_MB = 5

export default async ctx => {
  const { user } = ctx
  const { ensurePermission } = user
  await ensurePermission({ ctx, permission: PERMISSIONS['upload-template'] })

  const { path, name, size: sizeInBytes } = ctx.request.files['excel-submission-template']
  const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2)

  const filePath = normalize(join(SUBMISSION_TEMPLATES_DIRECTORY, `.${sep}${name}`))

  try {
    if (sizeInMB > MAX_UPLOAD_SIZE_MB) {
      throw new Error(`Max upload size (${MAX_UPLOAD_SIZE_MB}MB) exceeded`)
    }

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
    await pool.connect().then(pool =>
      pool
        .request()
        .input('filePath', filePath)
        .input('createdBy', user.info(ctx).id)
        .input('createdAt', new Date().toISOString()).query(`
            insert into ExcelSubmissionTemplates (filePath, createdBy, createdAt)
            values ( @filePath, @createdBy, @createdAt);`)
    )

    ctx.response.status = 201
    ctx.body = 'File upload successful'
  } catch (error) {
    if (error.message.includes('Max upload size')) {
      ctx.response.status = 413
      ctx.body = error.message
    } else {
      ctx.response.status = 409
      ctx.body = error.message
    }
  }
}
