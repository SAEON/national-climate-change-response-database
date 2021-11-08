import { stringify } from 'wkt'

export default form => {
  return Object.fromEntries(
    Object.entries(form)
      .map(([field, value]) => {
        /**
         * Fields that start with
         * "__" should NOT be synced
         * to the database
         */
        if (field.match(/^__/)) {
          return null
        }

        if (field === 'yx') {
          return [
            field,
            stringify({
              type: 'GeometryCollection',
              geometries: (value || []).map(([x, y]) => ({ type: 'Point', coordinates: [y, x] })),
            }),
          ]
        }

        /**
         * All dynamic values that the grid displays
         * need to be explicitly set before being
         * submitted
         */

        /* PROGRESS CALCULATOR */

        if (field === 'progressData') {
          return [field, value]
        }

        if (value?.__typename === 'ControlledVocabulary') {
          return [field, value]
        }

        if (value === 'false') {
          return [field, false]
        }

        if (value === 'true') {
          return [field, true]
        }

        return [field, value]
      })
      .filter(_ => _)
  )
}
