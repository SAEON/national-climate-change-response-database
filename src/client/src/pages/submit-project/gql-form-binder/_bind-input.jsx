import BooleanField from './_boolean'
import DateTimeField from './_datetime'
import IntField from './_int'
import MoneyField from './_money'
import StringField from './_string'

export default ({ field, value, updateValue, multiline, i = 0 }) => {
  const { name, description, type } = field
  const [placeholder, helperText] = description?.split('::').map(s => s.trim()) || []
  const { name: inputType, ofType } = type
  const gqlType = inputType || ofType.name
  const isRequired = !inputType

  if (gqlType === 'String') {
    return (
      <StringField
        i={i}
        error={isRequired && !value}
        multiline={multiline}
        rows={multiline ? 4 : 1}
        placeholder={placeholder}
        helperText={helperText}
        name={placeholder}
        key={name}
        value={value}
        setValue={updateValue}
      />
    )
  }

  if (gqlType === 'DateTime') {
    return (
      <DateTimeField
        i={i}
        error={isRequired && !value}
        key={name}
        placeholder={placeholder}
        name={placeholder}
        helperText={helperText}
        value={value || new Date()}
        onChange={updateValue}
      />
    )
  }

  if (gqlType === 'Money') {
    return (
      <MoneyField
        i={i}
        error={isRequired && !value}
        placeholder={placeholder}
        helperText={helperText}
        name={placeholder}
        key={name}
        value={value || ''}
        setValue={updateValue}
      />
    )
  }

  if (gqlType === 'Boolean') {
    return (
      <BooleanField
        i={i}
        placeholder={placeholder}
        helperText={helperText}
        name={placeholder}
        key={name}
        value={value || 'false'}
        onChange={e => updateValue(e.target.value)}
      />
    )
  }

  if (gqlType === 'Int') {
    return <IntField key={name} />
  }

  throw new Error(
    `The GQL-type-to-form-input binder encountered an unknown GraphQL type - ${gqlType}. For field ${name}`
  )
}
