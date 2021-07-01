import { useContext } from 'react'
import {
  GqlBoundFormInput,
  context as formContext,
  ControlledVocabularySelect,
  FileUpload,
} from '../../gql-form-binder'

const multilineFields = [
  'description',
  'otherHazard',
  'addressedClimateChangeImpact',
  'observedClimateChangeImpacts',
  'responseImpact',
  'otherNationalPolicy',
  'otherRegionalPolicy',
  'otherAdaptationSector',
]

const researchFormFields = [
  'researchDescription',
  'researchType',
  'researchTargetAudience',
  'researchAuthor',
  'researchPaper',
]

export default ({ field }) => {
  const { updateAdaptationDetailsForm: updateForm, adaptationDetailsForm: form } =
    useContext(formContext)
  const { name: fieldName, description, type } = field
  let [placeholder, helperText, tree] = description?.split('::').map(s => s.trim()) || []
  const { name: inputType } = type
  const isRequired = !inputType
  const value = form[fieldName]

  if (helperText === '') {
    helperText = ` `
  }

  if (fieldName === 'fileUploads') {
    return (
      <FileUpload
        updateValue={val => updateForm({ [fieldName]: val })}
        key={fieldName}
        placeholder={placeholder}
        helperText={helperText}
        value={value}
      />
    )
  }

  /**
   * Controlled vocabulary
   */
  if (fieldName === 'nationalPolicy') {
    return (
      <ControlledVocabularySelect
        key={fieldName}
        tree={tree}
        root="National policy"
        name={fieldName}
        value={value}
        error={isRequired && !value}
        onChange={val => updateForm({ [fieldName]: val, target: undefined })}
        placeholder={placeholder}
        helperText={helperText}
      />
    )
  } else if (fieldName === 'otherNationalPolicy') {
    if (!form?.nationalPolicy?.term?.match(/^Other\s/)) {
      return null
    }
  } else if (fieldName === 'target') {
    if (form.nationalPolicy) {
      return (
        <ControlledVocabularySelect
          key={fieldName}
          tree={tree}
          root={form.nationalPolicy}
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

  if (fieldName === 'regionalPolicy') {
    return (
      <ControlledVocabularySelect
        key={fieldName}
        tree={tree}
        root={'Regional policy'}
        name={fieldName}
        value={value}
        error={isRequired && !value}
        onChange={val => updateForm({ [fieldName]: val, otherRegionalPolicy: undefined })}
        placeholder={placeholder}
        helperText={helperText}
      />
    )
  } else if (fieldName === 'otherRegionalPolicy') {
    if (!form?.regionalPolicy?.term?.match(/^Other\s/)) {
      return null
    }
  }

  /**
   * Controlled vocabulary
   */
  if (fieldName === 'adaptationSector') {
    return (
      <ControlledVocabularySelect
        key={fieldName}
        tree={tree}
        root="Adaptation sector"
        name={fieldName}
        value={value}
        error={isRequired && !value}
        onChange={val => updateForm({ [fieldName]: val, otherAdaptationSector: undefined })}
        placeholder={placeholder}
        helperText={helperText}
      />
    )
  } else if (fieldName === 'otherAdaptationSector') {
    if (!form?.adaptationSector?.term?.match(/Other\s/)) {
      return null
    }
  }

  /**
   * Controlled vocabulary
   */
  if (fieldName === 'hazard') {
    return (
      <ControlledVocabularySelect
        key={fieldName}
        tree={tree}
        root="Hazard"
        name={fieldName}
        value={value}
        error={isRequired && !value}
        onChange={val => updateForm({ [fieldName]: val, otherHazard: undefined })}
        placeholder={placeholder}
        helperText={helperText}
      />
    )
  } else if (fieldName === 'otherHazard') {
    if (!form.hazard || form.hazard.term !== 'Other (Please specify)') {
      return null
    }
  }

  if (researchFormFields.includes(fieldName)) {
    if (!(form['hasResearch'] || '').toBoolean()) {
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
      value={form[fieldName] || ''}
      updateValue={val => updateForm({ [fieldName]: val })}
      multiline={multilineFields.includes(fieldName)}
    />
  )
}
