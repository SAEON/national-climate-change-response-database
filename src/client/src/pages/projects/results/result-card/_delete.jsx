import Button from '@material-ui/core/Button'
import DeleteIcon from 'mdi-react/DeleteIcon'
import { gql, useMutation } from '@apollo/client'
import MessageDialogue from '../../../../components/message-dialogue'

export default ({ id }) => {
  const [deleteProject] = useMutation(
    gql`
      mutation deleteProject($id: Int!) {
        deleteProject(id: $id)
      }
    `,
    {
      update: (cache, { data: { deleteProject: deletedId } }) => {
        cache.modify({
          fields: {
            projects: (existingProjects = [], { readField }) =>
              existingProjects.filter(p => readField('id', p) !== deletedId),
          },
        })
      },
    }
  )

  return (
    <MessageDialogue
      title="Confirm delete"
      text="Are you sure you want to delete this project? This action cannot be undone"
      tooltipProps={{
        placement: 'top',
        title: 'Delete this project',
      }}
      Button={openFn => (
        <Button
          onClick={openFn}
          startIcon={<DeleteIcon size={18} />}
          color="primary"
          size="small"
          variant="outlined"
        >
          Delete
        </Button>
      )}
      Actions={[
        closeFn => (
          <Button
            key="delete-project"
            onClick={e => {
              closeFn(e)
              deleteProject({ variables: { id } })
            }}
            startIcon={<DeleteIcon size={18} />}
            color="primary"
            size="small"
            variant="contained"
            disableElevation
          >
            Confirm
          </Button>
        ),
      ]}
    />
  )
}
