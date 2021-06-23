import getCellValue from './get-cell-value.js'

export default ({ fields, calculator }) => {
  const { grid = {}, startYear: _startYear, endYear: _endYear } = calculator

  try {
    const startYear = new Date(_startYear).getFullYear()
    const endYear = new Date(_endYear).getFullYear()
    const yearCount = endYear - startYear + 1
    const years = new Array(yearCount).fill(null).map((_, i) => [startYear + i, null])

    return Object.entries(grid).reduce((rows, [type, info]) => {
      const row = Object.entries(Object.assign(Object.fromEntries(years), info)).reduce(
        (columns, [currentYear]) => {
          fields.forEach(field => {
            columns[field] += parseInt(
              getCellValue({
                startYear,
                currentYear,
                field,
                type,
                grid,
              }),
              10
            )
          })

          return Object.assign({ id: type, type }, columns)
        },
        Object.fromEntries(fields.map(field => [field, 0]))
      )

      rows.push(row)
      return rows
    }, [])
  } catch {
    return []
  }
}
