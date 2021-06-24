import { stringify } from 'wkt'
import fixGridValues from './calculators/fix-grid-values'

export default form =>
  Object.fromEntries(
    Object.entries(form).map(([field, value]) => {
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

        return [
          field,
          fixGridValues({
            fields: ['annualKwh', 'annualKwhPurchaseReduction', 'notes'],
            calculator: value,
          }),
        ]
      }

      /* EMISSIONS CALCULATOR */

      if (field === 'emissionsData') {
        if (!form.hasEmissionsData?.toBoolean()) {
          return [field, undefined]
        }

        return [
          field,
          fixGridValues({
            fields: [...value.chemicals.map(c => c), 'notes'],
            calculator: value,
          }),
        ]
      }

      /* PROGRESS CALCULATOR */

      if (field === 'progressData') {
        return [field, fixGridValues({ calculatorType: 'progress', calculator: value })]
      }

      if (value?.__typename === 'ControlledVocabulary') {
        const { root, term, tree } = value
        return [field, { root, term, tree }]
      }

      if (value === 'false') {
        return [field, false]
      }

      if (value === 'true') {
        return [field, true]
      }

      return [field, value]
    })
  )
