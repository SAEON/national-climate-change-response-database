/**
 * TYPE TWO
 *
 * grid {
 *   year {
 *    ... fields
 *   }
 * }
 */
export default ({ endYear, currentYear, grid, field }) => {
  for (let _currentYear = currentYear; _currentYear <= endYear; _currentYear++) {
    const val = grid?.[_currentYear]?.[field]
    if (val) {
      return val
    }
  }

  if (field === 'achievedUnit') {
    return { term: undefined }
  }

  return 0
}
