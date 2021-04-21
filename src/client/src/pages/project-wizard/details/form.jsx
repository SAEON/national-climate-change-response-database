import Wrapper from '../wrapper'
import { StringField, DateTimeField, IntField, MoneyField, BooleanField } from '../form-components'

const MULTILINE_FIELDS = ['description', 'projectManager']

export default ({ fields }) => {
  return (
    <Wrapper title="Project details">
      {fields.map(({ name, description, type }) => {
        const [placeholder, helperText] = description?.split('::').map(s => s.trim()) || []
        const { name: inputType, ofType } = type
        const gqlType = inputType || ofType.name

        if (gqlType === 'String') {
          const isMultilineText = MULTILINE_FIELDS.includes(name)
          return (
            <StringField
              multiline={isMultilineText}
              rows={isMultilineText ? 4 : 1}
              placeholder={placeholder}
              helperText={helperText}
              name={placeholder}
              key={name}
            />
          )
        }

        if (gqlType === 'DateTime') {
          return (
            <DateTimeField placeholder={placeholder} name={placeholder} helperText={helperText} />
          )
        }

        if (gqlType === 'Int') {
          return <IntField />
        }

        if (gqlType === 'Money') {
          return (
            <MoneyField
              placeholder={placeholder}
              helperText={helperText}
              name={placeholder}
              key={name}
            />
          )
        }

        if (gqlType === 'Boolean') {
          return (
            <BooleanField
              placeholder={placeholder}
              helperText={helperText}
              name={placeholder}
              key={name}
            />
          )
        }

        throw new Error('The form builder encountered an unknown GraphQL type')
      })}
    </Wrapper>
  )
}
