import { useContext, lazy, Suspense } from 'react'
import Loading from '../../../loading'
import {
  GqlBoundFormInput,
  ControlledVocabularySelect,
  ControlledVocabularySelectMultiple,
} from '../../form'
import { context as formContext } from '../../context'

const EnergyCalculator = lazy(() => import('../../form/components/calculators/energy'))
const EmissionsCalculator = lazy(() => import('../../form/components/calculators/emissions'))
const ProgressCalculator = lazy(() => import('../../form/components/calculators/progress'))
const FileUpload = lazy(() => import('../../form/components/upload'))

const multilineFields = [
  'description',
  'volMethodology',
  'otherCarbonCreditStandardDescription',
  'primaryIntendedOutcome',
  'coBenefitEnvironmentalDescription',
  'coBenefitSocialDescription',
  'coBenefitEconomicDescription',
  'carbonCreditVoluntaryMethodology',
  'otherNationalPolicy',
  'otherRegionalPolicy',
]

const carbonCreditsFields = [
  'carbonCreditStandard',
  'carbonCreditCdmExecutiveStatus',
  'carbonCreditCdmMethodology',
  'carbonCreditVoluntaryOrganization',
  'carbonCreditVoluntaryMethodology',
  'carbonCreditCdmProjectNumber',
]

