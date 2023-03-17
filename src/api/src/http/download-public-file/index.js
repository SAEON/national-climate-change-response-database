import { pool } from '../../mssql/pool.js'
import { createReadStream } from 'fs'
import { basename } from 'path'
import logger from '../../lib/logger.js'

export default async ctx => {
  const { fileId } = ctx.query

  if (!fileId) {
    ctx.throw(400)
  }

  try {
    // Get the file path
    const filePath = (
      await (await pool.connect())
        .request()
        .input('fileId', fileId)
        .query(`select filePath from WebSubmissionFiles where id = @fileId`)
    ).recordset[0].filePath

    // Stream the file to the client
    ctx.body = createReadStream(filePath)
    ctx.attachment(basename(filePath))
  } catch (error) {
    logger.error('Error retrieving submission file', error.message)
    ctx.throw(404)
  }
}
