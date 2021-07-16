import makeProgressData from './_make-progress-data.js'

export default mitigation => {
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
