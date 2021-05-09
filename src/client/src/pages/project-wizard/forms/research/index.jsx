import { useContext } from 'react'
import { GqlBoundFormInput, context as formContext, EnumField } from '../../gql-form-binder'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import PlusIcon from 'mdi-react/PlusIcon'
import Collapse from '../../../../components/collapse'
import useTheme from '@material-ui/core/styles/useTheme'
import FormIcon from 'mdi-react/PencilIcon'
import DeleteIcon from 'mdi-react/DeleteIcon'
import RenderFields from './_render-fields'

const multilineFields = ['description']

const basicEnumFields = []

export default () => {
  const theme = useTheme()
  const {
    researchFields,
    researchForms,
    updateResearchForm,
    addResearchForm,
    removeResearchForm,
  } = useContext(formContext)

  return (
    <>
      {researchForms.map((form, i) => (
        <div key={i} style={{ marginBottom: theme.spacing(2) }}>
          <Collapse
            avatarStyle={{ backgroundColor: theme.palette.primary.light }}
            Icon={FormIcon}
            title={form.title || 'No title'}
            actions={[
              <IconButton
                onClick={e => {
                  e.stopPropagation()
                  removeResearchForm(i)
                }}
                key="delete"
              >
                <DeleteIcon />
              </IconButton>,
            ]}
          >
            <div style={{ padding: theme.spacing(2) }}>
              {researchFields.map(field => {
                const { name: fieldName, description, type } = field
                const [placeholder, helperText] = description?.split('::').map(s => s.trim()) || []
                const { name: inputType, ofType } = type
                const gqlType = inputType || ofType.name
                const isRequired = !inputType

                /**
                 * Simple E-num lists
                 */
                if (basicEnumFields.includes(gqlType)) {
                  const value = form[fieldName]
                  const enumValues = (type.enumValues || type.ofType.enumValues).map(
                    ({ name, description }) => {
                      return { name, description }
                    }
                  )
                  return (
                    <EnumField
                      key={fieldName}
                      name={placeholder}
                      placeholder={placeholder}
                      helperText={helperText}
                      error={isRequired && !value}
                      onChange={e => updateResearchForm({ [fieldName]: e.target.value }, i)}
                      options={enumValues}
                      value={form[fieldName] || enumValues[0].name} // TODO - default should be elsewhere
                    />
                  )
                }

                return (
                  <GqlBoundFormInput
                    key={fieldName}
                    field={field}
                    value={form[fieldName] || ''}
                    updateValue={val => updateResearchForm({ [fieldName]: val }, i)}
                    multiline={multilineFields.includes(fieldName)}
                  />
                )
              })}
            </div>
          </Collapse>
        </div>
      ))}
      <div style={{ display: 'flex' }}>
        <Button
          disableElevation
          variant="contained"
          onClick={addResearchForm}
          endIcon={<PlusIcon />}
          size="large"
          color="default"
          style={{ marginRight: 'auto' }}
        >
          Add research component
        </Button>
      </div>
    </>
  )
}
