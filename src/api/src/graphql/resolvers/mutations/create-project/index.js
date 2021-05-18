import { format } from 'sql-formatter'

const filterFormInput = form => {
  return Object.entries(form)
    .filter(([, value]) => value)
    .reduce(
      (entries, [key, value]) => {
        if (Object.prototype.toString.call(value) === '[object Object]') {
          entries.vocabInput.push([key, value])
        } else {
          entries.simpleInput.push([key, value])
        }
        return entries
      },
      { simpleInput: [], vocabInput: [] }
    )
}

const getSanitizedInsertStmt = ({ table, simpleInput, vocabInput, projectId = false }) => `
  insert into [${table}] (${[
  projectId && 'projectId',
  ...simpleInput.map(([field]) => `[${field}]`),
  ...vocabInput.map(([field]) => `[${field}]`),
]
  .filter(_ => _)
  .join(',')})
  values (${[
    projectId && ` (select id from #newProject) `,
    ...simpleInput.map(
      ([, value]) => `'${typeof value === 'string' ? value.replaceAll("'", "''") : value}'`
    ),
    ...vocabInput.map(
      ([field, { root, tree, term }]) => `(
        select
        vxv.id [${field}]
        from VocabularyXrefVocabulary vxv
        join Vocabulary p on p.id = vxv.parentId
        join Vocabulary c on c.id = vxv.childId
        join VocabularyTrees t on t.id = vxv.vocabularyTreeId
        where
        p.term = '${root.replaceAll("'", "''")}'
        and c.term = '${term.replaceAll("'", "''")}'
        and t.name = '${tree.replaceAll("'", "''")}'
      )`
    ),
  ]
    .filter(_ => _)
    .join(',')});`

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
      ${getSanitizedInsertStmt({
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
          ${getSanitizedInsertStmt({
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
          ${getSanitizedInsertStmt({
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

  console.info('\nSQL Query', `\n\n${format(sql, { language: 'tsql' })}\n`)

  const result = await query(sql)
  return { id: result.recordset[0].id }
}
