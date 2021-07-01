import { createReadStream, createWriteStream } from 'fs'
import { join, normalize, sep } from 'path'
import { UPLOADS_DIRECTORY } from '../config.js'
import ensureDirectory from '../lib/ensure-directory.js'
import logSql from '../lib/log-sql.js'

export default async ctx => {
  const { PERMISSIONS, user, mssql } = ctx
  const { query } = mssql
  const { ensurePermission } = user
  await ensurePermission({ ctx, permission: PERMISSIONS.uploadProjectFile })
  const { submissionId } = ctx.query

  if (!submissionId) {
    ctx.status = 400
    return
  }

  const { path, name } = ctx.request.files['upload-project-file']
  const submissionDirectory = normalize(join(UPLOADS_DIRECTORY, `.${sep}${submissionId}`))
  await ensureDirectory(submissionDirectory)
  const filePath = normalize(join(submissionDirectory, `.${sep}${name}`))

  try {
    const readStream = createReadStream(path)
    const writeStream = createWriteStream(filePath)

    await new Promise((resolve, reject) => {
      readStream.pipe(writeStream).on('finish', () => resolve())
      readStream.on('error', error => reject(error))
      writeStream.on('error', error => reject(error))
    })

    /**
     * Register this upload to an in-progress
     * submission, along with the user id
     */
    const sql = `
    insert into WebSubmissionFiles (name, filePath, webSubmissionId, createdBy, createdAt)
    output inserted.id
    values (
      '${sanitizeSqlValue(name)}',
      '${sanitizeSqlValue(filePath)}',
      '${sanitizeSqlValue(submissionId)}',
      ${user.info(ctx).id},
      '${new Date().toISOString()}'
    );`

    logSql(sql, 'Register project upload', true)
    const result = await query(sql)

    ctx.response.status = 201
    ctx.body = result.recordset[0].id
  } catch (error) {
    ctx.response.status = 409
    if (error.message.includes('UNIQUE KEY')) {
      ctx.body = `File already exists ${name}`
    } else {
      ctx.body = error.message
    }
  }
}
