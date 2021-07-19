export default ({ _progress: _p, _expenditure: _e }) => {
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
