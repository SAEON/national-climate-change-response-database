import { projectVocabularyFields } from '../../../../../graphql/schema/index.js'
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
            if (
              field === 'province' ||
              field === 'districtMunicipality' ||
              field === 'localMunicipality'
            ) {
              return [field, value.map(({ _: term }) => ({ term }))]
            }
            return [field, { term: value }]
          }

          if (field === 'yx') {
            return [
              field,
              stringify({
                type: 'GeometryCollection',
                geometries: (value || []).map(({ lat: y, lng: x }) => ({
                  type: 'Point',
                  coordinates: [y, x],
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
