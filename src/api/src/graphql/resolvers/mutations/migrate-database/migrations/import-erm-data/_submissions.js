import { makeStreamingPool, pool } from '../../../../../../mssql/pool.js'
import logSql from '../../../../../../lib/log-sql.js'
import makeProjectJson from './_make-project-json.js'
import makeMitigationJson from './_make-mitigation-json.js'
import makeAdaptationJson from './_make-adaptation-json.js'
import sql from './_erm-sql-query.js'

const makeValidationStatus = str => JSON.stringify({ term: str || 'Pending' })

export default async () => {
  try {
    console.info('Seeding system with ERM submissions data')
    const createIterator = makeStreamingPool({ database: 'NCCRD_ERM', batchSize: 1 })

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
        const request = (await pool.connect()).request()
        request.input('_id', _id)
        request.input('userEmailAddress', userEmailAddress)
        request.input('submissionStatus', makeValidationStatus(submissionStatus))
        request.input('submissionComments', submissionComments)
        request.input('submissionType', submissionType)
        request.input('projectJson', makeProjectJson(project))
        request.input('mitigationJson', makeMitigationJson(mitigation))
        request.input('adaptationJson', makeAdaptationJson(adaptation))
        request.input('researchJson', research || JSON.stringify({}))
        request.input('createdAt', new Date(createdAt).toISOString())

        const sql = `
        begin transaction load_erm_data
        begin try

          /* Merge Users */
          merge Users t
          using (
            select '@userEmailAddress' emailAddress
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
            where emailAddress = @userEmailAddress
          ) s on s.userId = t.userId and s.roleId = t.roleId
          when not matched then insert (userId, roleId)
          values (s.userId, s.roleId);

          /* Allow for specifying _id integer */
          set identity_insert submissions on;

          /* Insert Submission */
          merge Submissions t
          using (
            select
              @_id _id,
              '@submissionStatus' submissionStatus,
              '@submissionComments' submissionComments,
              '@submissionType' submissionType,
              '@projectJson' project,
              '@mitigationJson' mitigation,
              '@adaptationJson' adaptation,
              '@researchJson' research,
              1 isSubmitted,
              ( select id from Users where emailAddress = @userEmailAddress ) userId,
              ( select id from Users where emailAddress = @userEmailAddress ) createdBy,
              '@new Date(createdAt).toISOString()' createdAt
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
            t.createdBy = s.createdBy,
            t.createdAt = s.createdAt;
          
          set identity_insert submissions off;
          select id from Submissions where _id = ${_id};
          commit transaction load_erm_data;
        end try
        begin catch
          rollback transaction load_erm_data;
        end catch`

        logSql(sql, 'Import ERM data')
        const result = await request.query(sql)
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
