export default energyData => {
  if (!energyData) {
    return ''
  }

  return `
    insert into [EnergyData] (
        [mitigationId],
        [energyType],
        [year],
        [annualKwh],
        [annualKwhPurchaseReduction],
        [notes]
      )
      ${Object.entries(energyData)
        .map(([energyType, info]) =>
          Object.entries(info).map(
            ([year, { annualKwh, annualKwhPurchaseReduction, notes }]) => `
            select
              ( select id from #newMitigation ) mitigationId,
              (
                select vxt.id
                from Trees t
                join VocabularyXrefTree vxt on vxt.treeId = t.id
                join Vocabulary v on v.id = vxt.vocabularyId
                where t.name = 'renewableTypes'
                and v.term = '${sanitizeSqlValue(energyType) /* eslint-disable-line */}' 
              ) energyType,
              ${year} year,
              ${annualKwh} annualKwh,
              ${annualKwhPurchaseReduction} annualKwhPurchaseReduction,
              '${sanitizeSqlValue(notes) /* eslint-disable-line */}' notes`
          )
        )
        .flat()
        .join('\n union \n')};`
}
