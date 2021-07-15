import query from '../../mssql/query.js'
import logSql from '../../lib/log-sql.js'

export default async (userId, { project, mitigation = {}, adaptation = {} }) => {
  const sql = `
    merge Submissions t
    using (
      select
        '${JSON.stringify(project)}' project,
        '${JSON.stringify(mitigation)}' mitigation,
        '${JSON.stringify(adaptation)}' adaptation,
        1 isSubmitted,
        '${JSON.stringify({ term: 'Pending' })}' validationStatus,
        ${userId} createdBy,
        '${new Date().toISOString()}' createdAt
    ) s on t.id = null
    when not matched then insert (
      project,
      mitigation,
      adaptation,
      isSubmitted,
      validationStatus,
      createdBy,
      createdAt
    )
    values (
      s.project,
      s.mitigation,
      s.adaptation,
      s.isSubmitted,
      s.validationStatus,
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
