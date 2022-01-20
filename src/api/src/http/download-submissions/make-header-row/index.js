import {
  projectInputFields,
  mitigationInputFields,
  adaptationInputFields,
} from '../../../graphql/schema/index.js'

const fieldToHumanOverrides = {
  id: 'ID',
  submissionStatus: 'Submission status',
  submissionComments: 'Submission comments',
  submissionType: 'Submission type (OLD ERM field)',
  createdAt: 'Created at',
  userId: 'User (ID)',
  createdBy: 'Created by (User ID)',
  research: 'Research (OLD ERM field)',
}

const fieldToHuman = {
  ...Object.fromEntries(
    Object.entries(projectInputFields).map(([field, { description }]) => [
      `project.${field}`,
      `${description.split('::')[0].trim()} (project)`,
    ])
  ),
  ...Object.fromEntries(
    Object.entries(mitigationInputFields).map(([field, { description }]) => [
      `mitigation.${field}`,
      `${description.split('::')[0].trim()} (mitigation)`,
    ])
  ),
  ...Object.fromEntries(
    Object.entries(adaptationInputFields).map(([field, { description }]) => [
      `adaptation.${field}`,
      `${description.split('::')[0].trim()} (adaptation)`,
    ])
  ),
  ...fieldToHumanOverrides,
}

export default ({ columns }) => {
  const header = new Array(Object.keys(columns).length).fill('')
  for (const column in columns) {
    header[columns[column]] = fieldToHuman?.[column] || column
  }

  return header
}
