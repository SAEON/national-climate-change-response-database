import logSql from '../../../../lib/log-sql.js'
import filterFormInput from './filter-form-input.js'
import {
  makeAdaptationsInsertStmt,
  makeProjectInsertStmt,
  makeMitigationsInsertStmt,
} from './make-insert-statements.js'
import makeEnergyInsertStmt from './make-energy-insert-statement.js'
import makeEmissionsInsertStmts from './make-emissions-insert-statements.js'

export default async (_, { projectForm, mitigationForms, adaptationForms }, ctx) => {
  const { user, mssql, PERMISSIONS } = ctx
  const { query } = mssql

  await user.ensurePermission({ ctx, permission: PERMISSIONS.createProject })
  const userId = user.info(ctx).id
  const now = new Date().toISOString()

  projectForm = filterFormInput(projectForm)
  mitigationForms = mitigationForms.map(form => filterFormInput(form))
  adaptationForms = adaptationForms.map(form => filterFormInput(form))

  const sql = `
    begin transaction T
    begin try

      -- temp tables
      drop table if exists #newProject;
      create table #newProject(id int);
      drop table if exists #newMitigation;
      create table #newMitigation(id int, i int);

      -- project
      ${makeProjectInsertStmt({
        simpleInput: projectForm.simpleInput,
        vocabInput: projectForm.vocabInput,
        userId,
        now,
      })}

      insert into #newProject (id)
      select scope_identity() id;

      -- mitigations
      ${mitigationForms
        .map(({ simpleInput, vocabInput, energyData, emissionsData }, i) => {
          if (!simpleInput.length && !vocabInput.length) return ''

          return `
            ${makeMitigationsInsertStmt({
              simpleInput: simpleInput,
              vocabInput: vocabInput,
              projectId: true,
            })}
            
            insert into #newMitigation (id, i)
            select
              scope_identity() id,
              ${i} i;
              
            ${makeEnergyInsertStmt(energyData, i)}
            ${makeEmissionsInsertStmts(emissionsData, i)}`
        })
        .join('\n')}

      -- adaptations
      ${adaptationForms
        .map(({ simpleInput, vocabInput }) => {
          if (!simpleInput.length && !vocabInput.length) return ''

          return `
          ${makeAdaptationsInsertStmt({
            simpleInput: simpleInput,
            vocabInput: vocabInput,
            projectId: true,
          })}`
        })
        .join('\n')}

      select id from #newProject;
      commit transaction T
    end try
    begin catch
      rollback transaction T
    end catch`

  logSql(sql, 'Create project')

  const result = await query(sql)
  return { id: result.recordset[0].id }
}
