import { useContext } from 'react'
import {
  GqlBoundFormInput,
  context as formContext,
  ControlledVocabularySelect,
  LocationsPicker,
} from '../../gql-form-binder'
import { context as authContext } from '../../../../contexts/authorization'

const multilineFields = [
  'description',
  'validationComments',
  'projectManagerPhysicalAddress',
  'projectManagerPostalAddress',
]

export default ({ field }) => {
  const { hasPermission } = useContext(authContext)
  const {
    generalDetailsForm: form,
    updateGeneralDetailsForm: updateForm,
    resetMitigationDetailsForm,
    resetAdaptationDetailsForm,
  } = useContext(formContext)
  const { name: fieldName, description, type } = field
  const [placeholder, helperText] = description?.split('::').map(s => s.trim()) || []
  const { name: inputType } = type
  const isRequired = !inputType
  const value = form[fieldName]

  /**
   * WKT_4326
   */
  if (fieldName === 'yx') {
    return (
      <LocationsPicker
        onChange={(y, x) => {
          updateForm({ [fieldName]: [...(form[fieldName] || []), [y, x]] })
        }}
        setPoints={points => updateForm({ [fieldName]: points })}
        points={form[fieldName] || []}
        key={fieldName}
      />
    )
  }

  /**
   * Controlled vocabulary
   */
  if (fieldName === 'province') {
    return (
      <ControlledVocabularySelect
        key={fieldName}
        tree="regions"
        root="South Africa"
        name={fieldName}
        value={value}
        error={isRequired && !value}
        onChange={val =>
          updateForm({
            [fieldName]: val,
            districtMunicipality: undefined,
            localMunicipality: undefined,
          })
        }
        placeholder={placeholder}
        helperText={helperText}
      />
    )
  } else if (fieldName === 'districtMunicipality') {
    if (!form.province) return null
    return (
      <ControlledVocabularySelect
        key={fieldName}
        tree="regions"
        root={form.province}
        name={fieldName}
        value={value}
        error={isRequired && !value}
        onChange={val => updateForm({ [fieldName]: val, localMunicipality: undefined })}
        placeholder={placeholder}
        helperText={helperText}
      />
    )
  } else if (fieldName === 'localMunicipality') {
    if (!form.districtMunicipality) return null
    return (
      <ControlledVocabularySelect
        key={fieldName}
        tree="regions"
        root={form.districtMunicipality}
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
  if (fieldName === 'validationStatus') {
    return (
      <ControlledVocabularySelect
        key={fieldName}
        tree="projectValidationStatus"
        root="Validation Status"
        name={fieldName}
        disabled={!hasPermission('validate-submission')}
        value={value}
        error={isRequired && !value}
        onChange={val => updateForm({ [fieldName]: val })}
        placeholder={placeholder}
        helperText={helperText}
      />
    )
  }

  /**
   * Validation comments (limited user access)
   */
  if (fieldName === 'validationComments') {
    return (
      <GqlBoundFormInput
        key={fieldName}
        field={field}
        value={value || ''}
        disabled={!hasPermission('validate-submission')}
        updateValue={val => updateForm({ [fieldName]: val })}
        multiline={multilineFields.includes(fieldName)}
      />
    )
  }

  /**
   * Controlled vocabulary
   */
  if (fieldName === 'interventionType') {
    return (
      <ControlledVocabularySelect
        key={fieldName}
        tree="interventionTypes"
        root="Intervention type"
        name={fieldName}
        value={value}
        error={isRequired && !value}
        onChange={val => {
          updateForm({ [fieldName]: val })

          if (val?.term.toLowerCase() === 'adaptation' || !val?.term) {
            resetMitigationDetailsForm()
          }

          if (val?.term.toLowerCase() === 'mitigation' || !val?.term) {
            resetAdaptationDetailsForm()
          }
        }}
        placeholder={placeholder}
        helperText={helperText}
      />
    )
  }

  /**
   * Controlled vocabulary
   */
  if (fieldName === 'implementationStatus') {
    return (
      <ControlledVocabularySelect
        key={fieldName}
        tree="actionStatus"
        root="Status"
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
  if (fieldName === 'estimatedBudget') {
    return (
      <ControlledVocabularySelect
        key={fieldName}
        tree="budgetRanges"
        root="Estimated budget"
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
  if (fieldName === 'fundingType') {
    return (
      <ControlledVocabularySelect
        key={fieldName}
        tree="fundingTypes"
        root="Funding type"
        name={fieldName}
        value={value}
        error={isRequired && !value}
        onChange={val => updateForm({ [fieldName]: val })}
        placeholder={placeholder}
        helperText={helperText}
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
