import getCurrentDirectory from '../../../../../lib/get-current-directory.js'
import { join } from 'path'
import createPool from '../../../../../mssql/pool.js'
import logSql from '../../../../../lib/log-sql.js'
import { readFile } from 'fs'

const __dirname = getCurrentDirectory(import.meta)

export default async ctx => {
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

  let i = 0

  let iterator = await createIterator(sql)
  while (!iterator.done) {
    console.info('Inserting row from REM', i)
    const { rows, next } = iterator

    for (const {
      title,
      leadAgent,
      hostPartner,
      fundingOrganisation,
      fundingPartner,
      hostOrganisation,
      startYear,
      endYear,
      projectManager,
      description,
      alternativeContact,
      alternativeContactEmail,
      link,
      updatedBy,
      updatedAt,
      validationComments,
      budgetLower,
      budgetUpper,
    } of rows) {
      const sql = `
        begin transaction load_erm_data
        begin try

          /* Merge Users */
          merge Users t
          using (
            select '${updatedBy}' emailAddress
          ) s on s.emailAddress = t.emailAddress
          when not matched then insert (emailAddress)
          values (s.emailAddress);

          /* Make sure Users have correct role */
          merge UserRoleXref t
          using (
            select
            id userId,
            ( select id from Roles where name = 'dffe' ) roleId
            from Users
            where emailAddress = '${updatedBy}'
          ) s on s.userId = t.userId and s.roleId = t.roleId
          when not matched then insert (userId, roleId)
          values (s.userId, s.roleId);

          /* Insert project */
          merge Projects t
          using (
            select
              '${sanitizeSqlValue(title)}' title,
              '${sanitizeSqlValue(leadAgent)}' leadAgent,
              '${sanitizeSqlValue(hostPartner)}' hostPartner,
              '${sanitizeSqlValue(fundingOrganisation)}' fundingOrganisation,
              '${sanitizeSqlValue(fundingPartner)}' fundingPartner,
              '${sanitizeSqlValue(hostOrganisation)}' hostOrganisation,
              '${sanitizeSqlValue(startYear)}' startYear,
              '${sanitizeSqlValue(endYear)}' endYear,
              '${sanitizeSqlValue(projectManager)}' projectManager,
              '${sanitizeSqlValue(description)}' description,
              '${sanitizeSqlValue(alternativeContact)}' alternativeContact,
              '${sanitizeSqlValue(alternativeContactEmail)}' alternativeContactEmail,
              '${sanitizeSqlValue(link)}' link,
              ( select id from Users where emailAddress = '${sanitizeSqlValue(
                updatedBy
              )}' ) updatedBy,
              ( select id from Users where emailAddress = '${sanitizeSqlValue(updatedBy)}' ) userId,
              '${sanitizeSqlValue(new Date(updatedAt).toISOString())}' updatedAt,
              '${sanitizeSqlValue(validationComments)}' validationComments,
              '${sanitizeSqlValue(budgetLower || '')}' budgetLower,
              '${sanitizeSqlValue(budgetUpper || '')}' budgetUpper 
          ) s on s.title = t.title
          when not matched then insert (
            title,
            leadAgent,
            hostPartner,
            fundingOrganisation,
            fundingPartner,
            hostOrganisation,
            startYear,
            endYear,
            projectManager,
            description,
            alternativeContact,
            alternativeContactEmail,
            link,
            updatedBy,
            userId,
            updatedAt,
            validationComments,
            budgetLower,
            budgetUpper            
          ) 
          values (
            s.title,
            s.leadAgent,
            s.hostPartner,
            s.fundingOrganisation,
            s.fundingPartner,
            s.hostOrganisation,
            s.startYear,
            s.endYear,
            s.projectManager,
            s.description,
            s.alternativeContact,
            s.alternativeContactEmail,
            s.link,
            s.updatedBy,
            s.userId,
            s.updatedAt,
            s.validationComments,
            s.budgetLower,
            s.budgetUpper
          );

          select id from Projects where title = '${sanitizeSqlValue(title)}'

          commit transaction load_erm_data;
        end try
        begin catch
          rollback transaction load_erm_data;
        end catch`

      const result = await query(sql)
      if (!result?.recordset?.[0]?.id) {
        logSql(sql)
        process.exit(1)
      }
      i++
    }

    iterator = await next()
  }

  return iterator.result
}
