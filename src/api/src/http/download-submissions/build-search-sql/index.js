import logSql from '../../../lib/log-sql.js'
import {
  projectInputFields,
  projectVocabularyFields,
  mitigationInputFields,
  adaptationInputFields,
} from '../../../graphql/schema/index.js'

export default ({ search, request }) => {
  let { project = {}, mitigation = {}, adaptation = {} } = JSON.parse(search)

  project = Object.entries(project)
  mitigation = Object.entries(mitigation)
  adaptation = Object.entries(adaptation)

  if (project.length) {
    console.log('project', project)
    project.forEach(([, { value }], i) => {
      request.input(`project_${i}`, value)
    })
  }

  if (mitigation.length) {
    console.log('mitigation', mitigation)
  }

  if (adaptation.length) {
    console.log('adaptation', adaptation)
  }

  const sql = `
    select
      *
    from Submissions
    where
      deletedAt is null
      and isSubmitted = 1

      -- PROJECT
      ${
        project.length
          ? project
              .map(([field, { type }], i) => {
                if (field === 'title') {
                  return `and json_value(project, '$.title') like '%' + @project_${i} + '%'`
                }

                if (field === 'submissionStatus') {
                  return `and json_value(submissionStatus, '$.term') = @project_${i}`
                }

                if (type === 'controlledVocabulary' && projectVocabularyFields.includes(field)) {
                  if (projectInputFields[field].kind === 'LIST') {
                    return `and 1 = 2` // TODO
                  }

                  return `and json_value(project, '$.${field}.term') = @project_${i}`
                }

                return ''
              })
              .join('\n')
          : ''
      }
      
      -- MITIGATION
      ${mitigation.length ? `and 1 = 1` : ''}
      
      -- ADAPTATION
      ${adaptation.length ? `and 1 = 1` : ''};`

  logSql(sql, 'Download', true)

  return sql
}
