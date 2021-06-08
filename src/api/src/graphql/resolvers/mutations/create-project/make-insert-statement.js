export default ({ table, simpleInput, vocabInput, projectId = false }) => `
insert into [${table}] (${[
  projectId && 'projectId',
  ...simpleInput.map(([field]) => `[${field}]`),
  ...vocabInput.map(([field]) => `[${field}]`),
]
  .filter(_ => _)
  .join(',')})
values (${[
  projectId && ` (select id from #newProject) `,
  ...simpleInput.map(([key, value]) => {
    if (key === 'yx') {
      return `geometry::STGeomFromText('${value}', 4326)`
    }

    if (key === 'startYear' || key === 'endYear') {
      return new Date(value).getFullYear()
    }

    return `'${sanitizeSqlValue(value)}'` // eslint-disable-line
  }),
  ...vocabInput.map(
    ([field, { tree, term }]) => `(
      select
      vxt.id [${field}]

      from VocabularyTrees t
      join VocabularyXrefTree vxt on vxt.vocabularyTreeId = t.id
      join Vocabulary v on v.id = vxt.vocabularyId

      where
      t.name = '${sanitizeSqlValue(tree) /* eslint-disable-line */}' 
      and v.term = '${sanitizeSqlValue(term) /* eslint-disable-line */}'
    )`
  ),
]
  .filter(_ => _)
  .join(',')});`
