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
            achievedUnit: { id: vocabularyId, tree = 'none' }, // TODO - need to change to vxv identifier rather than vxt
          },
        ]) => `
          select
            ( select id from #newMitigation ) mitigationId,
            ${year} year,
            ${achieved} achieved,
            coalesce((
              select vxt.id
              from Trees t
              join VocabularyXrefTree vxt on vxt.treeId = t.id
              where t.name = '${sanitizeSqlValue(tree) /* eslint-disable-line */}'
              and vxt.vocabularyId = ${vocabularyId}
            ), null) achievedUnit`
      )
      .join('\n union \n')};`

  return sql
}
