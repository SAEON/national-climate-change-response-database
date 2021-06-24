export default expenditureData => {
  if (!expenditureData) {
    return ''
  }

  const sql = `
    insert into [ExpenditureData] (
      [mitigationId],
      [year],
      [expenditureZar]
    )
    ${Object.entries(expenditureData)
      .map(
        ([year, { expenditureZar }]) => `
          select
            ( select id from #newMitigation ) mitigationId,
            ${year} year,
            ${expenditureZar} expenditureZar`
      )
      .join('\n union \n')};`

  return sql
}
