export default progressData => {
  if (!progressData) {
    return ''
  }

  const sql = `
    insert into [ProgressData] (
      [mitigationId],
      [year],
      [achieved],
      [achievedUnit]
    )
    ${Object.entries(progressData)
      .map(
        ([
          year,
          {
            achieved,
            achievedUnit: { id: vocabularyId, tree },
          },
        ]) => `
          select
            ( select id from #newMitigation ) mitigationId,
            ${year} year,
            ${achieved} achieved,
            (
              select vxt.id
              from Trees t
              join VocabularyXrefTree vxt on vxt.treeId = t.id
              where t.name = '${sanitizeSqlValue(tree) /* eslint-disable-line */}'
              and vxt.vocabularyId = ${vocabularyId}
            ) achievedUnit`
      )
      .join('\n union \n')};`

  return sql
}
