import { useContext, memo } from 'react'
import { ComposeForm } from '../../form'
import { context as formContext } from '../../context'
import RenderField from './_render-field'

const Compose = memo(({ fields }) => {
  return (
    <ComposeForm
      formName="adaptation"
      RenderField={RenderField}
      fields={fields}
      sections={{
        'Adaptation details': [
          'adaptationSector',
          'otherAdaptationSector',
          'nationalPolicy',
          'otherNationalPolicy',
          'target',
          'otherTarget',
          'regionalPolicy',
          'otherRegionalPolicy',
          'hazard',
          'otherHazard',
        ],
        'Climate impact': [
          'observedClimateChangeImpacts',
          'addressedClimateChangeImpact',
          'responseImpact',
        ],
        'Progress reports': ['fileUploads'],
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
