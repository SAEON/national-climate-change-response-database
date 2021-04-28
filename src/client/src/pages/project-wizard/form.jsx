import Wrapper from './wrapper'
import { StringField, DateTimeField, IntField, MoneyField, BooleanField } from './form-components'

export default ({ fields, form, updateForm, title = undefined, multilineFields }) => {
  return (
    <Wrapper title={title}>
      {fields.map(({ name, description, type }) => {
        const [placeholder, helperText] = description?.split('::').map(s => s.trim()) || []
        const { name: inputType, ofType } = type
        const gqlType = inputType || ofType.name
        const isRequired = !inputType

        if (gqlType === 'String') {
          const isMultilineText = multilineFields.includes(name)
          return (
            <StringField
              error={isRequired && !form[name]}
              multiline={isMultilineText}
              rows={isMultilineText ? 4 : 1}
              placeholder={placeholder}
              helperText={helperText}
              name={placeholder}
              key={name}
              value={form[name] || ''}
              onChange={e => updateForm({ [name]: e.target.value })}
            />
          )
        }

        if (gqlType === 'DateTime') {
          return (
            <DateTimeField
              error={isRequired && !form[name]}
              key={name}
              placeholder={placeholder}
              name={placeholder}
              helperText={helperText}
              value={form[name] || new Date()}
              onChange={val => updateForm({ [name]: val })}
            />
          )
        }

        if (gqlType === 'Money') {
          return (
            <MoneyField
              error={isRequired && !form[name]}
              placeholder={placeholder}
              helperText={helperText}
              name={placeholder}
              key={name}
              value={form[name] || ''}
              onChange={e => updateForm({ [name]: e.target.value })}
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
              value={form[name] || 'false'}
              onChange={e => updateForm({ [name]: e.target.value })}
            />
          )
        }

        if (gqlType === 'Int') {
          return <IntField key={name} />
        }

        throw new Error(`The form builder encountered an unknown GraphQL type - ${gqlType}`)
      })}
    </Wrapper>
  )
}
