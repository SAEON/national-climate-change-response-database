import BooleanField from './_boolean'
import DateTimeField from './_datetime'
import IntField from './_int'
import MoneyField from './_money'
import StringField from './_string'
import EnumField from './_enum'

export default ({ field, value, disabled = false, updateValue, multiline }) => {
  const { name: fieldName, description, type } = field
  const [placeholder, helperText] = description?.split('::').map(s => s.trim()) || []
  const { name: inputType, ofType } = type
  const gqlType = inputType || ofType.name
  const isRequired = !inputType

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
        value={value}
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
        value={value || null} // null is allowed here
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
