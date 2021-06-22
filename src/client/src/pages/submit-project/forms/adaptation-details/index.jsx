import { useContext, memo } from 'react'
import { context as formContext, ComposeForm } from '../../gql-form-binder'
import RenderField from './_render-field'

const Compose = memo(({ fields }) => {
  return (
    <ComposeForm
      RenderField={RenderField}
      fields={fields}
      sections={{
        'Adaptation details': [
          'adaptationPurpose',
          'adaptationSector',
          'interventionStatus',
          'startYear',
          'endYear',
        ],
        'Associated research': [
          'isResearch',
          'researchDescription',
          'researchType',
          'researchTargetAudience',
          'researchAuthor',
          'researchPaper',
        ],
        'Hazard details': ['hazardFamily', 'hazardSubFamily', 'hazard', 'subHazard'],
      }}
    />
  )
})

/**
 * This component should only render if the
 * number of forms changes
 */
export default () => {
  const { adaptationFields } = useContext(formContext)
  return <Compose fields={adaptationFields} />
}
