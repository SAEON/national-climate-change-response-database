import { useState, useEffect } from 'react'
import Typography from '@mui/material/Typography'
import MuiLink from '@mui/material/Link'
import { Link } from 'react-router-dom'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import Button from '@mui/material/Button'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Tooltip from '@mui/material/Tooltip'
import { useTheme } from '@mui/material/styles'
import UploadIcon from 'mdi-react/MicrosoftExcelIcon'
import FileIcon from 'mdi-react/FileIcon'
import CancelIcon from 'mdi-react/CancelIcon'
import AcceptIcon from 'mdi-react/CheckCircleIcon'
import { NCCRD_API_HTTP_ADDRESS } from '../../config'
import CircularProgress from '@mui/material/CircularProgress'

const uploadAddress = `${NCCRD_API_HTTP_ADDRESS}/submit-completed-templates`

export default ({ isAuthenticated }) => {
  const [open, setOpen] = useState(false)
  const [files, setFiles] = useState([])
  const [result, setResult] = useState([])
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const theme = useTheme()

  useEffect(
    () => () => {
      if (open === false) {
        setFiles([])
        setResult([])
      }
    },
    [open]
  )

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
            <Typography gutterBottom variant="body2">
              Thank you! Your submission is being validated by a system administrator. Click on the
              links to edit submissions / attach files:
            </Typography>
            {result.map(({ name, submissions }) => (
              <div key={name}>
                <Typography>{name}</Typography>
                {submissions.map(({ id, title }) => (
                  <MuiLink
                    key={id}
                    component={Link}
                    to={`/submissions/${id}/edit`}
                    underline="hover"
                  >
                    <Typography>{title}</Typography>
                  </MuiLink>
                ))}
              </div>
            ))}
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
                    uploadedFiles.push({
                      name: file.name,
                      submissions: JSON.parse(responseText).inserted.map(
                        ({ id, _projectTitle: title }) => ({
                          id,
                          title,
                        })
                      ),
                    })
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
