import { useContext, memo } from 'react'
import { ComposeForm } from '../../form'
import { context as formContext } from '../../context'
import RenderField from './_render-field'

const Compose = memo(({ fields }) => (
  <ComposeForm
    formName="project"
    RenderField={RenderField}
    fields={fields}
    sections={{
      'Project overview': [
        'title',
        'interventionType',
        'description',
        'implementationStatus',
        'implementingOrganization',
        'otherImplementingPartners',
        'startYear',
        'endYear',
        'link',
      ],
      'Project funding': [
        'fundingOrganisation',
        'fundingType',
        'fundingTypeOther',
        'actualBudget',
        'estimatedBudget',
      ],
      'Geographic location(s)': [
        'province',
        'districtMunicipality',
        'localMunicipality',
        'cityOrTown',
        'yx',
      ],
      'Project manager': [
        'projectManagerName',
        'projectManagerOrganization',
        'projectManagerPosition',
        'projectManagerEmail',
        'projectManagerTelephone',
        'projectManagerMobile',
      ],
      'Submission status': ['__submissionStatus', '__submissionComments'],
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
