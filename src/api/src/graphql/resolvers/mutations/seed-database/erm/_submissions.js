import getCurrentDirectory from '../../../../../lib/get-current-directory.js'
import { join } from 'path'
import createPool from '../../../../../mssql/pool.js'
import logSql from '../../../../../lib/log-sql.js'
import { readFile } from 'fs'
import makeProjectJson from './_make-project-json.js'
import makeMitigationJson from './_make-mitigation-json.js'
import makeAdaptationJson from './_make-adaptation-json.js'

const __dirname = getCurrentDirectory(import.meta)

const makeValidationStatus = str => JSON.stringify({ term: str || 'Pending' })

export default async ctx => {
  try {
    console.info('Seeding system with ERM submissions data')
    const { query } = ctx.mssql
    const createIterator = createPool({ database: 'NCCRD_ERM', batchSize: 1 })

    const sql = await new Promise((resolve, reject) =>
      readFile(join(__dirname, './erm.sql'), (error, data) => {
        if (error) {
          reject(error)
        } else {
          resolve(data.toString('utf8'))
        }
      })
    )

    let iterator = await createIterator(sql)
    while (!iterator.done) {
      const { rows, next } = iterator

      for (const {
        _id,
        submissionStatus,
        submissionComments,
        submissionType,
        project,
        mitigation,
        adaptation,
        research,
        userId: userEmailAddress,
        createdAt,
      } of rows) {
        const sql = `
        begin transaction load_erm_data
        begin try

          /* Merge Users */
          merge Users t
          using (
            select '${sanitizeSqlValue(userEmailAddress)}' emailAddress
          ) s on s.emailAddress = t.emailAddress
          when not matched then insert (emailAddress)
          values (s.emailAddress);

          /* Make sure Users have correct role */
          merge UserXrefRoleXrefTenant t
          using (
            select
              id userId,
              ( select id from Roles where name = 'public' ) roleId
            from Users
            where emailAddress = '${sanitizeSqlValue(userEmailAddress)}'
          ) s on s.userId = t.userId and s.roleId = t.roleId
          when not matched then insert (userId, roleId)
          values (s.userId, s.roleId);

          /* Allow for specifying _id integer */
          set identity_insert submissions on;

          /* Insert Submission */
          merge Submissions t
          using (
            select
              ${_id} _id,
              '${sanitizeSqlValue(makeValidationStatus(submissionStatus))}' submissionStatus,
              '${sanitizeSqlValue(submissionComments)}' submissionComments,
              '${sanitizeSqlValue(submissionType)}' submissionType,
              '${sanitizeSqlValue(makeProjectJson(project))}' project,
              '${sanitizeSqlValue(makeMitigationJson(mitigation))}' mitigation,
              '${sanitizeSqlValue(makeAdaptationJson(adaptation))}' adaptation,
              '${sanitizeSqlValue(research || JSON.stringify({}))}' research,
              1 isSubmitted,
              ( select id from Users where emailAddress = '${sanitizeSqlValue(
                userEmailAddress
              )}' ) userId,
              ( select id from Users where emailAddress = '${sanitizeSqlValue(
                userEmailAddress
              )}' ) createdBy,
              '${sanitizeSqlValue(new Date(createdAt).toISOString())}' createdAt
          ) s on s._id = t._id
          when not matched then insert (
            _id,
            submissionStatus,
            submissionComments,
            submissionType,
            project,
            mitigation,
            adaptation,
            research,
            isSubmitted,
            userId,
            createdBy,
            createdAt
          )
          values (
            s._id,
            s.submissionStatus,
            s.submissionComments,
            s.submissionType,
            s.project,
            s.mitigation,
            s.adaptation,
            s.research,
            s.isSubmitted,
            s.userId,
            s.createdBy,
            s.createdAt
          )
          when matched then update set
            t.submissionStatus = s.submissionStatus,
            t.submissionComments = s.submissionComments,
            t.submissionType = s.submissionType,
            t.project = s.project,
            t.mitigation = s.mitigation,
            t.adaptation = s.adaptation,
            t.research = s.research,
            t.isSubmitted = s.isSubmitted,
            t.userId = s.userId,
            t.createdBy = s.createdBy,
            t.createdAt = s.createdAt;
          
          set identity_insert submissions off;
          select id from Submissions where _id = ${_id};
          commit transaction load_erm_data;
        end try
        begin catch
          rollback transaction load_erm_data;
        end catch`

        logSql(sql, 'Seed ERM data')
        const result = await query(sql)
        if (!result?.recordset?.[0]?.id) {
          throw new Error('Failed ERM insert')
        }
      }

      iterator = await next()
    }
    console.info('ERM seeding complete')
    return iterator.result
  } catch (error) {
    console.error('Seeding ERM data failed', error.message)
    process.exit(1)
  }
}
