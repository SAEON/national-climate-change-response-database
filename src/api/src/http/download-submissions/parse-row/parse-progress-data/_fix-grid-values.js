import getCellValue from './_get-cell-value.js'

export default ({ calculator }) => {
  const { grid1 = {}, grid2 = {}, startYear: _startYear, endYear: _endYear } = calculator

  const startYear = new Date(_startYear).getFullYear()
  const endYear = new Date(_endYear).getFullYear()
  const yearCount = endYear - startYear + 1
  if (yearCount < 1 || isNaN(yearCount)) return
  const years = new Array(yearCount).fill(null).map((_, i) => [startYear + i, null])

  return {
    grid1: Object.fromEntries(
      years.map(([currentYear]) => [
        currentYear,
        Object.fromEntries(
          ['achieved', 'achievedUnit'].map(field => [
            field,
            field === 'achievedUnit'
              ? getCellValue({
                  endYear,
                  currentYear,
                  field,
                  grid: grid1,
                })
              : parseInt(
                  getCellValue({
                    endYear,
                    currentYear,
                    field,
                    grid: grid1,
                  }),
                  10
                ),
          ])
        ),
      ])
    ),
    grid2: Object.fromEntries(
      years.map(([currentYear]) => [
        currentYear,
        Object.fromEntries(
          ['expenditureZar'].map(field => [
            field,
            parseFloat(
              getCellValue({
                endYear,
                currentYear,
                field,
                grid: grid2,
              }),
              10
            ),
          ])
        ),
      ])
    ),
  }
}
