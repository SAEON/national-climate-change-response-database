import Button from '@material-ui/core/Button'
import DeleteIcon from 'mdi-react/DeleteIcon'
import { gql, useMutation } from '@apollo/client'

export default ({ id }) => {
  const [deleteProject] = useMutation(gql`
    mutation deleteProject($id: ID!) {
      deleteProject(id: $id) {
        id
      }
    }
  `)

  return (
    <Button
      onClick={() => deleteProject({ variables: { id } })}
      startIcon={<DeleteIcon size={18} />}
      color="primary"
      size="small"
      variant="outlined"
    >
      Delete
    </Button>
  )
}
