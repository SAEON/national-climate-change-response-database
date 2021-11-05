import { gql, useMutation } from '@apollo/client'
import IconButton from '@mui/material/IconButton'
import DeleteIcon from 'mdi-react/DeleteIcon'
import Button from '@mui/material/Button'
import { useHistory } from 'react-router-dom'
import Hidden from '@mui/material/Hidden'
import MessageDialogue from '../../../../components/message-dialogue'

export default ({ id }) => {
  const history = useHistory()
  const [deleteSubmission] = useMutation(
    gql`
      mutation deleteSubmission($id: ID!) {
        deleteSubmission(id: $id)
      }
    `,
    {
      onCompleted: ({ deleteSubmission: id }) => {
        if (id) {
          history.push('/')
        }
      },
      update: (cache, { data: { deleteSubmission: id } }) =>
        cache.evict({ id: `Submission:${id}` }),
    }
  )

  return (
    <MessageDialogue
      title="Confirm"
      text="Are you sure you want to delete this submission? All data will be lost"
      tooltipProps={{
        placement: 'bottom',
        title: 'Delete submission',
      }}
      Button={openFn => {
        return (
          <>
            <Hidden smDown>
              <Button
                onClick={openFn}
                disableElevation
                size="small"
                variant="text"
                color="primary"
                startIcon={<DeleteIcon size={18} />}
              >
                Delete submission
              </Button>
            </Hidden>
            <Hidden smUp>
              <IconButton onClick={openFn} size="small" color="primary">
                <DeleteIcon size={18} />
              </IconButton>
            </Hidden>
          </>
        )
      }}
      Actions={[
        closeFn => (
          <Button
            key="delete-submission"
            startIcon={<DeleteIcon size={18} />}
            onClick={e => {
              closeFn(e)
              deleteSubmission({ variables: { id } })
            }}
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
