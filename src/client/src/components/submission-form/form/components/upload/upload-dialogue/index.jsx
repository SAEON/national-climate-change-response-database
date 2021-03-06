import { useState, memo } from 'react'
import Typography from '@mui/material/Typography'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Tooltip from '@mui/material/Tooltip'
import useTheme from '@mui/material/styles/useTheme'
import UploadIcon from 'mdi-react/UploadIcon'
import FileIcon from 'mdi-react/FileIcon'
import CancelIcon from 'mdi-react/CancelIcon'
import AcceptIcon from 'mdi-react/CheckCircleIcon'
import { NCCRD_API_HTTP_ADDRESS } from '../../../../../../config'
import CircularProgress from '@mui/material/CircularProgress'

const uploadAddress = `${NCCRD_API_HTTP_ADDRESS}/attach-file-to-submission`

export default memo(
  ({ value, updateValue, helperText, placeholder, submissionId, formName }) => {
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
              onClick={() => {
                setError(null)
                setFiles([])
                setOpen(!open)
              }}
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
          open={open}
          onClose={(e, reason) => {
            if (reason) {
              return
            }
            setOpen(false)
          }}
        >
          <DialogTitle>Upload file(s)</DialogTitle>

          <DialogContent>
            <Typography variant="body2" style={{ marginBottom: theme.spacing(2) }}>
              Select one of more files to upload as part of this form submission.{' '}
              <b>NOTE: These files are made publicly available for downloading.</b>
            </Typography>

            {/* File selection */}
            <input
              accept="*"
              style={{ display: 'none' }}
              id="upload-selection-input"
              type="file"
              multiple
              onChange={e => {
                setError(null)
                setFiles(e.target.files)
              }}
            />
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
                    body.append('attach-file-to-submission', file, file.name)
                    const response = await fetch(
                      `${uploadAddress}?submissionId=${submissionId}&formName=${formName}`,
                      {
                        method: 'POST',
                        body,
                        mode: 'cors',
                        credentials: 'include',
                      }
                    )
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
                  updateValue([...value, ...uploadedFiles])
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
   * However, if the form value changes then
   * buttons need to be disabled/enabled
   */
  ({ value: a }, { value: b }) => {
    a = a?.map(({ id }) => id)
    b = b?.map(({ id }) => id)
    return a?.sort().toString() == b?.sort().toString()
  }
)
