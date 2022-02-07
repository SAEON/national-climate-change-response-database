import { useContext, lazy, Suspense } from 'react'
import {
  GqlBoundFormInput,
  ControlledVocabularySelect,
  ControlledVocabularySelectMultiple,
} from '../../form'
import { context as formContext } from '../../context'
import Loading from '../../../loading'

const ProgressCalculator = lazy(() => import('../../form/components/calculators/progress'))
const FileUpload = lazy(() => import('../../form/components/upload'))

const multilineFields = [
  'description',
  'otherHazard',
  'addressedClimateChangeImpact',
  'observedClimateChangeImpacts',
  'responseImpact',
  'otherNationalPolicy',
  'otherRegionalPolicy',
  'otherAdaptationSector',
  'otherTarget',
]

export default ({ field, formName }) => {
  const { updateAdaptationDetailsForm: updateForm, adaptationDetailsForm: form } =
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
          renderExpenditure
        />
      </Suspense>
    )
  }

  /**
   * Controlled vocabulary
   */
  if (fieldName === 'nationalPolicy') {
    return (
      <ControlledVocabularySelectMultiple
        key={fieldName}
        id={`${fieldName}-adaptation`}
        tree={tree}
        roots={['National policy']}
        name={fieldName}
        value={value}
        error={isRequired && !value}
        onChange={val =>
          updateForm({ [fieldName]: val, target: undefined, otherTarget: undefined })
        }
        label={placeholder}
        helperText={helperText}
      />
    )
  } else if (fieldName === 'otherNationalPolicy') {
    if (!form?.nationalPolicy?.find(({ term }) => term?.match(/^Other\s/))) {
      return null
    }
  } else if (fieldName === 'target') {
    if (form.nationalPolicy) {
      return (
        <ControlledVocabularySelectMultiple
          key={fieldName}
          id={fieldName}
          tree={tree}
          roots={form.nationalPolicy.map(({ term }) => term)}
          name={fieldName}
          value={value}
          error={isRequired && !value}
          onChange={val => updateForm({ [fieldName]: val, otherTarget: undefined })}
          label={placeholder}
          helperText={helperText}
        />
      )
    } else {
      return null
    }
  } else if (fieldName === 'otherTarget') {
    if (!form?.target || !form.target?.find(({ term }) => term?.match(/^Other/))) {
      return null
    }
  }

  if (fieldName === 'regionalPolicy') {
    return (
      <ControlledVocabularySelectMultiple
        key={fieldName}
        id={`${fieldName}-adaptation`}
        tree={tree}
        roots={['Regional policy']}
        name={fieldName}
        value={value}
        error={isRequired && !value}
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
      <ControlledVocabularySelectMultiple
        key={fieldName}
        tree={tree}
        id="hazard"
        roots={['Hazard']}
        name={fieldName}
        value={value}
        error={isRequired && !value}
        onChange={val => updateForm({ [fieldName]: val, otherHazard: undefined })}
        label={placeholder}
        helperText={helperText}
      />
    )
  } else if (fieldName === 'otherHazard') {
    if (!form.hazard?.find(({ term }) => term?.match(/^Other/))) {
      return null
    }
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
