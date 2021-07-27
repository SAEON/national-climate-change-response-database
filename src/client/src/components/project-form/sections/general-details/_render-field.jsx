import { useContext, lazy, Suspense } from 'react'
import {
  GqlBoundFormInput,
  ControlledVocabularySelect,
  ControlledVocabularySelectMultiple,
  StringField,
} from '../../form'
import { context as formContext } from '../../context'
import { context as authContext } from '../../../../contexts/authorization'
import Loading from '../../../loading'

const LocationsPicker = lazy(() => import('../../form/components/locations-picker'))

const multilineFields = [
  'description',
  '__submissionComments',
  'projectManagerPhysicalAddress',
  'projectManagerPostalAddress',
  'otherImplementingPartners',
  'fundingTypeOther',
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
  const { kind } = type
  const isRequired = kind === 'NON_NULL'
  const value = form?.[fieldName] || undefined

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
      <ControlledVocabularySelectMultiple
        id="select-province"
        key={fieldName}
        tree={tree}
        roots={['South Africa']}
        name={fieldName}
        value={value}
        error={isRequired && !value?.length}
        onChange={val =>
          updateForm({
            [fieldName]: val,
            districtMunicipality: undefined,
            localMunicipality: undefined,
          })
        }
        label={placeholder}
        helperText={helperText}
      />
    )
  } else if (fieldName === 'districtMunicipality') {
    if (!form.province?.length) {
      return null
    }
    if (form.province.length === 1 && form.province[0].term === 'National') {
      return null
    }
    return (
      <ControlledVocabularySelectMultiple
        id="select-district-municipality"
        key={fieldName}
        tree={tree}
        roots={form.province}
        name={fieldName}
        value={value}
        error={isRequired && !value?.length}
        onChange={val => updateForm({ [fieldName]: val, localMunicipality: undefined })}
        label={placeholder}
        helperText={helperText}
      />
    )
  } else if (fieldName === 'localMunicipality') {
    if (!form.districtMunicipality?.length) {
      return null
    }
    return (
      <ControlledVocabularySelectMultiple
        id="select-local-municipality"
        key={fieldName}
        tree={tree}
        roots={form.districtMunicipality}
        name={fieldName}
        value={value}
        error={isRequired && !value?.length}
        onChange={val => updateForm({ [fieldName]: val })}
        label={placeholder}
        helperText={helperText}
      />
    )
  }

  /**
   * Controlled vocabulary
   */
  if (fieldName === '__submissionStatus') {
    if (!form.__submissionStatus) {
      setImmediate(() => updateForm({ __submissionStatus: { term: 'Pending' } }))
      return null
    }
    return (
      <ControlledVocabularySelect
        key={fieldName}
        tree={'projectValidationStatus'}
        root="Validation Status"
        name={'Submission status'}
        disabled={!hasPermission('validate-submission')}
        value={value}
        error={isRequired && !value}
        onChange={val => updateForm({ [fieldName]: val })}
        placeholder={'Submission status '}
        helperText={'Has this submission been validated?'}
      />
    )
  }

  /**
   * Validation comments (limited user access)
   */
  if (fieldName === '__submissionComments') {
    return (
      <StringField
        disabled={!hasPermission('validate-submission')}
        error={isRequired && !value}
        multiline={multilineFields.includes(fieldName)}
        rows={4}
        placeholder={'Submission comments'}
        helperText={'Please leave comments RE. the submission status'}
        name={'Submission comments'}
        key={fieldName}
        value={value}
        setValue={val => updateForm({ [fieldName]: val })}
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
  } else if (fieldName === 'fundingTypeOther') {
    if (!form.fundingType?.term.match(/Other/)) {
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
