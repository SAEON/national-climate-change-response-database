import { useContext, memo } from 'react'
import { ComposeForm } from '../../form'
import { context as formContext } from '../../context'
import RenderField from './_render-field'

const Compose = memo(({ fields }) => {
  return (
    <ComposeForm
      formName="mitigation"
      RenderField={RenderField}
      fields={fields}
      hideSections={[]}
      defaultExpanded={['Host sector']}
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
          'carbonCreditCdmProjectNumber',
        ],
      }}
    />
  )
})

/**
 * Don't render ComposeForm directly,
 * as that will trigger many re-renders
 */
export default ({ active }) => {
  const { mitigationFields } = useContext(formContext)

  if (!active) {
    return null
  }

  return <Compose fields={mitigationFields} />
}
