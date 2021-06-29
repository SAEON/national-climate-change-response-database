import { parse } from 'wkt'

export default ({ ...form }) =>
  Object.fromEntries(
    Object.entries(form)
      .map(([field, value]) => {
        if (value === null) {
          return null
        }

        if (field === 'yx') {
          return [field, parse(value).geometries.map(({ coordinates: [x, y] }) => [x, y])]
        }

        if (field === 'energyData') {
          throw new Error('Not implemented')
        }

        if (field === 'emissionsData') {
          throw new Error('Not implemented')
        }

        if (field === 'progressData') {
          return [field, value]
        }

        if (value?.__typename === 'ControlledVocabulary') {
          return [field, value]
        }

        if (typeof value === 'string') {
          return [field, value]
        }

        if (typeof value === 'number') {
          return [field, value]
        }

        console.log(field, value)

        return null
      })
      .filter(_ => _)
  )
