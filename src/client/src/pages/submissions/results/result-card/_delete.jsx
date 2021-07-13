import { useContext } from 'react'
import { context as authContext } from '../../../../contexts/authorization'
import Button from '@material-ui/core/Button'
import DeleteIcon from 'mdi-react/DeleteIcon'
import { gql, useMutation } from '@apollo/client'
import MessageDialogue from '../../../../components/message-dialogue'

export default ({ id, createdBy }) => {
  const { hasPermission, user } = useContext(authContext)

  const [deleteSubmission] = useMutation(
    gql`
      mutation deleteSubmission($id: ID!) {
        deleteSubmission(id: $id)
      }
    `,
    {
      update: (cache, { data: { deleteSubmission: deletedId } }) => {
        cache.modify({
          fields: {
            submissions: (existingSubmissions = [], { readField }) =>
              existingSubmissions.filter(p => readField('id', p) !== deletedId),
          },
        })
      },
    }
  )

  /**
   * Users can delete their own submissions
   *
   * Users with the permission 'delete-submission'
   * can delete submissions
   */
  if (!hasPermission('delete-submission')) {
    if (createdBy?.id !== user?.id) {
      return null
    }
  }

  return (
    <MessageDialogue
      title="Confirm delete"
      text="Are you sure you want to delete this project submission? This action cannot be undone"
      tooltipProps={{
        placement: 'top',
        title: 'Delete this submission',
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
            key="delete-submission"
            onClick={e => {
              closeFn(e)
              deleteSubmission({ variables: { id } })
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
