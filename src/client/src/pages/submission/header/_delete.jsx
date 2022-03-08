import { useContext } from 'react'
import { context as authContext } from '../../../contexts/authorization'
import Button from '@mui/material/Button'
import DeleteIcon from 'mdi-react/DeleteIcon'
import { gql, useMutation } from '@apollo/client'
import MessageDialogue from '../../../components/message-dialogue'
import Hidden from '@mui/material/Hidden'
import IconButton from '@mui/material/IconButton'

export default ({ id, createdBy }) => {
  const { hasPermission, user } = useContext(authContext)

  const [deleteSubmission] = useMutation(
    gql`
      mutation deleteSubmission($id: ID!) {
        deleteSubmission(id: $id)
      }
    `,
    {
      onCompleted: () => {
        history.back()
      },
      update: (cache, { data: { deleteSubmission: deletedId } }) =>
        cache.evict({ id: `Submission:${deletedId}` }),
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
        <>
          <Hidden smDown>
            <Button
              onClick={openFn}
              startIcon={<DeleteIcon size={18} />}
              color="primary"
              size="small"
              variant="text"
            >
              Delete
            </Button>
          </Hidden>
          <Hidden smUp>
            <IconButton onClick={openFn} color="primary" size="small">
              <DeleteIcon size={18} />
            </IconButton>
          </Hidden>
        </>
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
