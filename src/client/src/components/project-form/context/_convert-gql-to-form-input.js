import { parse } from 'wkt'

export default ({ ...form }) => {
  if (!form) {
    return {}
  }

  return Object.fromEntries(
    Object.entries(form)
      .map(([field, value]) => {
        if (value === null) {
          return null
        }

        if (field === 'yx') {
          try {
            return [field, parse(value).geometries.map(({ coordinates: [y, x] }) => [x, y])]
          } catch {
            return [field, undefined]
          }
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

        return [field, value]
      })
      .filter(_ => _)
  )
}
