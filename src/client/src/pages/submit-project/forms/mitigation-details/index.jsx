import { useContext, memo } from 'react'
import { context as formContext, ComposeForm } from '../../gql-form-binder'
import RenderField from './_render-field'

const Compose = memo(({ fields }) => {
  return (
    <ComposeForm
      RenderField={RenderField}
      fields={fields}
      sections={{
        'Mitigation information': ['mitigationType', 'mitigationSubType', 'interventionStatus'],
        'Associated research': [
          'isResearch',
          'researchDescription',
          'researchType',
          'researchTargetAudience',
          'researchAuthor',
          'researchPaper',
        ],
        'Energy/emissions data': ['energyOrEmissionsData', 'energyData', 'emissionsData'],
        'Carbon credit program': [
          'carbonCredit',
          'volMethodology',
          'goldStandard',
          'vcs',
          'otherCarbonCreditStandard',
          'otherCarbonCreditStandardDescription',
        ],
        'CDM information': [
          'cdmProjectNumber',
          'cdmMethodology',
          'cdmExecutiveStatus',
          'cdmStatus',
        ],
        'IPCC information': ['hostSector', 'hostSubSectorPrimary', 'hostSubSectorSecondary'],
      }}
    />
  )
})

export default () => {
  const { mitigationFields } = useContext(formContext)
  return <Compose fields={mitigationFields} />
}
