import { useContext, memo } from 'react'
import { context as formContext, ComposeForm } from '../../gql-form-binder'
import RenderField from './_render-field'

const Compose = memo(({ fields }) => {
  return (
    <ComposeForm
      RenderField={RenderField}
      fields={fields}
      sections={{
        'Project details': [
          'title',
          'description',
          'projectManager',
          'interventionType',
          'projectStatus',
          'link',
          'startYear',
          'endYear',
        ],
        'Bounding location': ['province', 'districtMunicipality', 'localMunicipality'],
        'Validation status': ['validationStatus', 'validationComments'],
        'Funding information': [
          'fundingStatus',
          'fundingOrganisation',
          'fundingPartner',
          'estimatedBudget',
          'budgetLower',
          'budgetUpper',
        ],
        'Host information': [
          'hostSector',
          'hostSubSector',
          'hostOrganisation',
          'hostPartner',
          'alternativeContact',
          'alternativeContactEmail',
          'leadAgent',
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
  const { projectFields } = useContext(formContext)
  return <Compose fields={projectFields} />
}
