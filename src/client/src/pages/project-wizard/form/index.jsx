import CardHeader from '@material-ui/core/CardHeader'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import BooleanField from './_boolean'
import DateTimeField from './_datetime'
import IntField from './_int'
import MoneyField from './_money'
import StringField from './_string'

export { default as GraphQLFormProvider, context } from './_context'

export { default as Submit } from './_submit'

export default ({ fields, form, updateForm, title = undefined, multilineFields }) => {
  return (
    <Card variant="outlined">
      {title && <CardHeader title={title} />}
      <CardContent>
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
      </CardContent>
    </Card>
  )
}
