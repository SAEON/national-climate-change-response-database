export const createRowIterator = (sheet, topLeft, bottomRight) => {
  const range = sheet.range(topLeft, bottomRight).cells()

  return function iterate(rowNumber = 0) {
    const row = range[rowNumber]
    return {
      next: () => iterate(rowNumber + 1),
      data: row,
      done: !row,
    }
  }
}

const columnToLetter = column => {
  var temp
  var letter = ''
  while (column > 0) {
    temp = column % 26
    letter = String.fromCharCode(temp + 65) + letter
    column = (column - temp - 1) / 26
  }
  return letter
}

const makeProgressData = ({ _progress: _p, _expenditure: _e }) => {
  /**
   * Sort the _progress and _expenditure
   * so that dates are descending
   */
  _p = Object.entries(_p)
    .map(([, data]) => data)
    .sort(({ year: a }, { year: b }) => (a > b ? -1 : a < b ? 1 : 0))
  _e = Object.entries(_e)
    .map(([, data]) => data)
    .sort(({ year: a }, { year: b }) => (a > b ? -1 : a < b ? 1 : 0))

  /**
   * Get min / max year
   * for start / end
   * Default to month = 1
   * (February) to get around
   * UTC/UTC + 2 problems for
   * 1 Jan 00:00
   */
  const startYear = new Date(Math.min(_p[0].year, _e[0].year), 1).toISOString()
  const endYear = new Date(
    Math.max(_p[_p.length - 1].year, _e[_e.length - 1].year),
    1
  ).toISOString()

  return {
    startYear,
    endYear,
    // Progress data
    grid1: Object.fromEntries(
      _p.map(({ year, amount, unit }) => [
        `${year}`,
        { achieved: `${amount}`, achievedUnit: { term: unit } },
      ])
    ),
    // Expenditure data
    grid2: Object.fromEntries(_e.map(({ year, zar }) => [`${year}`, { expenditureZar: `${zar}` }])),
  }
}

const processMitigation = mitigation => {
  const _progress = {}
  const _expenditure = {}
  mitigation = Object.fromEntries(
    Object.entries(mitigation).filter(([field, value]) => {
      if (field.match(/^_progress_calc_year/)) {
        const [fieldNumber] = field.match(/\d$/)
        _progress[fieldNumber] = _progress[fieldNumber] || {}
        _progress[fieldNumber].year = value
        return false
      }

      if (field.match(/^_progress_calc_amount/)) {
        const [fieldNumber] = field.match(/\d$/)
        _progress[fieldNumber] = _progress[fieldNumber] || {}
        _progress[fieldNumber].amount = value
        return false
      }

      if (field.match(/^_progress_calc_unit/)) {
        const [fieldNumber] = field.match(/\d$/)
        _progress[fieldNumber] = _progress[fieldNumber] || {}
        _progress[fieldNumber].unit = value
        return false
      }

      if (field.match(/^_expenditure_calc_year/)) {
        const [fieldNumber] = field.match(/\d$/)
        _expenditure[fieldNumber] = _expenditure[fieldNumber] || {}
        _expenditure[fieldNumber].year = value
        return false
      }

      if (field.match(/^_expenditure_calc_zar/)) {
        const [fieldNumber] = field.match(/\d$/)
        _expenditure[fieldNumber] = _expenditure[fieldNumber] || {}
        _expenditure[fieldNumber].zar = value
        return false
      }
      return true
    })
  )

  mitigation.progressData = makeProgressData({ _progress, _expenditure })
  return mitigation
}

export const createFormIterator = (sheet, startRow, maxRight, invertedIndex) => {
  const index = Object.fromEntries(
    Object.entries(invertedIndex)
      .map(([form, fields]) => Object.entries(fields).map(([field, col]) => [col, { field, form }]))
      .flat()
  )

  return function iterate(currentRow = startRow) {
    /**
     * TODO - delete this to release the multiple parsing
     * functionality
     */
    if (currentRow > startRow) {
      throw new Error('Excel parsing limited to single projects')
    }

    const range = sheet.range(`A${currentRow}`, `${columnToLetter(maxRight + 1)}${currentRow}`)
    const row = range.cells()[0]

    /**
     * Parsing is done when a row with a
     * blank title is found
     */
    const hasData = Boolean(row[0].value())

    /**
     * Convert submission data
     * into JSON suitable for
     * SQL Server
     */
    const submission = hasData
      ? row
          .map((cell, col) => ({
            form: index[col + 1]?.form,
            field: index[col + 1]?.field,
            value: cell.value(),
          }))
          .filter(({ value }) => value)
          .reduce(
            (submission, { form, field, value }) =>
              Object.assign(
                { ...submission },
                { [form]: Object.assign({ ...submission[form] }, { [field]: value }) }
              ),
            {}
          )
      : undefined

    /**
     * The mitigation form needs
     * processing
     */
    if (submission?.mitigation) {
      submission.mitigation = processMitigation(submission.mitigation)
    }

    return {
      next: () => iterate(currentRow + 1),
      submission,
      done: !hasData,
    }
  }
}
