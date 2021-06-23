import { useContext } from 'react'
import {
  GqlBoundFormInput,
  context as formContext,
  ControlledVocabularySelect,
} from '../../gql-form-binder'
import EnergyCalculator from '../../gql-form-binder/calculators/energy'
import EmissionsCalculator from '../../gql-form-binder/calculators/emissions'
import ProgressCalculator from '../../gql-form-binder/calculators/progress'

const multilineFields = ['description', 'volMethodology', 'otherCarbonCreditStandardDescription']

const researchFormFields = [
  'researchDescription',
  'researchType',
  'researchTargetAudience',
  'researchAuthor',
  'researchPaper',
]

export default ({ field }) => {
  const { mitigationDetailsForm: form, updateMitigationDetailsForm: updateForm } =
    useContext(formContext)
  const { name: fieldName, description, type } = field
  const [placeholder, helperText, tree] = description?.split('::').map(s => s.trim()) || []
  const { name: inputType } = type
  const isRequired = !inputType
  const value = form[fieldName]

  if (fieldName === 'achievedProgress') {
    return (
      <ProgressCalculator
        key={fieldName}
        calculator={form[fieldName] || {}}
        updateCalculator={calculator => updateForm({ [fieldName]: calculator })}
      />
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
        <EnergyCalculator
          key={fieldName}
          calculator={form[fieldName] || {}}
          updateCalculator={calculator => updateForm({ [fieldName]: calculator })}
        />
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
        <EmissionsCalculator
          key={fieldName}
          calculator={form[fieldName] || {}}
          updateCalculator={calculator => updateForm({ [fieldName]: calculator })}
        />
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
  if (fieldName === 'correspondingNationalPolicy') {
    return (
      <ControlledVocabularySelect
        key={fieldName}
        tree={tree}
        root="Mitigation policies"
        name={fieldName}
        value={value}
        error={isRequired && !value}
        onChange={val =>
          updateForm({ [fieldName]: val, correspondingSubNationalPolicy: undefined })
        }
        placeholder={placeholder}
        helperText={helperText}
      />
    )
  } else if (fieldName === 'correspondingSubNationalPolicy') {
    if (form.correspondingNationalPolicy) {
      return (
        <ControlledVocabularySelect
          key={fieldName}
          tree={tree}
          root={form.correspondingNationalPolicy}
          name={fieldName}
          value={value}
          error={isRequired && !value}
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
        root="Type of Mitigation"
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

  if (researchFormFields.includes(fieldName)) {
    if (!(form.hasResearch || '').toBoolean()) {
      return null
    }
  }

  if (fieldName === 'hasResearch') {
    return (
      <GqlBoundFormInput
        key={fieldName}
        field={field}
        value={value || ''}
        updateValue={val =>
          updateForm({
            [fieldName]: val,
            ...Object.fromEntries(researchFormFields.map(field => [field, undefined])),
          })
        }
        multiline={multilineFields.includes(fieldName)}
      />
    )
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
