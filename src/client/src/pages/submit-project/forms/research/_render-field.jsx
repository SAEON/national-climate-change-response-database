import { useContext } from 'react'
import { GqlBoundFormInput, context as formContext, EnumField } from '../../gql-form-binder'

const multilineFields = ['description']

const basicEnumFields = []

export default ({ field, i }) => {
  const { updateResearchForm, researchForms } = useContext(formContext)
  const form = researchForms[i]

  const { name: fieldName, description, type } = field
  const [placeholder, helperText] = description?.split('::').map(s => s.trim()) || []
  const { name: inputType, ofType } = type
  const gqlType = inputType || ofType.name
  const isRequired = !inputType

  /**
   * Simple E-num lists
   */
  if (basicEnumFields.includes(gqlType)) {
    const value = form[fieldName]
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
        onChange={e => updateResearchForm({ [fieldName]: e.target.value }, i)}
        options={enumValues}
        value={form[fieldName] || enumValues[0].name} // TODO - default should be elsewhere
      />
    )
  }

  return (
    <GqlBoundFormInput
      key={fieldName}
      field={field}
      value={form[fieldName] || ''}
      updateValue={val => updateResearchForm({ [fieldName]: val }, i)}
      multiline={multilineFields.includes(fieldName)}
    />
  )
}
