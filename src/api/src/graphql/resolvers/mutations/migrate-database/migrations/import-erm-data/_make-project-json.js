import { projectVocabularyFields, projectInputFields } from '../../../../../schema/index.js'
import { stringify } from 'wkt'

export default project => {
  if (!project) return JSON.stringify({})

  try {
    //eslint-disable-next-line
    const { ProjectDetailsId, ..._project } = JSON.parse(project)

    return JSON.stringify(
      Object.fromEntries(
        Object.entries(_project).map(([field, value]) => {
          if (projectVocabularyFields.includes(field)) {
            if (projectInputFields[field].kind === 'LIST') {
              return [field, value.map(({ _: term }) => ({ term }))]
            } else {
              return [field, { term: value }]
            }
          }

          if (field === 'xy') {
            return [
              field,
              stringify({
                type: 'GeometryCollection',
                geometries: (value || []).map(({ lng: x, lat: y }) => ({
                  type: 'Point',
                  coordinates: [x, y],
                })),
              }),
            ]
          }

          if (field === 'cityOrTown') {
            return [field, value.map(({ _ }) => _).join(', ')]
          }
          return [field, value]
        })
      )
    )
  } catch {
    console.error('Unable to create project JSON', project)
  }
}
