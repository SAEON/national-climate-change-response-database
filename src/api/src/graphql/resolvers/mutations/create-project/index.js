import logSql from '../../../../lib/log-sql.js'
import filterFormInput from './filter-form-input.js'
import makeInsertStmt from './make-insert-statement.js'

export default async (_, { projectForm, mitigationForms, adaptationForms }, ctx) => {
  const { query } = ctx.mssql
  projectForm = filterFormInput(projectForm)
  mitigationForms = mitigationForms.map(form => filterFormInput(form))
  adaptationForms = adaptationForms.map(form => filterFormInput(form))

  const sql = `
    begin transaction T
    begin try

      -- temp tables
      drop table if exists #newProject;
      create table #newProject(id int);

      -- project
      ${makeInsertStmt({
        table: 'Projects',
        simpleInput: projectForm.simpleInput,
        vocabInput: projectForm.vocabInput,
      })}

      insert into #newProject (id)
      select scope_identity() id;

      -- mitigations
      ${mitigationForms
        .map(({ simpleInput, vocabInput }) => {
          if (!simpleInput.length && !vocabInput.length) return ''

          return `
          ${makeInsertStmt({
            table: 'Mitigations',
            simpleInput: simpleInput,
            vocabInput: vocabInput,
            projectId: true,
          })}`
        })
        .join('\n')}

      -- adaptations
      ${adaptationForms
        .map(({ simpleInput, vocabInput }) => {
          if (!simpleInput.length && !vocabInput.length) return ''

          return `
          ${makeInsertStmt({
            table: 'Adaptations',
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
