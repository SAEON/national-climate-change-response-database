import { createReadStream, createWriteStream } from 'fs'
import { join, normalize, sep } from 'path'
import { UPLOADS_DIRECTORY } from '../../config/index.js'
import ensureDirectory from '../../lib/ensure-directory.js'

const MAX_UPLOAD_SIZE_MB = 10

export default async ctx => {
  const { user } = ctx
  const { pool } = ctx.mssql
  const { submissionId, formName } = ctx.query
  if (!submissionId || !formName) {
    ctx.throw(400)
  }

  const { path, name, size: sizeInBytes } = ctx.request.files['attach-file-to-submission']
  const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2)

  try {
    if (sizeInMB > MAX_UPLOAD_SIZE_MB) {
      throw new Error(`Max upload size (${MAX_UPLOAD_SIZE_MB}MB) exceeded`)
    }

    const submissionDirectory = normalize(
      join(UPLOADS_DIRECTORY, `.${sep}${submissionId}`, `.${sep}${formName}`)
    )
    await ensureDirectory(submissionDirectory)
    const filePath = normalize(join(submissionDirectory, `.${sep}${name}`))

    const readStream = createReadStream(path)
    const writeStream = createWriteStream(filePath)

    await new Promise((resolve, reject) => {
      readStream.pipe(writeStream).on('finish', () => resolve())
      readStream.on('error', error => reject(error))
      writeStream.on('error', error => reject(error))
    })

    ctx.response.status = 201

    /**
     * Register this upload to an in-progress
     * submission, along with the user id
     */
    ctx.body = await pool
      .connect()
      .then(pool =>
        pool
          .request()
          .input('name', name)
          .input('filePath', filePath)
          .input('webSubmissionId', submissionId)
          .input('createdBy', user.info(ctx).id)
          .input('createdAt', new Date().toISOString()).query(`
            insert into WebSubmissionFiles (
              name,
              filePath,
              webSubmissionId,
              createdBy,
              createdAt
            )
            output inserted.id
            values (
              @name,
              @filePath,
              @webSubmissionId,
              @createdBy,
              @createdAt
            );`)
      )
      .then(result => result.recordset[0].id)
  } catch (error) {
    if (error.message.includes('UNIQUE KEY')) {
      ctx.response.status = 409
      ctx.body = `File already exists ${name}`
    } else if (error.message.includes('Max upload size')) {
      ctx.response.status = 413
      ctx.body = error.message
    } else {
      ctx.response.status = 400
      ctx.body = error.message
    }
  }
}
