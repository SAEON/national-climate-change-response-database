import { useContext } from 'react'
import {
  GqlBoundFormInput,
  context as formContext,
  EnumField,
  ControlledVocabularyInput,
  LocationsInput,
} from '../gql-form-binder'
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
                  const { name: fieldName, description, type } = field
                  const [placeholder, helperText] =
                    description?.split('::').map(s => s.trim()) || []
                  const { name: inputType, ofType } = type
                  const gqlType = inputType || ofType.name
                  const isRequired = !inputType
                  const value = form[fieldName]

                  /**
                   * WKT_4326
                   */
                  if (fieldName === 'xy') {
                    return <LocationsInput key={fieldName} />
                  }

                  /**
                   * Controlled vocabulary
                   */
                  if (fieldName === 'adaptationSector') {
                    return (
                      <ControlledVocabularyInput
                        key={fieldName}
                        tree="adaptationSectors"
                        root="Adaptation sector"
                        name={fieldName}
                        value={value}
                        error={isRequired && !value}
                        onChange={val => updateAdaptationForm({ [fieldName]: val }, i)}
                        placeholder={placeholder}
                        helperText={helperText}
                      />
                    )
                  }

                  /**
                   * Controlled vocabulary
                   */
                  if (fieldName === 'hazardFamily') {
                    return (
                      <ControlledVocabularyInput
                        key={fieldName}
                        tree="hazards"
                        root="Hazard family"
                        name={fieldName}
                        value={value}
                        error={isRequired && !value}
                        onChange={val =>
                          updateAdaptationForm(
                            {
                              [fieldName]: val,
                              hazardSubFamily: undefined,
                              hazard: undefined,
                              subHazard: undefined,
                            },
                            i
                          )
                        }
                        placeholder={placeholder}
                        helperText={helperText}
                      />
                    )
                  } else if (fieldName === 'hazardSubFamily') {
                    if (form['hazardFamily']) {
                      return (
                        <ControlledVocabularyInput
                          key={fieldName}
                          tree="hazards"
                          root={form['hazardFamily']}
                          name={fieldName}
                          value={value}
                          error={isRequired && !value}
                          onChange={val =>
                            updateAdaptationForm(
                              { [fieldName]: val, hazard: undefined, subHazard: undefined },
                              i
                            )
                          }
                          placeholder={placeholder}
                          helperText={helperText}
                        />
                      )
                    } else {
                      return null
                    }
                  } else if (fieldName === 'hazard') {
                    if (form['hazardSubFamily']) {
                      return (
                        <ControlledVocabularyInput
                          key={fieldName}
                          tree="hazards"
                          root={form['hazardSubFamily']}
                          name={fieldName}
                          value={value}
                          error={isRequired && !value}
                          onChange={val =>
                            updateAdaptationForm({ [fieldName]: val, subHazard: undefined }, i)
                          }
                          placeholder={placeholder}
                          helperText={helperText}
                        />
                      )
                    } else {
                      return null
                    }
                  } else if (fieldName === 'subHazard') {
                    if (form['hazard']) {
                      return (
                        <ControlledVocabularyInput
                          key={fieldName}
                          tree="hazards"
                          root={form['hazard']}
                          name={fieldName}
                          value={value}
                          error={isRequired && !value}
                          onChange={val => updateAdaptationForm({ [fieldName]: val }, i)}
                          placeholder={placeholder}
                          helperText={helperText}
                        />
                      )
                    } else {
                      return null
                    }
                  }

                  /**
                   * Controlled vocabulary
                   */
                  if (fieldName === 'adaptationPurpose') {
                    return (
                      <ControlledVocabularyInput
                        key={fieldName}
                        tree="adaptationPurpose"
                        root="Adaptation purpose"
                        name={fieldName}
                        value={value}
                        error={isRequired && !value}
                        onChange={val => updateAdaptationForm({ [fieldName]: val }, i)}
                        placeholder={placeholder}
                        helperText={helperText}
                      />
                    )
                  }

                  /**
                   * Simple E-num lists
                   */
                  if (basicEnumFields.includes(gqlType)) {
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
                        onChange={e => updateAdaptationForm({ [fieldName]: e.target.value }, i)}
                        options={enumValues}
                        value={form[fieldName] || enumValues[0].name} // TODO - default should be elsewhere
                      />
                    )
                  }

                  if (gqlType === 'WKT_4326') {
                    return 'hi'
                  }

                  return (
                    <GqlBoundFormInput
                      key={fieldName}
                      field={field}
                      value={form[fieldName] || ''}
                      updateValue={val => updateAdaptationForm({ [fieldName]: val }, i)}
                      multiline={multilineFields.includes(fieldName)}
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
          disableElevation
          variant="contained"
          onClick={addAdaptationForm}
          endIcon={<PlusIcon />}
          size="large"
          color="default"
          style={{ marginRight: 'auto' }}
        >
          Add adaptation component
        </Button>
      </div>
    </>
  )
}
