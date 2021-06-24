import { useContext, memo } from 'react'
import { context as formContext, ComposeForm } from '../../gql-form-binder'
import RenderField from './_render-field'

const Compose = memo(({ fields }) => {
  return (
    <ComposeForm
      RenderField={RenderField}
      fields={fields}
      hideSections={['Emissions data', 'Energy data']}
      sections={{
        'Host sector': ['hostSector', 'hostSubSectorPrimary', 'hostSubSectorSecondary'],
        'Mitigation type': ['mitigationType', 'mitigationSubType'],
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
        'Progress calculator': ['progressData'],
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
