import { useContext } from 'react'
import {
  GqlBoundFormInput,
  context as formContext,
  ControlledVocabularySelect,
  LocationsPicker,
} from '../../gql-form-binder'
import { context as authContext } from '../../../../contexts/authorization'

const multilineFields = ['description', 'validationComments']

export default ({ field }) => {
  const { hasPermission } = useContext(authContext)
  const { projectForm, updateProjectForm, resetMitigationForms, resetAdaptationForms } =
    useContext(formContext)
  const { name: fieldName, description, type } = field
  const [placeholder, helperText] = description?.split('::').map(s => s.trim()) || []
  const { name: inputType } = type
  const isRequired = !inputType
  const value = projectForm[fieldName]

  /**
   * WKT_4326
   */
  if (fieldName === 'yx') {
    return (
      <LocationsPicker
        onChange={(y, x) => {
          updateProjectForm({ [fieldName]: [...(projectForm[fieldName] || []), [y, x]] })
        }}
        setPoints={points => updateProjectForm({ [fieldName]: points })}
        points={projectForm[fieldName] || []}
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
          updateProjectForm({
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
    if (!projectForm.province) return null
    return (
      <ControlledVocabularySelect
        key={fieldName}
        tree="regions"
        root={projectForm.province}
        name={fieldName}
        value={value}
        error={isRequired && !value}
        onChange={val => updateProjectForm({ [fieldName]: val, localMunicipality: undefined })}
        placeholder={placeholder}
        helperText={helperText}
      />
    )
  } else if (fieldName === 'localMunicipality') {
    if (!projectForm.districtMunicipality) return null
    return (
      <ControlledVocabularySelect
        key={fieldName}
        tree="regions"
        root={projectForm.districtMunicipality}
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
        onChange={val => updateProjectForm({ [fieldName]: val })}
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
        updateValue={val => updateProjectForm({ [fieldName]: val })}
        multiline={multilineFields.includes(fieldName)}
      />
    )
  }

  /**
   * Controlled vocabulary
   */
  if (fieldName === 'hostSector') {
    return (
      <ControlledVocabularySelect
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
        <ControlledVocabularySelect
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
      <ControlledVocabularySelect
        key={fieldName}
        tree="interventionTypes"
        root="Intervention type"
        name={fieldName}
        value={value}
        error={isRequired && !value}
        onChange={val => {
          updateProjectForm({ [fieldName]: val })

          if (val?.term.toLowerCase() === 'adaptation' || !val?.term) {
            resetMitigationForms()
          }

          if (val?.term.toLowerCase() === 'mitigation' || !val?.term) {
            resetAdaptationForms()
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
  if (fieldName === 'projectType') {
    return (
      <ControlledVocabularySelect
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
      <ControlledVocabularySelect
        key={fieldName}
        tree="actionStatus"
        root="Status"
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
      <ControlledVocabularySelect
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
      <ControlledVocabularySelect
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
