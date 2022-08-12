import getCellValue from './get-cell-value.js'

/**
 * TYPE ONE
 *
 * grid {
 *   type {
 *     year {
 *       ... fields
 *     }
 *   }
 * }
 */
const type1 = ({ fields, calculator }) => {
  const { grid = {}, startYear: _startYear, endYear: _endYear } = calculator

  const startYear = new Date(_startYear).getFullYear()
  const endYear = new Date(_endYear).getFullYear()
  const yearCount = endYear - startYear + 1
  if (yearCount < 1 || isNaN(yearCount)) return
  const years = new Array(yearCount).fill(null).map((_, i) => [startYear + i, null])

  return Object.fromEntries(
    Object.entries(grid).map(([type, info]) => [
      type,
      Object.fromEntries(
        Object.entries(Object.assign(Object.fromEntries(years), info)).map(([currentYear]) => [
          currentYear,
          Object.fromEntries(
            fields.map(field => [
              field,
              field === 'notes'
                ? grid[type][currentYear]?.notes || ''
                : parseInt(
                    getCellValue({
                      startYear,
                      currentYear,
                      field,
                      type,
                      grid,
                    }),
                    10
                  ),
            ])
          ),
        ])
      ),
    ])
  )
}

/**
 * PROGRESS CALCULATORS
 * {
 *   grid1 {
 *     year {
 *      ... fields
 *     }
 *   }
 *
 *   grid2 {
 *     year {
 *       ... fields
 *     }
 *   }
 * }
 */

const fixProgressCalculatorGrids = ({ calculator }) => {
  const { grid1 = {}, grid2 = {}, startYear: _startYear, endYear: _endYear } = calculator

  const startYear = new Date(_startYear).getFullYear()
  const endYear = new Date(_endYear).getFullYear()
  const yearCount = endYear - startYear + 1
  if (yearCount < 1 || isNaN(yearCount)) return
  const years = new Array(yearCount).fill(null).map((_, i) => [startYear + i, null])

  return {
    /**
     * Project achievement
     * fields:
     *   - achieved
     *   - achievedUnit
     */
    grid1: Object.fromEntries(
      years.map(([currentYear]) => [
        currentYear,
        Object.fromEntries(
          ['achieved', 'achievedUnit'].map(field => [
            field,
            field === 'achievedUnit'
              ? getCellValue({
                  calculator: 'progress',
                  endYear,
                  currentYear,
                  field,
                  grid: grid1,
                })
              : parseInt(
                  getCellValue({
                    calculator: 'progress',
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
    /**
     * Expenditure
     * fields:
     *   - expenditureZar
     */
    grid2: Object.fromEntries(
      years.map(([currentYear]) => [
        currentYear,
        Object.fromEntries(
          ['expenditureZar'].map(field => [
            field,
            parseFloat(
              getCellValue({
                calculator: 'progress',
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

export default ({ calculatorType = 'type1', ...args }) => {
  if (calculatorType === 'type1') {
    return type1({ ...args })
  }

  if (calculatorType === 'progress') {
    return fixProgressCalculatorGrids({ ...args })
  }
}
