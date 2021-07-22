import { gql, useMutation } from '@apollo/client'
import IconButton from '@material-ui/core/IconButton'
import DeleteIcon from 'mdi-react/DeleteIcon'
import Button from '@material-ui/core/Button'
import { useHistory } from 'react-router-dom'
import Hidden from '@material-ui/core/Hidden'
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
      update: cache => {
        cache.modify({
          fields: {
            submission: () => undefined,
          },
        })
      },
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
            <Hidden xsDown>
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
