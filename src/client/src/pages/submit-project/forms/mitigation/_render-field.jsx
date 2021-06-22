import { useContext } from 'react'
import {
  GqlBoundFormInput,
  context as formContext,
  ControlledVocabularySelect,
} from '../../gql-form-binder'
import EnergyCalculator from '../../gql-form-binder/calculators/energy'
import EmissionsCalculator from '../../gql-form-binder/calculators/emissions'

const multilineFields = ['description', 'volMethodology', 'otherCarbonCreditStandardDescription']

const researchFormFields = [
  'researchDescription',
  'researchType',
  'researchTargetAudience',
  'researchAuthor',
  'researchPaper',
]

export default ({ field, i }) => {
  const { mitigationForms, updateMitigationForm } = useContext(formContext)
  const form = mitigationForms[i]
  const { name: fieldName, description, type } = field
  const [placeholder, helperText] = description?.split('::').map(s => s.trim()) || []
  const { name: inputType } = type
  const isRequired = !inputType
  const value = form[fieldName]

  /**
   * Controlled vocabulary
   */
  if (fieldName === 'energyOrEmissionsData') {
    return (
      <ControlledVocabularySelect
        key={fieldName}
        tree="mitigationData"
        root="Mitigation data"
        name={fieldName}
        value={value}
        error={isRequired && !value}
        onChange={val => updateMitigationForm({ [fieldName]: val }, i)}
        placeholder={placeholder}
        helperText={helperText}
      />
    )
  }

  /**
   * Energy input & calculator
   */
  if (fieldName === 'energyData') {
    if (form.energyOrEmissionsData?.term === 'Energy') {
      return (
        <EnergyCalculator
          key={fieldName}
          calculator={form[fieldName] || {}}
          updateCalculator={calculator => updateMitigationForm({ [fieldName]: calculator }, i)}
        />
      )
    } else {
      return null
    }
  }

  /**
   * Emissions input & calculator
   */
  if (fieldName === 'emissionsData') {
    if (form.energyOrEmissionsData?.term === 'Emissions') {
      return (
        <EmissionsCalculator
          key={fieldName}
          calculator={form[fieldName] || {}}
          updateCalculator={calculator => updateMitigationForm({ [fieldName]: calculator }, i)}
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
        tree="mitigationSectors"
        root="Mitigation sector"
        name={fieldName}
        value={value}
        error={isRequired && !value}
        onChange={val =>
          updateMitigationForm(
            {
              [fieldName]: val,
              hostSubSectorPrimary: undefined,
              hostSubSectorSecondary: undefined,
            },
            i
          )
        }
        placeholder={placeholder}
        helperText={helperText}
      />
    )
  } else if (fieldName === 'hostSubSectorPrimary') {
    if (form['hostSector']) {
      return (
        <ControlledVocabularySelect
          key={fieldName}
          tree="mitigationSectors"
          root={form['hostSector']}
          name={fieldName}
          value={value}
          error={isRequired && !value}
          isRequired={isRequired}
          onChange={val =>
            updateMitigationForm({ [fieldName]: val, hostSubSectorSecondary: undefined }, i)
          }
          placeholder={placeholder}
          helperText={helperText}
        />
      )
    } else {
      return null
    }
  } else if (fieldName === 'hostSubSectorSecondary') {
    if (form['hostSubSectorPrimary']) {
      return (
        <ControlledVocabularySelect
          key={fieldName}
          tree="mitigationSectors"
          root={form['hostSubSectorPrimary']}
          name={fieldName}
          value={value}
          error={isRequired && !value}
          isRequired={isRequired}
          onChange={val => updateMitigationForm({ [fieldName]: val }, i)}
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
  if (fieldName === 'cdmMethodology') {
    return (
      <ControlledVocabularySelect
        key={fieldName}
        tree="cdmMethodology"
        root="CDM methodology"
        name={fieldName}
        value={value}
        error={isRequired && !value}
        onChange={val => updateMitigationForm({ [fieldName]: val }, i)}
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
        tree="executiveStatus"
        root="Executive status"
        name={fieldName}
        value={value}
        error={isRequired && !value}
        onChange={val => updateMitigationForm({ [fieldName]: val }, i)}
        placeholder={placeholder}
        helperText={helperText}
      />
    )
  }

  /**
   * Controlled vocabulary
   */
  if (fieldName === 'interventionStatus') {
    return (
      <ControlledVocabularySelect
        key={fieldName}
        tree="actionStatus"
        root="Status"
        name={fieldName}
        value={value}
        error={isRequired && !value}
        onChange={val => updateMitigationForm({ [fieldName]: val }, i)}
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
        tree="mitigationTypes"
        root="Type of Mitigation"
        name={fieldName}
        value={value}
        error={isRequired && !value}
        onChange={val => {
          updateMitigationForm({ [fieldName]: val, mitigationSubType: undefined }, i)
        }}
        placeholder={placeholder}
        helperText={helperText}
      />
    )
  } else if (fieldName === 'mitigationSubType') {
    if (form['mitigationType']) {
      return (
        <ControlledVocabularySelect
          key={fieldName}
          tree="mitigationTypes"
          root={form['mitigationType']}
          name={fieldName}
          value={value}
          error={isRequired && !value}
          isRequired={isRequired}
          onChange={val => updateMitigationForm({ [fieldName]: val }, i)}
          placeholder={placeholder}
          helperText={helperText}
        />
      )
    } else {
      return null
    }
  }

  if (researchFormFields.includes(fieldName)) {
    if (!(form['isResearch'] || '').toBoolean()) {
      return null
    }
  }

  if (fieldName === 'isResearch') {
    return (
      <GqlBoundFormInput
        i={i}
        key={fieldName}
        field={field}
        value={value || ''}
        updateValue={val =>
          updateMitigationForm(
            {
              [fieldName]: val,
              ...Object.fromEntries(researchFormFields.map(field => [field, undefined])),
            },
            i
          )
        }
        multiline={multilineFields.includes(fieldName)}
      />
    )
  }

  return (
    <GqlBoundFormInput
      i={i}
      key={fieldName}
      field={field}
      value={value || ''}
      updateValue={val => updateMitigationForm({ [fieldName]: val }, i)}
      multiline={multilineFields.includes(fieldName)}
    />
  )
}
