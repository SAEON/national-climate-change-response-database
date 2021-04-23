import { gql, useMutation } from '@apollo/client'
import { useHistory } from 'react-router-dom'
import Wrapper from '../wrapper'
import Button from '@material-ui/core/Button'

export default ({ clearForm, projectDetails }) => {
  const history = useHistory()

  const [createProject, { error, loading }] = useMutation(
    gql`
      mutation createProject($projectDetails: ProjectInput!) {
        createProject(projectDetails: $projectDetails) {
          id
        }
      }
    `,
    {
      variables: {
        projectDetails,
      },
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
        clearForm()
        history.push(`/projects/${id}`)
      },
    }
  )

  if (error) {
    throw error
  }

  return (
    <div>
      <Wrapper title="Finalize and submit">
        <Button
          onClick={() => createProject({ variables: { projectDetails } })}
          variant="contained"
          color="primary"
          disableElevation
        >
          {loading && 'Loading'}
          {!loading && 'submit'}
        </Button>
      </Wrapper>
    </div>
  )
}
