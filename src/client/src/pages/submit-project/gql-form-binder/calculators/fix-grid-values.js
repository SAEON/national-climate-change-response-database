import getCellValue from './get-cell-value.js'

export default ({ fields, calculator }) => {
  const { grid = {}, startYear: _startYear, endYear: _endYear } = calculator

  const startYear = new Date(_startYear).getFullYear()
  const endYear = new Date(_endYear).getFullYear()
  const yearCount = endYear - startYear + 1
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
