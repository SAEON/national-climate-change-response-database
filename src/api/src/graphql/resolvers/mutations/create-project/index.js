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

const getInsertStmt = (table, simpleInput, vocabInput) => `
  insert into ${table} (${[
  ...simpleInput.map(([field]) => field),
  ...vocabInput.map(([field]) => field),
].join(',')})
  values (${[
    ...simpleInput.map(([, value]) => `'${value}'`),
    ...vocabInput.map(
      ([field, { root, tree, term }]) => `(
        select
        vxv.id ${field}
        from VocabularyXrefVocabulary vxv
        join Vocabulary p on p.id = vxv.parentId
        join Vocabulary c on c.id = vxv.childId
        join VocabularyTrees t on t.id = vxv.vocabularyTreeId
        where
        p.term = '${root}'
        and c.term = '${term}'
        and t.name = '${tree}'
      )`
    ),
  ].join(',')});`

export default async (_, { projectForm, mitigationForms, adaptationForms, researchForms }, ctx) => {
  const { query } = ctx.mssql
  projectForm = filterFormInput(projectForm)
  mitigationForms = mitigationForms.map(form => filterFormInput(form))
  adaptationForms = adaptationForms.map(form => filterFormInput(form))
  researchForms = researchForms.map(form => filterFormInput(form))

  const sql = `
    begin transaction T
    begin try

      -- temp tables
      drop table if exists #newProject;
      create table #newProject(id int);
      drop table if exists #newMitigations;
      create table #newMitigations (i int, id int);
      drop table if exists #newAdaptations;
      create table #newAdaptations (i int, id int);

      -- project
      ${getInsertStmt('Projects', projectForm.simpleInput, projectForm.vocabInput)}
      insert into #newProject (id)
      select scope_identity() id;

      -- mitigations
      ${mitigationForms
        .map(({ simpleInput, vocabInput }, i) => {
          if (!simpleInput.length && !vocabInput.length) return ''

          return `
          ${getInsertStmt('Mitigations', simpleInput, vocabInput)}
          insert into #newMitigations (i, id)
          select
          ${i} i,
          scope_identity() id;`
        })
        .join('\n')}

      -- adaptations
      ${adaptationForms
        .map(({ simpleInput, vocabInput }, i) => {
          if (!simpleInput.length && !vocabInput.length) return ''

          return `
          ${getInsertStmt('Adaptations', simpleInput, vocabInput)}
          insert into #newAdaptations (i, id)
          select
          ${i} i,
          scope_identity() id;`
        })
        .join('\n')}

      -- research
      ${researchForms
        .map(({ simpleInput, vocabInput }) => {
          if (!simpleInput.length && !vocabInput.length) return ''
          return getInsertStmt('Research', simpleInput, vocabInput)
        })
        .join('\n')}

      select id from #newProject;
      commit transaction T
    end try
    begin catch
      rollback transaction T
    end catch`

  const result = await query(sql)
  return { id: result.recordset[0].id }
}