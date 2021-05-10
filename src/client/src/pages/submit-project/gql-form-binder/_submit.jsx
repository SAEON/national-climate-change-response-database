import { useContext } from 'react'
import { gql, useMutation } from '@apollo/client'
import { useHistory } from 'react-router-dom'
import Button from '@material-ui/core/Button'
import CardHeader from '@material-ui/core/CardHeader'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import { context as formContext } from './_context'

export default () => {
  const history = useHistory()
  const { projectForm, mitigationForms, adaptationForms, researchForms } = useContext(formContext)

  const [createProject, { error, loading }] = useMutation(
    gql`
      mutation createProject(
        $projectForm: ProjectInput!
        $mitigationForms: [MitigationInput!]
        $adaptationForms: [AdaptationInput!]
        $researchForms: [ResearchInput!]
      ) {
        createProject(
          projectForm: $projectForm
          mitigationForms: $mitigationForms
          adaptationForms: $adaptationForms
          researchForms: $researchForms
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
        history.push(`/projects/${id}`)
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
            onClick={() =>
              createProject({
                variables: { projectForm, mitigationForms, adaptationForms, researchForms },
              })
            }
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
