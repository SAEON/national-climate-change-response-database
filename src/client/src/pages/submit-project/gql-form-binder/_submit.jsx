import { useContext } from 'react'
import { gql, useMutation } from '@apollo/client'
import { useHistory } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import CardHeader from '@material-ui/core/CardHeader'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { context as formContext } from './_context'
import convertFormToInput from './_convert-form-to-gql-input.js'

export default () => {
  const history = useHistory()
  const { generalDetailsForm, mitigationDetailsForm, adaptationDetailsForm } =
    useContext(formContext)

  const [createProject, { error, loading }] = useMutation(
    gql`
      mutation createProject(
        $generalDetailsForm: ProjectInput!
        $mitigationDetailsForm: MitigationInput
        $adaptationDetailsForm: AdaptationInput
      ) {
        createProject(
          generalDetailsForm: $generalDetailsForm
          mitigationDetailsForm: $mitigationDetailsForm
          adaptationDetailsForm: $adaptationDetailsForm
        ) {
          id
        }
      }
    `,
    {
      update: (cache, { data: { createProject } }) => {
        cache.modify({
          fields: {
            projects: (existingProjects = []) => [
              ...existingProjects,
              cache.writeFragment({
                data: createProject,
                fragment: gql`
                  fragment newProject on Project {
                    id
                  }
                `,
              }),
            ],
          },
        })
      },
      onCompleted: ({ createProject }) => {
        const { id } = createProject
        // history.push(`/projects/${id}`)
      },
    }
  )

  if (error) {
    throw error
  }

  return (
    <div>
      <Card variant="outlined">
        <CardHeader title={'Finalize and submit'} />
        <CardContent>
          <Button
            onClick={() => {
              createProject({
                variables: {
                  generalDetailsForm: convertFormToInput(generalDetailsForm),
                  mitigationDetailsForm: Object.keys(mitigationDetailsForm).length
                    ? convertFormToInput(mitigationDetailsForm)
                    : undefined,
                  adaptationDetailsForms: Object.keys(adaptationDetailsForm).length
                    ? convertFormToInput(adaptationDetailsForm)
                    : undefined,
                },
              })
            }}
            variant="contained"
            color="primary"
            disableElevation
          >
            {loading && 'Loading'}
            {!loading && 'submit'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
