import { useContext } from 'react'
import { GqlBoundFormInput, context as formContext, EnumField } from '../gql-form-binder'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import PlusIcon from 'mdi-react/PlusIcon'
import Collapse from '../../../components/collapse'
import useTheme from '@material-ui/core/styles/useTheme'
import FormIcon from 'mdi-react/PencilIcon'
import DeleteIcon from 'mdi-react/DeleteIcon'

const multilineFields = ['description']

const basicEnumFields = []

export default () => {
  const theme = useTheme()
  const {
    adaptationFields,
    adaptationForms,
    updateAdaptationForm,
    addAdaptationForm,
    removeAdaptationForm,
  } = useContext(formContext)

  return (
    <>
      {adaptationForms.map((form, i) => {
        return (
          <div key={i} style={{ marginBottom: theme.spacing(2) }}>
            <Collapse
              avatarStyle={{ backgroundColor: theme.palette.primary.light }}
              Icon={FormIcon}
              title={form.title || 'No title'}
              actions={[
                <IconButton
                  onClick={e => {
                    e.stopPropagation()
                    removeAdaptationForm(i)
                  }}
                  key="delete"
                >
                  <DeleteIcon />
                </IconButton>,
              ]}
            >
              <div style={{ padding: theme.spacing(2) }}>
                {adaptationFields.map(field => {
                  const { name, description, type } = field
                  const [placeholder, helperText] =
                    description?.split('::').map(s => s.trim()) || []
                  const { name: inputType, ofType } = type
                  const gqlType = inputType || ofType.name
                  const isRequired = !inputType

                  /**
                   * Simple E-num lists
                   */
                  if (basicEnumFields.includes(gqlType)) {
                    const value = form[name]
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
                        onChange={e => updateAdaptationForm({ [name]: e.target.value }, i)}
                        options={enumValues}
                        value={form[name] || enumValues[0].name} // TODO - default should be elsewhere
                      />
                    )
                  }

                  return (
                    <GqlBoundFormInput
                      key={name}
                      field={field}
                      value={form[name] || ''}
                      updateValue={val => updateAdaptationForm({ [name]: val }, i)}
                      multiline={multilineFields.includes(name)}
                    />
                  )
                })}
              </div>
            </Collapse>
          </div>
        )
      })}
      <div style={{ display: 'flex' }}>
        <Button
          variant="contained"
          disableElevation
          color="primary"
          onClick={addAdaptationForm}
          endIcon={<PlusIcon />}
          style={{ marginLeft: 'auto' }}
        >
          Add adaptation component
        </Button>
      </div>
    </>
  )
}
