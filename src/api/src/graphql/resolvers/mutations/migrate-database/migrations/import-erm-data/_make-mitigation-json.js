import { mitigationVocabularyFields, mitigationInputFields } from '../../../../../schema/index.js'

export default mitigation => {
  if (!mitigation) return JSON.stringify({})

  try {
    //eslint-disable-next-line
    const { ProjectDetailsId, ..._mitigation } = JSON.parse(mitigation)

    return JSON.stringify(
      Object.fromEntries(
        Object.entries(_mitigation).map(([field, value]) => {
          if (mitigationVocabularyFields.includes(field)) {
            if (mitigationInputFields[field].kind === 'LIST') {
              return [field, value.map(({ _: term }) => ({ term }))]
            } else {
              return [field, { term: value }]
            }
          }

          if (field === 'xy') {
            return [field, value]
          }

          if (field === 'cityOrTown') {
            return [field, value.map(({ _ }) => _).join(', ')]
          }
          return [field, value]
        })
      )
    )
  } catch {
    console.error('Unable to create mitigation JSON', mitigation)
  }
}
