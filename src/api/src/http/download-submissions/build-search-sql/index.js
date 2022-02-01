import {
  projectInputFields,
  projectVocabularyFields,
  mitigationInputFields,
  mitigationVocabularyFields,
  adaptationInputFields,
  adaptationVocabularyFields,
} from '../../../graphql/schema/index.js'
import controlledVocabularyFragment from './_controlled-vocabulary-query-fragment.js'

export default ({ search, request, acceptedProjectsOnly }) => {
  let { project = {}, mitigation = {}, adaptation = {} } = JSON.parse(search)

  project = Object.entries(project)
  mitigation = Object.entries(mitigation)
  adaptation = Object.entries(adaptation)

  if (project.length) {
    project.forEach(([, { value }], i) => {
      request.input(`project_${i}`, value)
    })
  }

  if (mitigation.length) {
    mitigation.forEach(([, { value }], i) => {
      request.input(`mitigation_${i}`, value)
    })
  }

  if (adaptation.length) {
    adaptation.forEach(([, { value }], i) => {
      request.input(`adaptation_${i}`, value)
    })
  }

  const sql = `
    select
      *
    from Submissions s
    where
      deletedAt is null
      and isSubmitted = 1

      ${
        acceptedProjectsOnly
          ? `and upper(JSON_VALUE(s.submissionStatus, '$.term')) = 'ACCEPTED'`
          : ''
      }

      ${
        // PROJECT
        project.length
          ? project
              .map(([field, { type }], i) => {
                if (field === 'title') {
                  return `and json_value(project, '$.title') like @project_${i}`
                }

                if (field === 'submissionStatus') {
                  return `and json_value(submissionStatus, '$.term') = @project_${i}`
                }

                if (type === 'controlledVocabulary' && projectVocabularyFields.includes(field)) {
                  return controlledVocabularyFragment({
                    path: 'project',
                    kind: projectInputFields[field].kind,
                    i,
                    field,
                  })
                }

                throw new Error('Unexpected project filter value')
              })
              .join('\n')
          : ''
      }
      
      ${
        // MITIGATION
        mitigation.length
          ? mitigation.map(([field, { type }], i) => {
              if (type === 'controlledVocabulary' && mitigationVocabularyFields.includes(field)) {
                return controlledVocabularyFragment({
                  path: 'mitigation',
                  kind: mitigationInputFields[field].kind,
                  i,
                  field,
                })
              }

              throw new Error('Unexpected mitigation filter value')
            })
          : ''
      }
      
      ${
        // ADAPTATION
        adaptation.length
          ? adaptation.map(([field, { type }], i) => {
              if (type === 'controlledVocabulary' && adaptationVocabularyFields.includes(field)) {
                return controlledVocabularyFragment({
                  path: 'adaptation',
                  kind: adaptationInputFields[field].kind,
                  i,
                  field,
                })
              }

              throw new Error('Unexpected adaptation filter value')
            })
          : ''
      };`

  return sql
}
