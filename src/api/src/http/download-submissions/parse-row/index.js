import {
  projectInputFields,
  projectVocabularyFields,
  mitigationInputFields,
  mitigationVocabularyFields,
  adaptationInputFields,
  adaptationVocabularyFields,
} from '../../../graphql/schema/index.js'
import { HOSTNAME } from '../../../config/index.js'
import parseProgressData from './parse-progress-data/index.js'
import { stringify as stringifySync } from 'csv/sync'

const generalVocabularyFields = ['submissionStatus']

const generalInputFields = {
  /**
   * This field is in projectInputFields, however
   * it is saved in it's own column so needs to be
   * specified here
   */
  submissionStatus: {
    kind: 'INPUT_OBJECT',
  },
}

const parseValue = (id, { key, obj, vocabFields, inputFields }) => {
  let value = obj[key]

  if (vocabFields.includes(key)) {
    value = typeof value === 'string' ? JSON.parse(value) : value
    if (inputFields[key].kind === 'LIST') {
      try {
        return value?.map(({ term }) => term).join(',') || ''
      } catch (error) {
        console.warn(
          'Error parsing submission for download to CSV. ID',
          id,
          `Field: ${key}`,
          'A vocabulary field expecting a list is stored as an object. If this field has been changed from a single term input to a list input, this is expected and you can ignore this message. But in the future please migrate the data to correct for this'
        )
        return value?.term || ''
      }
    }

    return value?.term || ''
  }

  if (key === 'carbonCredit') {
    return `${value}`
  }

  if (key === 'progressData') {
    const tables = Object.entries(parseProgressData(value)).reduce(
      (tables, [key, value]) => {
        // Progress
        if (key.includes('_progress')) {
          key = key.replace('_progress_calc_', '')
          key = key.split('_')
          const col = key[0]
          const row = key[1]
          tables.progress[row - 1] = tables.progress[row - 1] || {}
          tables.progress[row - 1][col] = value
        } else {
          // Expenditure
          key = key.replace('_expenditure_calc_', '')
          key = key.split('_')
          const col = key[0]
          const row = key[1]
          tables.expenditure[row - 1] = tables.expenditure[row - 1] || {}
          tables.expenditure[row - 1][col] = value
        }

        return tables
      },
      { expenditure: [], progress: [] }
    )

    return `
### PROGRESS DATA
${stringifySync(tables.progress, { header: true, delimiter: ';', quoted: false })}

### EXPENDITURE DATA
${stringifySync(tables.expenditure, { header: true, delimiter: ';', quoted: false })}`
  }

  if (key === 'fileUploads') {
    return value
      .map(({ id, name }) => `${HOSTNAME}/http/download-public-file?fileId=${id} (${name})`)
      .join(' \n')
      .trim()
  }

  if (key === 'createdAt' || key === 'deletedAt') {
    return value?.toISOString() || ''
  }

  if (typeof value === 'object') {
    return JSON.stringify(value)
  }

  if (key === 'startYear' || key === 'endYear') {
    if (value?.length > 4) {
      return new Date(value).getFullYear()
    }
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
    if (isNaN(i)) continue
    row[i] = parseValue(submission.id, {
      key,
      obj: project,
      vocabFields: projectVocabularyFields,
      inputFields: projectInputFields,
    })
  }

  // Mitigation fields
  for (const key in mitigation) {
    const i = columns[`mitigation.${key}`]
    if (isNaN(i)) continue
    row[i] = parseValue(submission.id, {
      key,
      obj: mitigation,
      vocabFields: mitigationVocabularyFields,
      inputFields: mitigationInputFields,
    })
  }

  // adaptation fields
  for (const key in adaptation) {
    const i = columns[`adaptation.${key}`]
    if (isNaN(i)) continue
    row[i] = parseValue(submission.id, {
      key,
      obj: adaptation,
      vocabFields: adaptationVocabularyFields,
      inputFields: adaptationInputFields,
    })
  }

  // General fields
  for (const key in fields) {
    const i = columns[key]
    if (isNaN(i)) continue
    row[i] = parseValue(submission.id, {
      key,
      obj: fields,
      vocabFields: generalVocabularyFields,
      inputFields: generalInputFields,
    })
  }

  return row
}
