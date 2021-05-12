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

export default async (_, { projectForm, mitigationForms, adaptationForms, researchForms }, ctx) => {
  const { query } = ctx.mssql
  projectForm = filterFormInput(projectForm)
  mitigationForms = mitigationForms.map(form => filterFormInput(form))
  adaptationForms = adaptationForms.map(form => filterFormInput(form))
  researchForms = researchForms.map(form => filterFormInput(form))

  console.log('mitigation forms', JSON.stringify(mitigationForms, null, 2))
  console.log('adaptation forms', adaptationForms)
  console.log('research forms', researchForms)

  const sql = `
  begin transaction T
  begin try

  /**
   * Create a temporary table
   * to hold the projectId,
   * referenced by mitigation
   * and adaptation inserts
   */
  create table #scope(projectId int)

  /**
   * Insert Project
   */

    insert into Projects (${[
      ...projectForm.simpleInput.map(([field]) => field),
      ...projectForm.vocabInput.map(([field]) => field),
    ].join(',')})
    values (${[
      ...projectForm.simpleInput.map(([, value]) => `'${value}'`),
      ...projectForm.vocabInput.map(
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
    ].join(',')});

    /**
     * Keep track of the projectId
     */
    insert into #scope (projectId)
    select scope_identity() projectId;

    /**
     * Insert adaptations
     * Insert mitigations
     * Insert research
     */



    ${mitigationForms.map(({ simpleInput, vocabInput }) => {
      if (!simpleInput.length && !vocabInput.length) {
        return ''
      }

      return `insert into Mitigations (${[
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
      ].join(',')})`
    })}

    /**
     * Return the new project id
     */
    select projectId from #scope;

    commit transaction T
  end try
  begin catch
    rollback transaction T
  end catch`

  console.log('query', sql)

  const result = await query(sql)

  console.log('result', result)

  return { id: 1 }
}
