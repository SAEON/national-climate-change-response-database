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
const type1 = ({ startYear, type, currentYear, grid, field }) => {
  if (field === 'notes') {
    return grid?.[type]?.[currentYear]?.[field] || ''
  }

  for (let _currentYear = currentYear; _currentYear >= startYear; _currentYear--) {
    const val = grid?.[type]?.[_currentYear]?.[field]
    if (val) {
      return val
    }
  }

  return 0
}

/**
 * TYPE TWO
 *
 * grid {
 *   year {
 *    ... fields
 *   }
 * }
 */
const type2 = ({ endYear, currentYear, grid, field }) => {
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

export default ({ calculator = 'type1', ...args }) => {
  if (calculator === 'type1') {
    return type1({ ...args })
  }

  if (calculator === 'progress') {
    return type2({ ...args })
  }

  if (calculator === 'expenditure') {
    return type2({ ...args })
  }
}
