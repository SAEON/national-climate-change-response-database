import {
  projectInputFields,
  projectVocabularyFields,
  mitigationInputFields,
  mitigationVocabularyFields,
  adaptationInputFields,
  adaptationVocabularyFields,
} from '../../../graphql/schema/index.js'

function isObject(objValue) {
  return objValue && typeof objValue === 'object' && objValue.constructor === Object
}

export default ({ submission, columns }) => {
  let { project, mitigation, adaptation, ...fields } = submission
  project = JSON.parse(project)
  mitigation = JSON.parse(mitigation)
  adaptation = JSON.parse(adaptation)

  const row = new Array(Object.keys(columns).length).fill('')

  // Fields
  for (const f in fields) {
    const i = columns[`${f}`]
    const value = fields[f]

    if (Array.isArray(value)) {
      row[i] = fields[f].map(({ term }) => term).join(',')
    } else if (isObject(value)) {
      row[i] = fields[f].term
    } else {
      row[i] = fields[f]
    }
  }

  // Project fields
  for (const p in project) {
    const i = columns[`project.${p}`]
    const value = project[p]

    if (Array.isArray(value)) {
      row[i] = project[p].map(({ term }) => term).join(',')
    } else if (isObject(value)) {
      row[i] = project[p].term
    } else {
      row[i] = project[p]
    }
  }

  // mitigation fields
  for (const m in mitigation) {
    const i = columns[`mitigation.${m}`]
    const value = mitigation[m]

    if (Array.isArray(value)) {
      row[i] = mitigation[m].map(({ term }) => term).join(',')
    } else if (isObject(value)) {
      row[i] = mitigation[m].term
    } else {
      row[i] = mitigation[m]
    }
  }

  // adaptation fields
  for (const a in adaptation) {
    const i = columns[`adaptation.${a}`]
    const value = adaptation[a]

    if (Array.isArray(value)) {
      row[i] = adaptation[a].map(({ term }) => term).join(',')
    } else if (isObject(value)) {
      row[i] = adaptation[a].term
    } else {
      row[i] = adaptation[a]
    }
  }

  return `${row.join(',')}\n`
}
