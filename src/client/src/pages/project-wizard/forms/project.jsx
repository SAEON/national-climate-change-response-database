import { useContext } from 'react'
import {
  GqlBoundFormInput,
  context as formContext,
  EnumField,
  ControlledVocabularyInput,
} from '../gql-form-binder'
import CardHeader from '@material-ui/core/CardHeader'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import useTheme from '@material-ui/core/styles/useTheme'

const multilineFields = ['description', 'validationComments']

const basicEnumFields = []

export default () => {
  const theme = useTheme()
  const { projectFields, projectForm, updateProjectForm } = useContext(formContext)

  return (
    <Card variant="outlined" style={{ backgroundColor: theme.backgroundColor }}>
      <CardHeader title={'Enter project details'} />
      <CardContent>
        {projectFields.map(field => {
          const { name, description, type } = field
          const [placeholder, helperText] = description?.split('::').map(s => s.trim()) || []
          const { name: inputType, ofType } = type
          const gqlType = inputType || ofType.name
          const isRequired = !inputType
          const value = projectForm[name]

          /**
           * Controlled vocabulary
           */
          if (name === 'validationStatus') {
            return (
              <ControlledVocabularyInput
                key={name}
                tree="projectValidationStatus"
                root="Validation Status"
                name={name}
                value={value}
                error={isRequired && !value}
                onChange={val => updateProjectForm({ [name]: val })}
                placeholder={placeholder}
                helperText={helperText}
              />
            )
          }

          /**
           * Controlled vocabulary
           */
          if (name === 'hostSector') {
            return (
              <ControlledVocabularyInput
                key={name}
                tree="hostSectors"
                root="Host sector"
                name={name}
                value={value}
                error={isRequired && !value}
                onChange={val => {
                  updateProjectForm({ [name]: val, hostSubSector: undefined })
                }}
                placeholder={placeholder}
                helperText={helperText}
              />
            )
          } else if (name === 'hostSubSector') {
            if (projectForm['hostSector']) {
              return (
                <ControlledVocabularyInput
                  key={name}
                  tree="hostSectors"
                  root={projectForm['hostSector']}
                  name={name}
                  value={value}
                  isRequired={isRequired}
                  error={isRequired && !value}
                  onChange={val => updateProjectForm({ [name]: val })}
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
          if (name === 'interventionType') {
            return (
              <ControlledVocabularyInput
                key={name}
                tree="interventionTypes"
                root="Intervention type"
                name={name}
                value={value}
                error={isRequired && !value}
                onChange={val => updateProjectForm({ [name]: val })}
                placeholder={placeholder}
                helperText={helperText}
              />
            )
          }

          /**
           * Controlled vocabulary
           */
          if (name === 'projectType') {
            return (
              <ControlledVocabularyInput
                key={name}
                tree="projectTypes"
                root="Project type"
                name={name}
                value={value}
                error={isRequired && !value}
                onChange={val => updateProjectForm({ [name]: val })}
                placeholder={placeholder}
                helperText={helperText}
              />
            )
          }

          /**
           * Controlled vocabulary
           */
          if (name === 'projectStatus') {
            return (
              <ControlledVocabularyInput
                key={name}
                tree="projectStatus"
                root="Project status"
                name={name}
                value={value}
                error={isRequired && !value}
                onChange={val => updateProjectForm({ [name]: val })}
                placeholder={placeholder}
                helperText={helperText}
              />
            )
          }

          /**
           * Controlled vocabulary
           */
          if (name === 'estimatedBudget') {
            return (
              <ControlledVocabularyInput
                key={name}
                tree="budgetRanges"
                root="Estimated budget"
                name={name}
                value={value}
                error={isRequired && !value}
                onChange={val => updateProjectForm({ [name]: val })}
                placeholder={placeholder}
                helperText={helperText}
              />
            )
          }

          /**
           * Controlled vocabulary
           */
          if (name === 'fundingStatus') {
            return (
              <ControlledVocabularyInput
                key={name}
                tree="projectFunding"
                root="Funding status"
                name={name}
                value={value}
                error={isRequired && !value}
                onChange={val => updateProjectForm({ [name]: val })}
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
                key={name}
                name={placeholder}
                placeholder={placeholder}
                helperText={helperText}
                error={isRequired && !value}
                onChange={e => updateProjectForm({ [name]: e.target.value })}
                options={enumValues}
                value={value || enumValues[0].name}
              />
            )
          }

          return (
            <GqlBoundFormInput
              key={name}
              field={field}
              value={value || ''}
              updateValue={val => updateProjectForm({ [name]: val })}
              multiline={multilineFields.includes(name)}
            />
          )
        })}
      </CardContent>
    </Card>
  )
}
