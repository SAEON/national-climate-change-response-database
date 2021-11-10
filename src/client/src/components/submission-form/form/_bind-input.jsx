import BooleanField from './components/boolean'
import DateTimeField from './components/datetime'
import IntField from './components/int'
import MoneyField from './components/money'
import StringField from './components/string'
import EnumField from './components/enum'

export default ({ field, value, disabled = false, updateValue, multiline }) => {
  const { name: fieldName, description, type } = field
  let [placeholder, helperText] = description?.split('::').map(s => s.trim()) || []
  const { name: inputType, ofType, kind } = type
  const gqlType = inputType || ofType.name
  const isRequired = kind === 'NON_NULL'

  if (helperText === '') {
    helperText = ` `
  }

  if (gqlType === 'String') {
    return (
      <StringField
        disabled={disabled}
        error={isRequired && !value}
        multiline={multiline}
        rows={multiline ? 4 : 1}
        placeholder={placeholder}
        helperText={helperText}
        name={placeholder}
        key={fieldName}
        value={value || ''}
        setValue={updateValue}
      />
    )
  }

  if (gqlType === 'DateTime') {
    return (
      <DateTimeField
        disabled={disabled}
        error={isRequired && !value}
        key={fieldName}
        placeholder={placeholder}
        name={placeholder}
        helperText={helperText}
        value={value || new Date().toISOString()}
        setValue={updateValue}
      />
    )
  }

  if (gqlType === 'Money') {
    return (
      <MoneyField
        disabled={disabled}
        error={isRequired && !value}
        placeholder={placeholder}
        helperText={helperText}
        name={placeholder}
        key={fieldName}
        value={value || ''}
        setValue={updateValue}
      />
    )
  }

  if (gqlType === 'Boolean') {
    return (
      <BooleanField
        disabled={disabled}
        placeholder={placeholder}
        helperText={helperText}
        name={placeholder}
        key={fieldName}
        value={value || 'false'}
        setValue={updateValue}
      />
    )
  }

  if (gqlType === 'Int') {
    return <IntField key={fieldName} />
  }

  if (type?.enumValues || type?.ofType?.enumValues) {
    const enumValues = (type.enumValues || type.ofType.enumValues).map(({ name, description }) => {
      return { name, description }
    })
    return (
      <EnumField
        disabled={disabled}
        key={fieldName}
        name={placeholder}
        placeholder={placeholder}
        helperText={helperText}
        error={isRequired && !value}
        setValue={updateValue}
        options={enumValues}
        value={value || enumValues[0].name}
      />
    )
  }

  throw new Error(
    `The GQL-type-to-form-input binder encountered an unknown GraphQL type - ${gqlType}. For field ${fieldName}`
  )
}
