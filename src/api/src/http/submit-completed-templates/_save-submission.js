import { pool } from '../../mssql/pool.js'

export default async (userId, { project, mitigation = {}, adaptation = {} }) =>
  await pool
    .connect()
    .then(pool =>
      pool
        .request()
        .input('project', JSON.stringify(project))
        .input('mitigation', JSON.stringify(mitigation))
        .input('adaptation', JSON.stringify(adaptation))
        .input('submissionStatus', JSON.stringify({ term: 'pending' }))
        .input('createdBy', userId)
        .input('createdAt', new Date().toISOString()).query(`
            merge Submissions t
            using (
              select
                @project project,
                @mitigation mitigation,
                @adaptation adaptation,
                1 isSubmitted,
                @submissionStatus submissionStatus,
                @createdBy createdBy,
                @createdAt createdAt
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
              inserted._projectTitle;`)
    )
    .then(result => ({ ...result.recordset[0] }))
