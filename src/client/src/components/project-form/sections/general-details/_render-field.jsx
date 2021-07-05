import { useContext, lazy, Suspense } from 'react'
import { GqlBoundFormInput, ControlledVocabularySelect } from '../../form'
import { context as formContext } from '../../context'
import { context as authContext } from '../../../../contexts/authorization'
import Loading from '../../../loading'

const LocationsPicker = lazy(() => import('../../form/components/locations-picker'))

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
  let [placeholder, helperText, tree] = description?.split('::').map(s => s.trim()) || []
  const { name: inputType } = type
  const isRequired = !inputType
  const value = form[fieldName]

  if (helperText === '') {
    helperText = ` `
  }

  /**
   * WKT_4326
   */
  if (fieldName === 'yx') {
    return (
      <Suspense key={fieldName} fallback={<Loading />}>
        <LocationsPicker
          onChange={(y, x) => {
            updateForm({ [fieldName]: [...(form[fieldName] || []), [y, x]] })
          }}
          setPoints={points => updateForm({ [fieldName]: points })}
          points={form[fieldName] || []}
        />
      </Suspense>
    )
  }

  /**
   * Controlled vocabulary
   */
  if (fieldName === 'province') {
    return (
      <ControlledVocabularySelect
        key={fieldName}
        tree={tree}
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
        tree={tree}
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
        tree={tree}
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
        tree={tree}
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
        tree={tree}
        root="Intervention type"
        name={fieldName}
        value={value}
        error={isRequired && !value}
        onChange={val => {
          updateForm({ [fieldName]: val })
          resetMitigationDetailsForm()
          resetAdaptationDetailsForm()
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
        tree={tree}
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
        tree={tree}
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
        tree={tree}
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
