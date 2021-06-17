export const makeProjectInsertStmt = ({
  simpleInput,
  vocabInput,
  projectId = false,
  userId,
  now,
}) => `
    insert into [Projects] (${[
      projectId && 'projectId',
      ...simpleInput.map(([field]) => `[${field}]`),
      ...vocabInput.map(([field]) => `[${field}]`),
      '[userId]',
      '[createdBy]',
      '[createdAt]',
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
      userId,
      userId,
      `'${sanitizeSqlValue(now)}'`, // eslint-disable-line
    ]
      .filter(_ => _)
      .join(',')});`

export const makeMitigationsInsertStmt = ({ simpleInput, vocabInput, projectId = false }) => `
  insert into [Mitigations] (${[
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

export const makeAdaptationsInsertStmt = ({ simpleInput, vocabInput, projectId = false }) => `
  insert into [Adaptations] (${[
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
