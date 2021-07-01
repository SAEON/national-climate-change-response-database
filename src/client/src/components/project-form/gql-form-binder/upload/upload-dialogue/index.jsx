import { useState, memo } from 'react'
import Typography from '@material-ui/core/Typography'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Tooltip from '@material-ui/core/Tooltip'
import useTheme from '@material-ui/core/styles/useTheme'
import UploadIcon from 'mdi-react/UploadIcon'
import FileIcon from 'mdi-react/FileIcon'
import CancelIcon from 'mdi-react/CancelIcon'
import AcceptIcon from 'mdi-react/CheckCircleIcon'
import { NCCRD_API_HTTP_ADDRESS } from '../../../../../config'
import CircularProgress from '@material-ui/core/CircularProgress'

const uploadAddress = `${NCCRD_API_HTTP_ADDRESS}/upload-project-file`

/**
 * UPloads are always for forms in progress, or for
 * completed forms when editing projects
 *
 * When a file is uploaded, the server will respond
 * with a unique key for that file, this key (along)
 * with file info is added to the main form state
 *
 * When the form is finally submitted the 'fileUploads'
 * JSON input will include the unique key of the uploaded
 * file
 *
 * The server will then register the file to the created
 * project
 */

export default memo(
  ({ helperText, placeholder, updateValue, submissionId }) => {
    const [open, setOpen] = useState(false)
    const [files, setFiles] = useState([])
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState(null)
    const theme = useTheme()

    return (
      <>
        <Tooltip placement="top" title={helperText}>
          <span>
            <Button
              startIcon={<UploadIcon size={18} />}
              onClick={() => setOpen(!open)}
              disableElevation
              size="medium"
              variant="outlined"
              color="primary"
            >
              {placeholder}
            </Button>
          </span>
        </Tooltip>

        <Dialog
          id="file(s)-upload"
          disableBackdropClick
          disableEscapeKeyDown
          open={open}
          onClose={() => setOpen(false)}
        >
          <DialogTitle>Upload file(s)</DialogTitle>

          <DialogContent>
            <Typography variant="body2" style={{ marginBottom: theme.spacing(2) }}>
              Select one of more files to upload as part of this form submission
            </Typography>

            {/* File selection */}
            <input
              accept="*"
              style={{ display: 'none' }}
              id="upload-selection-input"
              type="file"
              multiple
              onChange={e => setFiles(e.target.files)}
            />
            {
              <label htmlFor="upload-selection-input">
                <Button
                  disabled={uploading}
                  variant="contained"
                  disableElevation
                  size="medium"
                  component="span"
                >
                  Select files
                </Button>
              </label>
            }

            {/* Upload selection details */}
            {[...files].map(file => {
              return (
                <Typography
                  key={file.name}
                  variant="body2"
                  style={{ marginTop: theme.spacing(2), display: 'flex' }}
                >
                  <FileIcon size={18} style={{ marginRight: theme.spacing(1) }} /> {file.name}
                </Typography>
              )
            })}

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
              disabled={uploading || !files.length}
              onClick={async () => {
                setUploading(true)
                const uploadedFiles = []
                try {
                  for (const file of files) {
                    const body = new FormData()
                    body.append('upload-project-file', file, file.name)
                    const response = await fetch(`${uploadAddress}?submissionId=${submissionId}`, {
                      method: 'POST',
                      body,
                      mode: 'cors',
                      credentials: 'include',
                    })
                    const { status } = response
                    const responseText = await response.text()
                    if (status === 201) {
                      setOpen(false)
                      uploadedFiles.push({ id: responseText, name: file.name })
                    } else {
                      setError(
                        new Error(`Error uploading file (HTTP code ${status}). ${responseText}`)
                      )
                    }
                  }
                  updateValue(uploadedFiles)
                } catch (error) {
                  setError(new Error(`Unexpected error occurred. ${error.message}`))
                } finally {
                  setUploading(false)
                }
              }}
              color="primary"
              size="small"
              variant="outlined"
              disableElevation
              startIcon={uploading ? <CircularProgress size={14} /> : <AcceptIcon size={16} />}
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
   * Don't re-render unless unmounted or the error
   * state changes
   */
  () => true
)
