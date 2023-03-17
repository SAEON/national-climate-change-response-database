import getCellValue from './_get-cell-value.js'
import { debug } from '../../../../lib/logger.js'

export default ({ calculator, debug: logDebug = false }) => {
  try {
    const { grid1 = {}, grid2 = {}, startYear: _startYear, endYear: _endYear } = calculator
    if (logDebug) {
      debug('========= START DEBUG LOG =========')
      debug('grid1', grid1, 'grid2', grid2, '_startYear', _startYear, '_endYear', _endYear)
    }

    const startYear = new Date(_startYear).getFullYear()
    const endYear = new Date(_endYear).getFullYear()
    const yearCount = endYear - startYear + 1
    if (yearCount < 1 || isNaN(yearCount)) {
      if (logDebug) {
        debug('Evaluated to true: yearCount < 1 || isNaN(yearCount). return')
      }
      return
    }
    const years = new Array(yearCount).fill(null).map((_, i) => [startYear + i, null])

    if (logDebug) {
      debug('startYear', startYear, 'endYear', endYear, 'yearCount', yearCount, 'years', years)
    }

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
  } catch (e) {
    throw e
  } finally {
    if (logDebug) {
      debug('========= END DEBUG LOG =========')
    }
  }
}
