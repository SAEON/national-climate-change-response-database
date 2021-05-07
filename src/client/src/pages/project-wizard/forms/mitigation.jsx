import { useContext } from 'react'
import {
  GqlBoundFormInput,
  context as formContext,
  ControlledVocabularyInput,
  EnumField,
} from '../gql-form-binder'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import PlusIcon from 'mdi-react/PlusIcon'
import Collapse from '../../../components/collapse'
import useTheme from '@material-ui/core/styles/useTheme'
import FormIcon from 'mdi-react/PencilIcon'
import DeleteIcon from 'mdi-react/DeleteIcon'

const multilineFields = ['description', 'volMethodology']

const basicEnumFields = []

export default () => {
  const theme = useTheme()
  const {
    mitigationFields,
    mitigationForms,
    updateMitigationForm,
    addMitigationForm,
    removeMitigationForm,
  } = useContext(formContext)

  return (
    <>
      {mitigationForms.map((form, i) => {
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
                    removeMitigationForm(i)
                  }}
                  key="delete"
                >
                  <DeleteIcon />
                </IconButton>,
              ]}
            >
              <div style={{ padding: theme.spacing(2) }}>
                {mitigationFields.map(field => {
                  const { name, description, type } = field
                  const [placeholder, helperText] =
                    description?.split('::').map(s => s.trim()) || []
                  const { name: inputType, ofType } = type
                  const gqlType = inputType || ofType.name
                  const isRequired = !inputType
                  const value = form[name]

                  /**
                   * Controlled vocabulary
                   */
                  if (name === 'hostSector') {
                    return (
                      <ControlledVocabularyInput
                        key={name}
                        tree="mitigationSectors"
                        root="Mitigation sector"
                        name={name}
                        value={value}
                        error={isRequired && !value}
                        onChange={val =>
                          updateMitigationForm(
                            {
                              [name]: val,
                              hostSubSectorPrimary: undefined,
                              hostSubSectorSecondary: undefined,
                            },
                            i
                          )
                        }
                        placeholder={placeholder}
                        helperText={helperText}
                      />
                    )
                  } else if (name === 'hostSubSectorPrimary') {
                    if (form['hostSector']) {
                      return (
                        <ControlledVocabularyInput
                          key={name}
                          tree="mitigationSectors"
                          root={form['hostSector']}
                          name={name}
                          value={value}
                          error={isRequired && !value}
                          isRequired={isRequired}
                          onChange={val =>
                            updateMitigationForm(
                              { [name]: val, hostSubSectorSecondary: undefined },
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
                  } else if (name === 'hostSubSectorSecondary') {
                    if (form['hostSubSectorPrimary']) {
                      return (
                        <ControlledVocabularyInput
                          key={name}
                          tree="mitigationSectors"
                          root={form['hostSubSectorPrimary']}
                          name={name}
                          value={value}
                          error={isRequired && !value}
                          isRequired={isRequired}
                          onChange={val => updateMitigationForm({ [name]: val }, i)}
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
                  if (name === 'cdmMethodology') {
                    return (
                      <ControlledVocabularyInput
                        key={name}
                        tree="cdmMethodology"
                        root="CDM methodology"
                        name={name}
                        value={value}
                        error={isRequired && !value}
                        onChange={val => updateMitigationForm({ [name]: val }, i)}
                        placeholder={placeholder}
                        helperText={helperText}
                      />
                    )
                  }

                  /**
                   * Controlled vocabulary
                   */
                  if (name === 'cdmExecutiveStatus') {
                    return (
                      <ControlledVocabularyInput
                        key={name}
                        tree="executiveStatus"
                        root="Executive status"
                        name={name}
                        value={value}
                        error={isRequired && !value}
                        onChange={val => updateMitigationForm({ [name]: val }, i)}
                        placeholder={placeholder}
                        helperText={helperText}
                      />
                    )
                  }

                  /**
                   * Controlled vocabulary
                   */
                  if (name === 'interventionStatus') {
                    return (
                      <ControlledVocabularyInput
                        key={name}
                        tree="interventionStatus"
                        root="Intervention status"
                        name={name}
                        value={value}
                        error={isRequired && !value}
                        onChange={val => updateMitigationForm({ [name]: val }, i)}
                        placeholder={placeholder}
                        helperText={helperText}
                      />
                    )
                  }

                  /**
                   * Controlled vocabulary
                   */
                  if (name === 'mitigationType') {
                    return (
                      <ControlledVocabularyInput
                        key={name}
                        tree="mitigationTypes"
                        root="Type of Mitigation"
                        name={name}
                        value={value}
                        error={isRequired && !value}
                        onChange={val => {
                          updateMitigationForm({ [name]: val, mitigationSubType: undefined }, i)
                        }}
                        placeholder={placeholder}
                        helperText={helperText}
                      />
                    )
                  } else if (name === 'mitigationSubType') {
                    if (form['mitigationType']) {
                      return (
                        <ControlledVocabularyInput
                          key={name}
                          tree="mitigationTypes"
                          root={form['mitigationType']}
                          name={name}
                          value={value}
                          error={isRequired && !value}
                          isRequired={isRequired}
                          onChange={val => updateMitigationForm({ [name]: val }, i)}
                          placeholder={placeholder}
                          helperText={helperText}
                        />
                      )
                    } else {
                      return null
                    }
                  }

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
                        onChange={e => updateMitigationForm({ [name]: e.target.value }, i)}
                        options={enumValues}
                        value={form[name] || enumValues[0].name}
                      />
                    )
                  }

                  return (
                    <GqlBoundFormInput
                      key={name}
                      field={field}
                      value={value || ''}
                      updateValue={val => updateMitigationForm({ [name]: val }, i)}
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
          onClick={addMitigationForm}
          endIcon={<PlusIcon />}
          size="large"
          color="default"
          style={{ marginRight: 'auto' }}
        >
          Add mitigation component
        </Button>
      </div>
    </>
  )
}
