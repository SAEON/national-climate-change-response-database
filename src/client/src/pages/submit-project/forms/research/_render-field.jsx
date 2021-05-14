import { useContext } from 'react'
import { GqlBoundFormInput, context as formContext } from '../../gql-form-binder'

const multilineFields = ['description']

export default ({ field, i }) => {
  const { updateResearchForm, researchForms } = useContext(formContext)
  const form = researchForms[i]
  const { name: fieldName } = field

  if (fieldName === 'associatedProjectComponent') {
    return 'hi'
  }

  return (
    <GqlBoundFormInput
      i={i}
      key={fieldName}
      field={field}
      value={form[fieldName] || ''}
      updateValue={val => updateResearchForm({ [fieldName]: val }, i)}
      multiline={multilineFields.includes(fieldName)}
    />
  )
}
