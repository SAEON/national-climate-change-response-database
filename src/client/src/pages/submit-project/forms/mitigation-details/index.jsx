import { useContext, memo } from 'react'
import { context as formContext, ComposeForm } from '../../gql-form-binder'
import RenderField from './_render-field'

const Compose = memo(({ fields }) => {
  return (
    <ComposeForm
      RenderField={RenderField}
      fields={fields}
      hideSections={['Emissions data']}
      sections={{
        'Mitigation type': ['mitigationType', 'mitigationSubType'],
        'Mitigation sector': ['hostSector', 'hostSubSectorPrimary', 'hostSubSectorSecondary'],
        'Policy information': [
          'mitigationProgramme',
          'correspondingNationalPolicy',
          'correspondingSubNationalPolicy',
          'primaryIntendedOutcome',
        ],
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
        'Associated research': [
          'hasResearch',
          'researchDescription',
          'researchType',
          'researchTargetAudience',
          'researchAuthor',
          'researchPaper',
        ],
        'Energy data': ['hasEnergyData', 'energyData'],
        'Emissions data': ['hasEmissionsData', 'emissionsData'],
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
