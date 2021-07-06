import { stringify } from 'wkt'

export default form => {
  return Object.fromEntries(
    Object.entries(form)
      .map(([field, value]) => {
        if (field === 'yx') {
          return [
            field,
            stringify({
              type: 'GeometryCollection',
              geometries: (value || []).map(coordinates => ({ type: 'Point', coordinates })),
            }),
          ]
        }

        /**
         * All dynamic values that the grid displays
         * need to be explicitly set before being
         * submitted
         */

        /* ENERGY CALCULATOR */

        if (field === 'energyData') {
          if (!form.hasEnergyData?.toBoolean()) {
            return [field, undefined]
          }

          return [field, value]
        }

        /* EMISSIONS CALCULATOR */

        if (field === 'emissionsData') {
          if (!form.hasEmissionsData?.toBoolean()) {
            return [field, undefined]
          }

          return [field, value]
        }

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

        if (field.match(/^__/)) {
          return null
        }

        return [field, value]
      })
      .filter(_ => _)
  )
}
