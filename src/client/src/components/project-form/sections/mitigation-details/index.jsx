import { useContext, memo } from 'react'
import { context as formContext, ComposeForm } from '../../gql-form-binder'
import RenderField from './_render-field'

const Compose = memo(({ fields }) => {
  return (
    <ComposeForm
      RenderField={RenderField}
      fields={fields}
      hideSections={['Emissions data', 'Energy data', 'Associated research']}
      sections={{
        'Host sector': ['hostSector', 'hostSubSectorPrimary', 'hostSubSectorSecondary'],
        'Project type': ['mitigationType', 'mitigationSubType'],
        'Policy information': [
          'mitigationProgramme',
          'nationalPolicy',
          'otherNationalPolicy',
          'regionalPolicy',
          'otherRegionalPolicy',
          'primaryIntendedOutcome',
        ],
        'Progress reports': ['fileUploads'],
        'Progress calculator': ['progressData'],
        'Co-benefit information': [
          'coBenefitEnvironmental',
          'coBenefitEnvironmentalDescription',
          'coBenefitSocial',
          'coBenefitSocialDescription',
          'coBenefitEconomic',
          'coBenefitEconomicDescription',
        ],
        'Carbon credit information': [
          'carbonCredit',
          'carbonCreditStandard',
          'carbonCreditCdmExecutiveStatus',
          'carbonCreditCdmMethodology',
          'carbonCreditVoluntaryOrganization',
          'carbonCreditVoluntaryMethodology',
        ],
        'Energy data': ['hasEnergyData', 'energyData'],
        'Emissions data': ['hasEmissionsData', 'emissionsData'],
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
  const { mitigationFields } = useContext(formContext)
  return <Compose fields={mitigationFields} />
}
