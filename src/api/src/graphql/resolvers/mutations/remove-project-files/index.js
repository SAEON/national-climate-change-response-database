import { unlink } from 'fs'
import logSql from '../../../../lib/log-sql.js'

export default async (self, { ids, submissionId }, ctx) => {
  const { query } = ctx.mssql
  /**
   * Get paths to files that should be deleted
   */
  const findFilesSql = `
   select *
   from WebSubmissionFiles
   where webSubmissionId = '${sanitizeSqlValue(submissionId)}'
   and id in (${ids.join(',')});`

  logSql(findFilesSql, 'Project files')
  const files = await query(findFilesSql)
  const filePaths = files.recordset.map(({ filePath }) => filePath)

  /**
   * First unlink the files
   */
  await Promise.all(
    filePaths.map(
      path =>
        new Promise((resolve, reject) =>
          unlink(path, error => (error ? reject(error) : resolve(path)))
        )
    )
  )

  /**
   * Then delete corresponding
   * database entries
   */
  const deleteFilesSql = `
     delete from WebSubmissionFiles
     where webSubmissionId = '${sanitizeSqlValue(submissionId)}'
     and id in (${ids.join(',')});`

  logSql(deleteFilesSql, 'Delete files SQL')
  await query(deleteFilesSql)

  return { ids }
}