export default ({ field, formName }) => {
  const { mitigationDetailsForm: form, updateMitigationDetailsForm: updateForm } =
    useContext(formContext)
  const { name: fieldName, description, type } = field
  let [placeholder, helperText, tree] = description?.split('::').map(s => s.trim()) || []
  const { kind } = type
  const isRequired = kind === 'NON_NULL'
  const value = form?.[fieldName] || undefined

  if (helperText === '') {
    helperText = ` `
  }

  if (fieldName === 'fileUploads') {
    return (
      <Suspense key={fieldName} fallback={<Loading />}>
        <FileUpload
          formName={formName}
          updateValue={value => updateForm({ [fieldName]: value })}
          placeholder={placeholder}
          helperText={helperText}
          value={value}
        />
      </Suspense>
    )
  }

  if (fieldName === 'progressData') {
    return (
      <Suspense key={fieldName} fallback={<Loading />}>
        <ProgressCalculator
          calculator={form[fieldName] || {}}
          updateCalculator={calculator => updateForm({ [fieldName]: calculator })}
        />
      </Suspense>
    )
  }

  /**
   * Energy input & calculator
   */
  if (fieldName === 'hasEnergyData') {
    return (
      <GqlBoundFormInput
        key={fieldName}
        field={field}
        value={value || ''}
        updateValue={val => updateForm({ [fieldName]: val, energyData: undefined })}
        multiline={multilineFields.includes(fieldName)}
      />
    )
  } else if (fieldName === 'energyData') {
    if (form.hasEnergyData?.toBoolean()) {
      return (
        <Suspense key={fieldName} fallback={<Loading />}>
          <EnergyCalculator
            calculator={form[fieldName] || {}}
            updateCalculator={calculator => updateForm({ [fieldName]: calculator })}
          />
        </Suspense>
      )
    } else {
      return null
    }
  }

  /**
   * Emissions input & calculator
   * (Hidden for now)
   */
  if (fieldName === 'hasEmissionsData') {
    return (
      <GqlBoundFormInput
        key={fieldName}
        field={field}
        value={value || ''}
        updateValue={val => updateForm({ [fieldName]: val, energyData: undefined })}
        multiline={multilineFields.includes(fieldName)}
      />
    )
  } else if (fieldName === 'emissionsData') {
    if (form.hasEmissionsData?.toBoolean()) {
      return (
        <Suspense key={fieldName} fallback={<Loading />}>
          <EmissionsCalculator
            calculator={form[fieldName] || {}}
            updateCalculator={calculator => updateForm({ [fieldName]: calculator })}
          />
        </Suspense>
      )
    } else {
      return null
    }
  }

  /**
   * Controlled vocabulary
   */
  if (fieldName === 'hostSector') {
    return (
      <ControlledVocabularySelect
        key={fieldName}
        tree={tree}
        root="Mitigation sector"
        name={fieldName}
        value={value}
        error={isRequired && !value}
        onChange={val =>
          updateForm({
            [fieldName]: val,
            hostSubSectorPrimary: undefined,
            hostSubSectorSecondary: undefined,
          })
        }
        placeholder={placeholder}
        helperText={helperText}
      />
    )
  } else if (fieldName === 'hostSubSectorPrimary') {
    if (form.hostSector) {
      return (
        <ControlledVocabularySelect
          key={fieldName}
          tree={tree}
          root={form.hostSector}
          name={fieldName}
          value={value}
          error={isRequired && !value}
          isRequired={isRequired}
          onChange={val => updateForm({ [fieldName]: val, hostSubSectorSecondary: undefined })}
          placeholder={placeholder}
          helperText={helperText}
        />
      )
    } else {
      return null
    }
  } else if (fieldName === 'hostSubSectorSecondary') {
    if (form.hostSubSectorPrimary) {
      return (
        <ControlledVocabularySelect
          key={fieldName}
          tree={tree}
          root={form.hostSubSectorPrimary}
          name={fieldName}
          value={value}
          error={isRequired && !value}
          isRequired={isRequired}
          onChange={val => updateForm({ [fieldName]: val })}
          placeholder={placeholder}
          helperText={helperText}
        />
      )
    } else {
      return null
    }
  }

  /**
   * Controlled vocabulary
   */
  if (fieldName === 'nationalPolicy') {
    return (
      <ControlledVocabularySelectMultiple
        key={fieldName}
        tree={tree}
        roots={['National policy']}
        name={fieldName}
        value={value}
        error={isRequired && !value}
        onChange={val => updateForm({ [fieldName]: val, otherNationalPolicy: undefined })}
        label={placeholder}
        helperText={helperText}
      />
    )
  } else if (fieldName === 'otherNationalPolicy') {
    if (!form?.nationalPolicy?.find(({ term }) => term?.match(/^Other\s/))) {
      return null
    }
  }

  /**
   * Controlled vocabulary
   */
  if (fieldName === 'regionalPolicy') {
    return (
      <ControlledVocabularySelectMultiple
        key={fieldName}
        tree={tree}
        roots={['Regional policy']}
        name={fieldName}
        value={value}
        error={isRequired && !value?.length}
        onChange={val => updateForm({ [fieldName]: val, otherRegionalPolicy: undefined })}
        label={placeholder}
        helperText={helperText}
      />
    )
  } else if (fieldName === 'otherRegionalPolicy') {
    if (!form?.regionalPolicy?.find(({ term }) => term?.match(/^Other\s/))) {
      return null
    }
  }

  /**
   * Controlled vocabulary
   */
  if (fieldName === 'coBenefitEconomic') {
    return (
      <ControlledVocabularySelect
        key={fieldName}
        tree={tree}
        root="Economic"
        name={fieldName}
        value={value}
        error={isRequired && !value}
        onChange={val => updateForm({ [fieldName]: val })}
        placeholder={placeholder}
        helperText={helperText}
      />
    )
  }

  /**
   * Controlled vocabulary
   */
  if (fieldName === 'mitigationProgramme') {
    return (
      <ControlledVocabularySelect
        key={fieldName}
        tree={tree}
        root="Programme"
        name={fieldName}
        value={value}
        error={isRequired && !value}
        onChange={val => updateForm({ [fieldName]: val })}
        placeholder={placeholder}
        helperText={helperText}
      />
    )
  }

  /**
   * Controlled vocabulary
   */
  if (fieldName === 'coBenefitEnvironmental') {
    return (
      <ControlledVocabularySelect
        key={fieldName}
        tree={tree}
        root="Environmental"
        name={fieldName}
        value={value}
        error={isRequired && !value}
        onChange={val => updateForm({ [fieldName]: val })}
        placeholder={placeholder}
        helperText={helperText}
      />
    )
  }

  /**
   * Controlled vocabulary
   */
  if (fieldName === 'coBenefitSocial') {
    return (
      <ControlledVocabularySelect
        key={fieldName}
        tree={tree}
        root="Social"
        name={fieldName}
        value={value}
        error={isRequired && !value}
        onChange={val => updateForm({ [fieldName]: val })}
        placeholder={placeholder}
        helperText={helperText}
      />
    )
  }

  if (carbonCreditsFields.includes(fieldName)) {
    if (!`'${form.carbonCredit}'`.toBoolean()) {
      return null
    }
  }

  /**
   * Controlled vocabulary
   */
  if (fieldName === 'carbonCreditVoluntaryOrganization') {
    return (
      <ControlledVocabularySelect
        key={fieldName}
        tree={tree}
        root="Organization"
        name={fieldName}
        value={value}
        error={isRequired && !value}
        onChange={val => updateForm({ [fieldName]: val })}
        placeholder={placeholder}
        helperText={helperText}
      />
    )
  }

  /**
   * Controlled vocabulary
   */
  if (fieldName === 'carbonCreditCdmMethodology') {
    return (
      <ControlledVocabularySelect
        key={fieldName}
        tree={tree}
        root="CDM methodology"
        name={fieldName}
        value={value}
        error={isRequired && !value}
        onChange={val => updateForm({ [fieldName]: val })}
        placeholder={placeholder}
        helperText={helperText}
      />
    )
  }

  /**
   * Controlled vocabulary
   */
  if (fieldName === 'carbonCreditCdmExecutiveStatus') {
    return (
      <ControlledVocabularySelect
        key={fieldName}
        tree={tree}
        root="Executive status"
        name={fieldName}
        value={value}
        error={isRequired && !value}
        onChange={val => updateForm({ [fieldName]: val })}
        placeholder={placeholder}
        helperText={helperText}
      />
    )
  }

  /**
   * Controlled vocabulary
   */
  if (fieldName === 'carbonCreditStandard') {
    return (
      <ControlledVocabularySelect
        key={fieldName}
        tree={tree}
        root="Carbon credit standard"
        name={fieldName}
        value={value}
        error={isRequired && !value}
        onChange={val => updateForm({ [fieldName]: val })}
        placeholder={placeholder}
        helperText={helperText}
      />
    )
  }

  /**
   * Controlled vocabulary
   */
  if (fieldName === 'cdmExecutiveStatus') {
    return (
      <ControlledVocabularySelect
        key={fieldName}
        tree={tree}
        root="Executive status"
        name={fieldName}
        value={value}
        error={isRequired && !value}
        onChange={val => updateForm({ [fieldName]: val })}
        placeholder={placeholder}
        helperText={helperText}
      />
    )
  }

  /**
   * Controlled vocabulary
   */
  if (fieldName === 'mitigationType') {
    return (
      <ControlledVocabularySelect
        key={fieldName}
        tree={tree}
        root="Mitigation type"
        name={fieldName}
        value={value}
        error={isRequired && !value}
        onChange={val => {
          updateForm({ [fieldName]: val, mitigationSubType: undefined })
        }}
        placeholder={placeholder}
        helperText={helperText}
      />
    )
  } else if (fieldName === 'mitigationSubType') {
    if (form.mitigationType) {
      return (
        <ControlledVocabularySelect
          key={fieldName}
          tree={tree}
          root={form.mitigationType}
          name={fieldName}
          value={value}
          error={isRequired && !value}
          isRequired={isRequired}
          onChange={val => updateForm({ [fieldName]: val })}
          placeholder={placeholder}
          helperText={helperText}
        />
      )
    } else {
      return null
    }
  }

  return (
    <GqlBoundFormInput
      key={fieldName}
      field={field}
      value={value || ''}
      updateValue={val => updateForm({ [fieldName]: val })}
      multiline={multilineFields.includes(fieldName)}
    />
  )
}
