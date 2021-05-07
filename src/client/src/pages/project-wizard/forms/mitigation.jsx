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
                  const { name: fieldName, description, type } = field
                  const [placeholder, helperText] =
                    description?.split('::').map(s => s.trim()) || []
                  const { name: inputType, ofType } = type
                  const gqlType = inputType || ofType.name
                  const isRequired = !inputType
                  const value = form[fieldName]

                  /**
                   * Controlled vocabulary
                   */
                  if (fieldName === 'hostSector') {
                    return (
                      <ControlledVocabularyInput
                        key={fieldName}
                        tree="mitigationSectors"
                        root="Mitigation sector"
                        name={fieldName}
                        value={value}
                        error={isRequired && !value}
                        onChange={val =>
                          updateMitigationForm(
                            {
                              [fieldName]: val,
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
                  } else if (fieldName === 'hostSubSectorPrimary') {
                    if (form['hostSector']) {
                      return (
                        <ControlledVocabularyInput
                          key={fieldName}
                          tree="mitigationSectors"
                          root={form['hostSector']}
                          name={fieldName}
                          value={value}
                          error={isRequired && !value}
                          isRequired={isRequired}
                          onChange={val =>
                            updateMitigationForm(
                              { [fieldName]: val, hostSubSectorSecondary: undefined },
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
                  } else if (fieldName === 'hostSubSectorSecondary') {
                    if (form['hostSubSectorPrimary']) {
                      return (
                        <ControlledVocabularyInput
                          key={fieldName}
                          tree="mitigationSectors"
                          root={form['hostSubSectorPrimary']}
                          name={fieldName}
                          value={value}
                          error={isRequired && !value}
                          isRequired={isRequired}
                          onChange={val => updateMitigationForm({ [fieldName]: val }, i)}
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
                  if (fieldName === 'cdmMethodology') {
                    return (
                      <ControlledVocabularyInput
                        key={fieldName}
                        tree="cdmMethodology"
                        root="CDM methodology"
                        name={fieldName}
                        value={value}
                        error={isRequired && !value}
                        onChange={val => updateMitigationForm({ [fieldName]: val }, i)}
                        placeholder={placeholder}
                        helperText={helperText}
                      />
                    )
                  }

                  /**
                   * Controlled vocabulary
                   */
                  if (fieldName === 'cdmExecutiveStatus') {
                    return (
                      <ControlledVocabularyInput
                        key={fieldName}
                        tree="executiveStatus"
                        root="Executive status"
                        name={fieldName}
                        value={value}
                        error={isRequired && !value}
                        onChange={val => updateMitigationForm({ [fieldName]: val }, i)}
                        placeholder={placeholder}
                        helperText={helperText}
                      />
                    )
                  }

                  /**
                   * Controlled vocabulary
                   */
                  if (fieldName === 'interventionStatus') {
                    return (
                      <ControlledVocabularyInput
                        key={fieldName}
                        tree="interventionStatus"
                        root="Intervention status"
                        name={fieldName}
                        value={value}
                        error={isRequired && !value}
                        onChange={val => updateMitigationForm({ [fieldName]: val }, i)}
                        placeholder={placeholder}
                        helperText={helperText}
                      />
                    )
                  }

                  /**
                   * Controlled vocabulary
                   */
                  if (fieldName === 'mitigationType') {
                    return (
                      <ControlledVocabularyInput
                        key={fieldName}
                        tree="mitigationTypes"
                        root="Type of Mitigation"
                        name={fieldName}
                        value={value}
                        error={isRequired && !value}
                        onChange={val => {
                          updateMitigationForm(
                            { [fieldName]: val, mitigationSubType: undefined },
                            i
                          )
                        }}
                        placeholder={placeholder}
                        helperText={helperText}
                      />
                    )
                  } else if (fieldName === 'mitigationSubType') {
                    if (form['mitigationType']) {
                      return (
                        <ControlledVocabularyInput
                          key={fieldName}
                          tree="mitigationTypes"
                          root={form['mitigationType']}
                          name={fieldName}
                          value={value}
                          error={isRequired && !value}
                          isRequired={isRequired}
                          onChange={val => updateMitigationForm({ [fieldName]: val }, i)}
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
                        onChange={e => updateMitigationForm({ [fieldName]: e.target.value }, i)}
                        options={enumValues}
                        value={form[fieldName] || enumValues[0].name}
                      />
                    )
                  }

                  return (
                    <GqlBoundFormInput
                      key={fieldName}
                      field={field}
                      value={value || ''}
                      updateValue={val => updateMitigationForm({ [fieldName]: val }, i)}
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
