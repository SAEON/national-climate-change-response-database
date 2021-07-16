import { createReadStream } from 'fs'
import { basename } from 'path'

export default async ctx => {
  const { PERMISSIONS, user, mssql } = ctx
  const { query } = mssql
  const { ensurePermission } = user
  await ensurePermission({ ctx, permission: PERMISSIONS.downloadSubmission })
  const { id } = ctx.query

  if (!id) {
    ctx.response = 400
    return
  }

  try {
    /**
     * Open the most recent template
     */
    const filePath = (
      await query(`
      select top 1
        filePath
      from ExcelSubmissionTemplates
      ${id ? `where id = '${sanitizeSqlValue(id)}'` : ''}
      order by createdAt desc`)
    ).recordset[0].filePath

    /**
     * Get the submission data
     */

    /**
     * Populate the template
     */

    /**
     * Send the file as a download
     */
    ctx.body = createReadStream(filePath)
    ctx.attachment(basename(filePath))
  } catch {
    ctx.response.status = 404
  }
}
