import { createReadStream } from 'fs'
import { basename } from 'path'

export default async ctx => {
  const { PERMISSIONS, user, mssql } = ctx
  const { query } = mssql
  const { ensurePermission } = user
  await ensurePermission({ ctx, permission: PERMISSIONS.createProject })

  /**
   * Get path of most recent Excel template
   */
  const filePath = (
    await query(`
    select top 1
      filePath
    from ExcelSubmissionTemplates
    order by createdAt desc`)
  ).recordset[0].filePath

  /**
   * Send the file as a download
   */
  ctx.body = createReadStream(filePath)
  ctx.attachment(basename(filePath))
}
