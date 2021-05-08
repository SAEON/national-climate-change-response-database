import { useContext } from 'react'
import {
  GqlBoundFormInput,
  context as formContext,
  EnumField,
  ControlledVocabularyInput,
} from '../../gql-form-binder'

const multilineFields = ['description', 'validationComments']
const basicEnumFields = []

export default ({ field }) => {
  const { projectForm, updateProjectForm } = useContext(formContext)
  const { name: fieldName, description, type } = field
  const [placeholder, helperText] = description?.split('::').map(s => s.trim()) || []
  const { name: inputType, ofType } = type
  const gqlType = inputType || ofType.name
  const isRequired = !inputType
  const value = projectForm[fieldName]

  /**
   * Controlled vocabulary
   */
  if (fieldName === 'validationStatus') {
    return (
      <ControlledVocabularyInput
        key={fieldName}
        tree="projectValidationStatus"
        root="Validation Status"
        name={fieldName}
        value={value}
        error={isRequired && !value}
        onChange={val => updateProjectForm({ [fieldName]: val })}
        placeholder={placeholder}
        helperText={helperText}
      />
    )
  }

  /**
   * Controlled vocabulary
   */
  if (fieldName === 'hostSector') {
    return (
      <ControlledVocabularyInput
        key={fieldName}
        tree="hostSectors"
        root="Host sector"
        name={fieldName}
        value={value}
        error={isRequired && !value}
        onChange={val => {
          updateProjectForm({ [fieldName]: val, hostSubSector: undefined })
        }}
        placeholder={placeholder}
        helperText={helperText}
      />
    )
  } else if (fieldName === 'hostSubSector') {
    if (projectForm['hostSector']) {
      return (
        <ControlledVocabularyInput
          key={fieldName}
          tree="hostSectors"
          root={projectForm['hostSector']}
          name={fieldName}
          value={value}
          isRequired={isRequired}
          error={isRequired && !value}
          onChange={val => updateProjectForm({ [fieldName]: val })}
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
  if (fieldName === 'interventionType') {
    return (
      <ControlledVocabularyInput
        key={fieldName}
        tree="interventionTypes"
        root="Intervention type"
        name={fieldName}
        value={value}
        error={isRequired && !value}
        onChange={val => updateProjectForm({ [fieldName]: val })}
        placeholder={placeholder}
        helperText={helperText}
      />
    )
  }

  /**
   * Controlled vocabulary
   */
  if (fieldName === 'projectType') {
    return (
      <ControlledVocabularyInput
        key={fieldName}
        tree="projectTypes"
        root="Project type"
        name={fieldName}
        value={value}
        error={isRequired && !value}
        onChange={val => updateProjectForm({ [fieldName]: val })}
        placeholder={placeholder}
        helperText={helperText}
      />
    )
  }

  /**
   * Controlled vocabulary
   */
  if (fieldName === 'projectStatus') {
    return (
      <ControlledVocabularyInput
        key={fieldName}
        tree="projectStatus"
        root="Project status"
        name={fieldName}
        value={value}
        error={isRequired && !value}
        onChange={val => updateProjectForm({ [fieldName]: val })}
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
      <ControlledVocabularyInput
        key={fieldName}
        tree="budgetRanges"
        root="Estimated budget"
        name={fieldName}
        value={value}
        error={isRequired && !value}
        onChange={val => updateProjectForm({ [fieldName]: val })}
        placeholder={placeholder}
        helperText={helperText}
      />
    )
  }

  /**
   * Controlled vocabulary
   */
  if (fieldName === 'fundingStatus') {
    return (
      <ControlledVocabularyInput
        key={fieldName}
        tree="projectFunding"
        root="Funding status"
        name={fieldName}
        value={value}
        error={isRequired && !value}
        onChange={val => updateProjectForm({ [fieldName]: val })}
        placeholder={placeholder}
        helperText={helperText}
      />
    )
  }

  /**
   * Simple E-num lists
   */
  if (basicEnumFields.includes(gqlType)) {
    const enumValues = (type.enumValues || type.ofType.enumValues).map(({ name, description }) => {
      return { name, description }
    })
    return (
      <EnumField
        key={fieldName}
        name={placeholder}
        placeholder={placeholder}
        helperText={helperText}
        error={isRequired && !value}
        onChange={e => updateProjectForm({ [fieldName]: e.target.value })}
        options={enumValues}
        value={value || enumValues[0].name}
      />
    )
  }

  return (
    <GqlBoundFormInput
      key={fieldName}
      field={field}
      value={value || ''}
      updateValue={val => updateProjectForm({ [fieldName]: val })}
      multiline={multilineFields.includes(fieldName)}
    />
  )
}
