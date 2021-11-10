import AchievementTable from './_achievement'
import ExpenditureTable from './_expenditure'
import getCellValue from '../../get-cell-value.js'

export default ({ calculator, updateCalculator }) => {
  const { startYear = null, endYear = null, grid1 = {}, grid2 = {} } = calculator

  if (!startYear || !endYear) return null
  const _start = new Date(startYear).getFullYear()
  const _end = new Date(endYear).getFullYear()
  const yearCount = _end - _start + 1
  if (yearCount < 1) return null

  const years = new Array(yearCount)
    .fill(null)
    .map((_, i) => _start + i)
    .reverse()

  return (
    <div>
      {/* SECTOR ACHIEVEMENTS CALCULATOR */}
      <AchievementTable
        endYear={_end}
        grid1={grid1}
        calculator={calculator}
        updateCalculator={updateCalculator}
        years={years}
      />

      {/* EXPENDITURE CALCULATOR */}
      <ExpenditureTable
        grid2={grid2}
        calculator={calculator}
        updateCalculator={updateCalculator}
        rows={years.map(year => ({
          id: year,
          year,
          expenditureZar: getCellValue({
            calculator: 'expenditure',
            endYear: _end,
            currentYear: year,
            grid: grid2,
            field: 'expenditureZar',
          }),
        }))}
      />
    </div>
  )
}
