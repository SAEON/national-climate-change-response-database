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
const typeOneCalculator = ({ startYear, type, currentYear, grid, field }) => {
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
const typeTwoCalculator = ({ startYear, currentYear, grid, field }) => {
  for (let _currentYear = currentYear; _currentYear >= startYear; _currentYear--) {
    const val = grid?.[_currentYear]?.[field]
    if (val) {
      return val
    }
  }

  if (field === 'achievedUnit') {
    return { term: '(NONE)' }
  }

  return 0
}

export default ({ calculator = 'energy', ...args }) => {
  if (calculator === 'energy') {
    return typeOneCalculator({ ...args })
  }

  if (calculator === 'emissions') {
    return typeOneCalculator({ ...args })
  }

  if (calculator === 'progress') {
    return typeTwoCalculator({ ...args })
  }

  if (calculator === 'expenditure') {
    return typeTwoCalculator({ ...args })
  }
}
