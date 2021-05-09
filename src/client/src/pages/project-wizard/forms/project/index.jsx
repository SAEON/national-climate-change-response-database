import { useContext, memo } from 'react'
import { context as formContext } from '../../gql-form-binder'
import CardHeader from '@material-ui/core/CardHeader'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import useTheme from '@material-ui/core/styles/useTheme'
import RenderField from './_render-field'
import sift from 'sift'

const RenderSection = ({ title, fields, style = {} }) => {
  const theme = useTheme()

  return (
    <Card variant="outlined" style={{ backgroundColor: theme.backgroundColor, ...style }}>
      <CardHeader title={title} />
      <CardContent>
        {fields.map(field => {
          const { name } = field
          return <RenderField key={name} field={field} />
        })}
      </CardContent>
    </Card>
  )
}

const INFO_FIELDS = [
  'title',
  'description',
  'projectManager',
  'projectType',
  'interventionType',
  'projectStatus',
  'link',
  'startDate',
  'endDate',
]

const VALIDATION_FIELDS = ['validationStatus', 'validationComments']

const FUNDING_FIELDS = [
  'fundingStatus',
  'fundingOrganisation',
  'fundingPartner',
  'estimatedBudget',
  'budgetLower',
  'budgetUpper',
]

const HOST_FIELDS = [
  'hostSector',
  'hostSubSector',
  'hostOrganisation',
  'hostPartner',
  'alternativeContact',
  'alternativeContactEmail',
  'leadAgent',
]

const Compose = memo(({ fields }) => {
  const theme = useTheme()

  if (
    [...INFO_FIELDS, ...VALIDATION_FIELDS, ...FUNDING_FIELDS, ...HOST_FIELDS].length !==
    fields.length
  ) {
    throw new Error(
      'Oops! The graphQL input type does not match the client form logic. You need to explicitly assign each input field into a group (or you have assigned the same form into two groups)'
    )
  }

  return (
    <>
      {/* Basic fields */}
      <RenderSection
        title="Project information"
        fields={fields.filter(
          sift({
            name: {
              $in: INFO_FIELDS,
            },
          })
        )}
      />

      {/* Basic fields */}
      <RenderSection
        style={{ marginTop: theme.spacing(2) }}
        title="Validation status"
        fields={fields.filter(
          sift({
            name: {
              $in: VALIDATION_FIELDS,
            },
          })
        )}
      />

      {/* Funding fields */}
      <RenderSection
        style={{ marginTop: theme.spacing(2) }}
        title="Funding information"
        fields={fields.filter(
          sift({
            name: {
              $in: FUNDING_FIELDS,
            },
          })
        )}
      />

      {/* Host fields */}
      <RenderSection
        style={{ marginTop: theme.spacing(2) }}
        title="Host information"
        fields={fields.filter(
          sift({
            name: {
              $in: HOST_FIELDS,
            },
          })
        )}
      />
    </>
  )
})

export default () => {
  const { projectFields } = useContext(formContext)
  return <Compose fields={projectFields} />
}
