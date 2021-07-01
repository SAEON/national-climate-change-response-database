import { useState, memo } from 'react'
import { gql, useMutation } from '@apollo/client'
import Typography from '@material-ui/core/Typography'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Tooltip from '@material-ui/core/Tooltip'
import useTheme from '@material-ui/core/styles/useTheme'
import CancelIcon from 'mdi-react/CancelIcon'
import AcceptIcon from 'mdi-react/CheckCircleIcon'
import CircularProgress from '@material-ui/core/CircularProgress'
import DeleteIcon from 'mdi-react/DeleteIcon'

export default memo(
  ({ value, removeFiles: updateForm, submissionId, disabled }) => {
    const [open, setOpen] = useState(false)
    const theme = useTheme()

    const [removeFiles, { error, loading }] = useMutation(
      gql`
        mutation ($submissionId: ID!, $ids: [Int!]!) {
          removeProjectFiles(submissionId: $submissionId, ids: $ids)
        }
      `,
      {
        onCompleted: () => {
          updateForm([])
          setOpen(false)
        },
      }
    )

    return (
      <>
        <Tooltip placement="top" title={'Remove all files'}>
          <span>
            <Button
              style={{ marginRight: theme.spacing(2) }}
              variant="outlined"
              disableElevation
              disabled={disabled}
              color="primary"
              size="medium"
              onClick={() => setOpen(!open)}
              startIcon={<DeleteIcon size={18} />}
            >
              Clear files
            </Button>
          </span>
        </Tooltip>

        <Dialog id="clear-files" open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Remove files</DialogTitle>

          <DialogContent>
            <Typography variant="body2" style={{ marginBottom: theme.spacing(2) }}>
              Are you sure you want to remove all uploaded files?
            </Typography>

            {/* Error text */}
            {error && (
              <Typography color="error" variant="body2" style={{ marginTop: theme.spacing(2) }}>
                {error.message}
              </Typography>
            )}
          </DialogContent>

          {/* ACTIONS */}
          <DialogActions style={{ justifyContent: 'flex-end' }}>
            <Button
              color="primary"
              size="small"
              variant="outlined"
              disableElevation
              startIcon={<CancelIcon size={16} />}
              onClick={() => {
                setOpen(false)
              }}
              style={{ minWidth: 105 }}
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                removeFiles({
                  variables: {
                    ids: value.map(({ id }) => parseInt(id, 10)),
                    submissionId,
                  },
                })
              }}
              color="primary"
              size="small"
              variant="outlined"
              disableElevation
              startIcon={loading ? <CircularProgress size={14} /> : <AcceptIcon size={16} />}
              style={{ minWidth: 105 }}
            >
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </>
    )
  },
  /**
   * State is managed internally, and synced
   * to context otherwise the component is re-
   * rendered too often.
   *
   * However, if the form value changes then
   * buttons need to be disabled/enabled
   */
  ({ value: a }, { value: b }) => {
    a = a?.map(({ id }) => id)
    b = b?.map(({ id }) => id)
    return a?.sort().toString() == b?.sort().toString()
  }
)
