import { useContext } from 'react'
import {
  GqlBoundFormInput,
  context as formContext,
  ControlledVocabularySelect,
} from '../../gql-form-binder'

const multilineFields = ['description']

const researchFormFields = [
  'researchDescription',
  'researchType',
  'researchTargetAudience',
  'researchAuthor',
  'researchPaper',
]

export default ({ field }) => {
  const { updateAdaptationDetailsForm, adaptationDetailsForm: form } = useContext(formContext)
  const { name: fieldName, description, type } = field
  const [placeholder, helperText] = description?.split('::').map(s => s.trim()) || []
  const { name: inputType, ofType } = type
  const gqlType = inputType || ofType.name
  const isRequired = !inputType
  const value = form[fieldName]

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
        onChange={val => updateAdaptationDetailsForm({ [fieldName]: val })}
        placeholder={placeholder}
        helperText={helperText}
      />
    )
  }

  /**
   * Controlled vocabulary
   */
  if (fieldName === 'adaptationSector') {
    return (
      <ControlledVocabularySelect
        key={fieldName}
        tree="adaptationSectors"
        root="Adaptation sector"
        name={fieldName}
        value={value}
        error={isRequired && !value}
        onChange={val => updateAdaptationDetailsForm({ [fieldName]: val })}
        placeholder={placeholder}
        helperText={helperText}
      />
    )
  }

  /**
   * Controlled vocabulary
   */
  if (fieldName === 'hazardFamily') {
    return (
      <ControlledVocabularySelect
        key={fieldName}
        tree="hazards"
        root="Hazard family"
        name={fieldName}
        value={value}
        error={isRequired && !value}
        onChange={val =>
          updateAdaptationDetailsForm({
            [fieldName]: val,
            hazardSubFamily: undefined,
            hazard: undefined,
            subHazard: undefined,
          })
        }
        placeholder={placeholder}
        helperText={helperText}
      />
    )
  } else if (fieldName === 'hazardSubFamily') {
    if (form['hazardFamily']) {
      return (
        <ControlledVocabularySelect
          key={fieldName}
          tree="hazards"
          root={form['hazardFamily']}
          name={fieldName}
          value={value}
          error={isRequired && !value}
          onChange={val =>
            updateAdaptationDetailsForm({
              [fieldName]: val,
              hazard: undefined,
              subHazard: undefined,
            })
          }
          placeholder={placeholder}
          helperText={helperText}
        />
      )
    } else {
      return null
    }
  } else if (fieldName === 'hazard') {
    if (form['hazardSubFamily']) {
      return (
        <ControlledVocabularySelect
          key={fieldName}
          tree="hazards"
          root={form['hazardSubFamily']}
          name={fieldName}
          value={value}
          error={isRequired && !value}
          onChange={val => updateAdaptationDetailsForm({ [fieldName]: val, subHazard: undefined })}
          placeholder={placeholder}
          helperText={helperText}
        />
      )
    } else {
      return null
    }
  } else if (fieldName === 'subHazard') {
    if (form['hazard']) {
      return (
        <ControlledVocabularySelect
          key={fieldName}
          tree="hazards"
          root={form['hazard']}
          name={fieldName}
          value={value}
          error={isRequired && !value}
          onChange={val => updateAdaptationDetailsForm({ [fieldName]: val })}
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
  if (fieldName === 'adaptationPurpose') {
    return (
      <ControlledVocabularySelect
        key={fieldName}
        tree="adaptationPurpose"
        root="Adaptation purpose"
        name={fieldName}
        value={value}
        error={isRequired && !value}
        onChange={val => updateAdaptationDetailsForm({ [fieldName]: val })}
        placeholder={placeholder}
        helperText={helperText}
      />
    )
  }

  if (gqlType === 'WKT_4326') {
    return 'hi'
  }

  if (researchFormFields.includes(fieldName)) {
    if (!(form['isResearch'] || '').toBoolean()) {
      return null
    }
  }

  if (fieldName === 'isResearch') {
    return (
      <GqlBoundFormInput
        key={fieldName}
        field={field}
        value={value || ''}
        updateValue={val =>
          updateAdaptationDetailsForm({
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
      updateValue={val => updateAdaptationDetailsForm({ [fieldName]: val })}
      multiline={multilineFields.includes(fieldName)}
    />
  )
}
