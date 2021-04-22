import { gql, useMutation } from '@apollo/client'
import { useHistory } from 'react-router-dom'
import Wrapper from '../wrapper'
import Button from '@material-ui/core/Button'

export default ({ projectDetails }) => {
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
      onCompleted: ({ createProject }) => {
        const { id } = createProject
        // TODO clear the form
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
