import { useState, memo } from 'react'
import { gql, useMutation } from '@apollo/client'
import Typography from '@mui/material/Typography'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Tooltip from '@mui/material/Tooltip'
import CancelIcon from 'mdi-react/CancelIcon'
import AcceptIcon from 'mdi-react/CheckCircleIcon'
import CircularProgress from '@mui/material/CircularProgress'
import DeleteIcon from 'mdi-react/DeleteIcon'

export default memo(
  ({ value, updateValue, submissionId, disabled }) => {
    const [open, setOpen] = useState(false)

    const [removeFiles, { error, loading }] = useMutation(
      gql`
        mutation ($submissionId: ID!, $ids: [Int!]!) {
          removeSubmissionAttachments(submissionId: $submissionId, ids: $ids)
        }
      `,
      {
        onCompleted: ({ removeSubmissionAttachments: { ids } }) => {
          if (ids) {
            updateValue([])
            setOpen(false)
          } else {
            throw new Error('An unexpected error occurred when trying to remove downloaded files')
          }
        },
      }
    )

    return (
      <>
        <Tooltip placement="top" title={'Remove all files'}>
          <span>
            <Button
              sx={{ marginRight: theme => theme.spacing(2) }}
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
            <Typography variant="body2" sx={{ marginBottom: theme => theme.spacing(2) }}>
              Are you sure you want to remove all uploaded files?
            </Typography>

            {/* Error text */}
            {error && (
              <Typography
                color="error"
                variant="body2"
                sx={{ marginTop: theme => theme.spacing(2) }}
              >
                {error.message}
              </Typography>
            )}
          </DialogContent>

          {/* ACTIONS */}
          <DialogActions sx={{ justifyContent: 'flex-end' }}>
            <Button
              color="primary"
              size="small"
              variant="outlined"
              disableElevation
              startIcon={<CancelIcon size={16} />}
              onClick={() => {
                setOpen(false)
              }}
              sx={{ minWidth: 105 }}
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
              sx={{ minWidth: 105 }}
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
