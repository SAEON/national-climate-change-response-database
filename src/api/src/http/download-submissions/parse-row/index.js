import {
  projectInputFields,
  projectVocabularyFields,
  mitigationInputFields,
  mitigationVocabularyFields,
  adaptationInputFields,
  adaptationVocabularyFields,
} from '../../../graphql/schema/index.js'
import parseProgressData from './parse-progress-data/index.js'
const generalVocabularyFields = ['submissionStatus']

const generalInputFields = {
  /**
   * This field is not on the GraphQL
   * type - it comes from the old ERM
   * DB
   */
  research: {
    kind: 'SCALAR',
  },
  /**
   * This field is in projectInputFields, however
   * it is saved in it's own column so needs to be
   * specified here
   */
  submissionStatus: {
    kind: 'INPUT_OBJECT',
  },
}

const parseValue = ({ key, obj, vocabFields, inputFields }) => {
  const value = obj[key]
  if (vocabFields.includes(key)) {
    if (inputFields[key].kind === 'LIST') {
      return value?.map(({ term }) => term).join(',') || ''
    }

    return value?.term || ''
  }

  if (key === 'progressData') {
    return JSON.stringify(parseProgressData(value))
  }

  if (key === 'fileUploads') {
    return 'TODO - should this be a comma separated list of download URLs?'
  }

  if (key === 'research') {
    return JSON.stringify({
      ['What is this?']:
        'This information was found in the old ERM database, and was not discarded',
      data: JSON.parse(value),
    })
  }

  if (key === 'createdAt' || key === 'deletedAt') {
    return value?.toISOString() || ''
  }

  if (typeof value === 'object') {
    return JSON.stringify(value)
  }

  return value || ''
}

export default ({ submission, columns }) => {
  let { project, mitigation, adaptation, ...fields } = submission
  project = JSON.parse(project)
  mitigation = JSON.parse(mitigation)
  adaptation = JSON.parse(adaptation)

  const row = new Array(Object.keys(columns).length).fill('')

  // Project fields
  for (const key in project) {
    const i = columns[`project.${key}`]
    row[i] = parseValue({
      key,
      obj: project,
      vocabFields: projectVocabularyFields,
      inputFields: projectInputFields,
    })
  }

  // Mitigation fields
  for (const key in mitigation) {
    const i = columns[`mitigation.${key}`]
    row[i] = parseValue({
      key,
      obj: mitigation,
      vocabFields: mitigationVocabularyFields,
      inputFields: mitigationInputFields,
    })
  }

  // adaptation fields
  for (const key in adaptation) {
    const i = columns[`adaptation.${key}`]
    row[i] = parseValue({
      key,
      obj: adaptation,
      vocabFields: adaptationVocabularyFields,
      inputFields: adaptationInputFields,
    })
  }

  // General fields
  for (const key in fields) {
    const i = columns[key]
    row[i] = parseValue({
      key,
      obj: fields,
      vocabFields: generalVocabularyFields,
      inputFields: generalInputFields,
    })
  }

  return row
}
