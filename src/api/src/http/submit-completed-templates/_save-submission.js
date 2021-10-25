import query from '../../mssql/query.js'
import logSql from '../../lib/log-sql.js'

export default async (userId, { project, mitigation = {}, adaptation = {} }) => {
  const sql = `
    merge Submissions t
    using (
      select
        '${sanitizeSqlValue(JSON.stringify(project))}' project,
        '${sanitizeSqlValue(JSON.stringify(mitigation))}' mitigation,
        '${sanitizeSqlValue(JSON.stringify(adaptation))}' adaptation,
        1 isSubmitted,
        '${sanitizeSqlValue(JSON.stringify({ term: 'Pending' }))}' submissionStatus,
        '${sanitizeSqlValue(userId)}'' createdBy,
        '${new Date().toISOString()}' createdAt
    ) s on t.id = null
    when not matched then insert (
      project,
      mitigation,
      adaptation,
      isSubmitted,
      submissionStatus,
      createdBy,
      createdAt
    )
    values (
      s.project,
      s.mitigation,
      s.adaptation,
      s.isSubmitted,
      s.submissionStatus,
      s.createdBy,
      s.createdAt
    )

    output
      $action,
      inserted.id,
      inserted._projectTitle;`

  logSql(sql, 'Save submission (Excel)')
  const response = await query(sql)
  return { ...response.recordset[0] }
}
