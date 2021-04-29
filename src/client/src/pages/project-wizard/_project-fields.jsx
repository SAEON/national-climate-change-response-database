import { useContext } from 'react'
import { GqlBoundFormInput, context as formContext, EnumField } from './gql-form-binder'
import FormContainer from './_form-container'

const multilineFields = ['description', 'projectManager', 'validationComments']

const basicEnumFields = [
  'InterventionType',
  'ProjectStatus',
  'FundingStatus',
  'ValidationStatus',
  'BudgetRages',
]

export default () => {
  const { projectFields, projectForm, updateProjectForm } = useContext(formContext)

  return (
    <FormContainer title="Enter project details">
      {projectFields.map(field => {
        const { name, description, type } = field
        const [placeholder, helperText] = description?.split('::').map(s => s.trim()) || []
        const { name: inputType, ofType } = type
        const gqlType = inputType || ofType.name
        const isRequired = !inputType

        /**
         * Simple E-num lists
         */
        if (basicEnumFields.includes(gqlType)) {
          const value = projectForm[name]
          const enumValues = (type.enumValues || type.ofType.enumValues).map(
            ({ name, description }) => {
              return { name, description }
            }
          )
          return (
            <EnumField
              key={name}
              name={placeholder}
              placeholder={placeholder}
              helperText={helperText}
              error={isRequired && !value}
              onChange={e => updateProjectForm({ [name]: e.target.value })}
              options={enumValues}
              value={projectForm[name] || enumValues[0].name} // TODO - default should be elsewhere
            />
          )
        }

        return (
          <GqlBoundFormInput
            key={name}
            field={field}
            value={projectForm[name] || ''}
            updateValue={val => updateProjectForm({ [name]: val })}
            multiline={multilineFields.includes(name)}
          />
        )
      })}
    </FormContainer>
  )
}
