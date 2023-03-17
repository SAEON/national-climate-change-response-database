import fixGridValues from './_fix-grid-values.js'

/**
 * grid1 => progress data
 * grid2 => expenditure data
 *
 * Make sure grid data is sorted
 * in descending years (i.e. most
 * recent year is first)
 */
export default calculator => {
  if (!calculator || !Object.keys(calculator).length) {
    return {}
  }
  try {
    const { grid1, grid2 } = fixGridValues({ calculator })
    const excelFields = {}

    // progress
    Object.entries(grid1)
      .sort(([a], [b]) => {
        a = parseInt(a, 10)
        b = parseInt(b, 10)
        return a > b ? -1 : b > a ? 1 : 0
      })
      .forEach(
        (
          [
            year,
            {
              achieved,
              achievedUnit: { term: unit },
            },
          ],
          i
        ) => {
          const col = i + 1
          const yearField = `_progress_calc_year_${col}`
          const amountField = `_progress_calc_amount_${col}`
          const unitField = `_progress_calc_unit_${col}`
          excelFields[yearField] = year
          excelFields[amountField] = achieved
          excelFields[unitField] = unit
        }
      )

    // expenditure
    Object.entries(grid2)
      .sort(([a], [b]) => {
        a = parseInt(a, 10)
        b = parseInt(b, 10)
        return a > b ? -1 : b > a ? 1 : 0
      })
      .forEach(([year, { expenditureZar }], i) => {
        const col = i + 1
        const yearField = `_expenditure_calc_year_${col}`
        const zarField = `_expenditure_calc_zar_${col}`
        excelFields[yearField] = year
        excelFields[zarField] = expenditureZar
      })

    return excelFields
  } catch (error) {
    console.error(
      'Error parsing progress data for calculator object',
      calculator,
      fixGridValues({ calculator, debug: true })
    )
    throw error
  }
}
