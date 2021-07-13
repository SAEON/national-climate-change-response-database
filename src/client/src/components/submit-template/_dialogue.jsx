import { useState } from 'react'
import Typography from '@material-ui/core/Typography'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Tooltip from '@material-ui/core/Tooltip'
import useTheme from '@material-ui/core/styles/useTheme'
import UploadIcon from 'mdi-react/MicrosoftExcelIcon'
import FileIcon from 'mdi-react/FileIcon'
import CancelIcon from 'mdi-react/CancelIcon'
import AcceptIcon from 'mdi-react/CheckCircleIcon'
import { NCCRD_API_HTTP_ADDRESS } from '../../config'
import CircularProgress from '@material-ui/core/CircularProgress'

const uploadAddress = `${NCCRD_API_HTTP_ADDRESS}/submit-completed-templates`

export default ({ isAuthenticated }) => {
  const [open, setOpen] = useState(false)
  const [files, setFiles] = useState([])
  const [result, setResult] = useState([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const theme = useTheme()

  return (
    <>
      <Tooltip placement="bottom" title={'Submit a completed Excel template'}>
        <span>
          <Button
            startIcon={<UploadIcon size={18} />}
            onClick={() => {
              isAuthenticated.authenticate()
              setError(null)
              setFiles([])
              setOpen(!open)
            }}
            disableElevation
            size="small"
            variant="text"
            color="primary"
          >
            {'Excel submission'}
          </Button>
        </span>
      </Tooltip>

      <Dialog
        id="upload-excel-submission(s)"
        open={open}
        onClose={(e, reason) => {
          if (reason) {
            return
          }
          setOpen(false)
        }}
      >
        <DialogTitle>Upload file(s)</DialogTitle>

        {result.length ? (
          <DialogContent>
            <Typography variant="body2">
              Thank you! Your submission is being validated by a system administrator. Edit / attach
              files to these submissions on the links below:
            </Typography>
            <Typography>{JSON.stringify(result, null, 2)}</Typography>
          </DialogContent>
        ) : null}

        {result.length ? null : (
          <DialogContent>
            <Typography variant="body2" style={{ marginBottom: theme.spacing(2) }}>
              Select one of more completed Excel templates to submit
            </Typography>

            {/* File selection */}
            <input
              accept="*"
              style={{ display: 'none' }}
              id="upload-completed-template-input"
              type="file"
              multiple
              onChange={e => {
                setError(null)
                setFiles(e.target.files)
              }}
            />
            {
              <label htmlFor="upload-completed-template-input">
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
        )}

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
                  body.append('submit-completed-templates', file, file.name)
                  const response = await fetch(`${uploadAddress}`, {
                    method: 'POST',
                    body,
                    mode: 'cors',
                    credentials: 'include',
                  })
                  const { status } = response
                  const responseText = await response.text()
                  if (status === 201) {
                    uploadedFiles.push({ id: responseText, name: file.name })
                  } else {
                    setError(
                      new Error(`Error uploading file (HTTP code ${status}). ${responseText}`)
                    )
                  }
                }
              } catch (error) {
                setError(new Error(`Unexpected error occurred. ${error.message}`))
              } finally {
                setUploading(false)
              }
              setResult(uploadedFiles)
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
}
