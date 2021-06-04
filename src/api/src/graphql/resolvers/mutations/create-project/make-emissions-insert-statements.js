export default (emissionsData, i) => {
  if (!emissionsData) {
    return ''
  }

  const EmissionsData = `
    insert into [EmissionsData] (
      [mitigationId],
      [emissionType],
      [year],
      [notes]
    )
    ${Object.entries(emissionsData)
      .map(([emissionType, annualData]) =>
        Object.entries(annualData).map(
          ([year, { notes }]) => `
          select
            ( select id from #newMitigation where i = ${i} ) mitigationId,
            (
              select vxt.id
              from VocabularyTrees t
              join VocabularyXrefTree vxt on vxt.vocabularyTreeId = t.id
              join Vocabulary v on v.id = vxt.vocabularyId
              where t.name = 'emissionTypes'
              and v.term = '${sanitizeSqlValue(emissionType) /* eslint-disable-line */}' 
            ) emissionType,
            ${year} year,
            '${sanitizeSqlValue(notes) /* eslint-disable-line */}' notes`
        )
      )
      .flat()
      .join('\n union \n')};`

  const EmissionsDataXrefVocabTreeX = `
      ${Object.entries(emissionsData)
        .map(
          ([emissionType, annualData]) => `
          insert into
            [EmissionsDataXrefVocabTreeX] (
            [emissionsDataId],
            [chemical],
            [tonnesPerYear]
          )
          ${Object.entries(annualData)
            // eslint-disable-next-line
            .map(([year, { notes, ...chemicals }]) =>
              Object.entries(chemicals).map(
                ([chemical, tonnesPerYear]) => `
                  select
                    ( select
                      id
                      from EmissionsData
                      where year = ${year}
                      and mitigationId = ( select id from #newMitigation where i = ${i} )
                      and emissionType = (
                        select vxt.id
                        from VocabularyTrees t
                        join VocabularyXrefTree vxt on vxt.vocabularyTreeId = t.id
                        join Vocabulary v on v.id = vxt.vocabularyId
                        where t.name = 'emissionTypes'
                        and v.term = '${sanitizeSqlValue(emissionType) /* eslint-disable-line */}' 
                      )
                    ) emissionsDataId,
                    ( select vxt.id
                      from VocabularyTrees t
                      join VocabularyXrefTree vxt on vxt.vocabularyTreeId = t.id
                      join Vocabulary v on v.id = vxt.vocabularyId
                      where t.name = 'emissions'
                      and v.term = '${
                        sanitizeSqlValue(chemical) /* eslint-disable-line */
                      }' ) chemical,
                    '${sanitizeSqlValue(tonnesPerYear) /* eslint-disable-line */}' tonnesPerYear`
              )
            )
            .flat()
            .join('\n union \n')}`
        )
        .flat()
        .join(';')};`

  return [EmissionsData, EmissionsDataXrefVocabTreeX].join('\n')
}
