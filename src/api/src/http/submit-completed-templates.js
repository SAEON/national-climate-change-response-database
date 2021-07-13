import { createReadStream, createWriteStream } from 'fs'
import { join, normalize, sep } from 'path'
import { UPLOADS_DIRECTORY } from '../config.js'
import ensureDirectory from '../lib/ensure-directory.js'
import logSql from '../lib/log-sql.js'
import xlsx from 'xlsx-populate'
import { nanoid } from 'nanoid'

const MAX_UPLOAD_SIZE_MB = 20

export default async ctx => {
  const { PERMISSIONS, user, mssql } = ctx
  const { query } = mssql
  const { ensurePermission } = user
  await ensurePermission({ ctx, permission: PERMISSIONS.createSubmission })

  const { path, name, size: sizeInBytes } = ctx.request.files['submit-completed-templates']
  const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2)

  try {
    if (sizeInMB > MAX_UPLOAD_SIZE_MB) {
      throw new Error(`Max upload size (${MAX_UPLOAD_SIZE_MB}MB) exceeded`)
    }

    const submissionDirectory = normalize(
      join(UPLOADS_DIRECTORY, `.${sep}excel-submission`, `.${sep}${nanoid()}`)
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

    /**
     * Load the Excel file
     */
    const workbook = await xlsx.fromFileAsync(filePath)
    console.log(workbook)

    ctx.response.status = 201
    ctx.body = 'TODO'
  } catch (error) {
    ctx.response.status = 404
    ctx.body = 'ERROR'
  }
}
