import {
  adaptationVocabularyFields,
  adaptationInputFields,
} from '../../../../../graphql/schema/index.js'

export default adaptation => {
  if (!adaptation) return JSON.stringify({})

  try {
    //eslint-disable-next-line
    const { ProjectDetailsId, ..._adaptation } = JSON.parse(adaptation)

    return JSON.stringify(
      Object.fromEntries(
        Object.entries(_adaptation).map(([field, value]) => {
          if (adaptationVocabularyFields.includes(field)) {
            if (adaptationInputFields[field] === 'LIST') {
              return [field, value.map(({ _: term }) => ({ term }))]
            } else {
              return [field, { term: value }]
            }
          }

          return [field, value]
        })
      )
    )
  } catch {
    console.error('Unable to create adaptation JSON', adaptation)
  }
}
