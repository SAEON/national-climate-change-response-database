// import { parse } from 'wkt'

export default ({ ...form }) => {
  if (!form || !Object.keys(form).length) {
    return undefined
  }

  return Object.fromEntries(
    Object.entries(form)
      .map(([field, value]) => {
        if (value === null) {
          return null
        }

        if (field === 'yx') {
          console.log('yx', field, value)
          return [field, value]
          // return [field, parse(value).geometries.map(({ coordinates: [x, y] }) => [x, y])]
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

        if (field === 'fileUploads') {
          return [field, value]
        }

        return null
      })
      .filter(_ => _)
  )
}
