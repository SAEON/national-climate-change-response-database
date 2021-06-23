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
          'adaptationSector',
          'correspondingNationalPolicy',
          'correspondingSubNationalPolicy',
          'correspondingAction',
        ],
        'Climate impact': [
          'observedClimateChangeImpacts',
          'addressedClimateChangeImpact',
          'responseImpact',
        ],
        'Hazard details': ['hazardFamily', 'hazardSubFamily', 'hazard', 'subHazard'],
        'Associated research': [
          'hasResearch',
          'researchDescription',
          'researchType',
          'researchTargetAudience',
          'researchAuthor',
          'researchPaper',
        ],
      }}
    />
  )
})

/**
 * Don't render ComposeForm directly,
 * as that will trigger many re-renders
 */
export default () => {
  const { adaptationFields } = useContext(formContext)
  return <Compose fields={adaptationFields} />
}
