import { useContext, memo } from 'react'
import { context as formContext, ComposeForm } from '../../gql-form-binder'
import RenderField from './_render-field'

const Compose = memo(({ fields }) => (
  <ComposeForm
    RenderField={RenderField}
    fields={fields}
    sections={{
      'Project details': [
        'title',
        'description',
        'interventionType',
        'implementationStatus',
        'implementingOrganization',
        'startYear',
        'endYear',
        'link',
      ],
      'Project funding': ['fundingOrganisation', 'fundingType', 'actualBudget', 'estimatedBudget'],
      'Geographic location(s)': ['province', 'districtMunicipality', 'localMunicipality', 'yx'],
      'Project manager': [
        'projectManagerName',
        'projectManagerOrganization',
        'projectManagerPosition',
        'projectManagerEmail',
        'projectManagerTelephone',
        'projectManagerMobile',
        'projectManagerPhysicalAddress',
        'projectManagerPostalAddress',
      ],
      'Validation status (administrators only)': ['validationStatus', 'validationComments'],
    }}
  />
))

/**
 * Don't render ComposeForm directly,
 * as that will trigger many re-renders
 */
export default () => {
  const { projectFields } = useContext(formContext)
  return <Compose fields={projectFields} />
}
