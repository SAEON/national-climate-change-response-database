import { useContext } from 'react'
import { GqlBoundFormInput, context as formContext } from './gql-form-binder'
import FormContainer from './_form-container'

const multilineFields = ['description', 'projectManager']

export default () => {
  const { projectFields, projectForm, updateProjectForm } = useContext(formContext)

  return (
    <FormContainer title="Enter project details">
      {projectFields.map(field => {
        const { name } = field

        return (
          <GqlBoundFormInput
            key={name}
            field={field}
            value={projectForm[name] || ''}
            updateValue={val => updateProjectForm({ [field.name]: val })}
            multiline={multilineFields.includes(name)}
          />
        )
      })}
    </FormContainer>
  )
}
