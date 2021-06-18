import { useState } from 'react'
import Typography from '@material-ui/core/Typography'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import Button from '@material-ui/core/Button'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import Tooltip from '@material-ui/core/Tooltip'
import useTheme from '@material-ui/core/styles/useTheme'

export default ({ id, tooltipProps, title, Icon, apiAddress }) => {
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState(null)
  const [error, setError] = useState(null)
  const theme = useTheme()

  return (
    <span onClick={e => e.stopPropagation()}>
      <Tooltip placement="right-end" {...tooltipProps}>
        <span>
          <Button
            startIcon={<Icon size={18} />}
            onClick={e => {
              e.stopPropagation()
              setOpen(!open)
            }}
            disableElevation
            size="small"
            variant="text"
            color="primary"
          >
            Upload submission template
          </Button>
        </span>
      </Tooltip>

      <Dialog
        id={id}
        open={open}
        onClose={() => {
          setOpen(false)
        }}
      >
        <DialogTitle>
          {typeof title === 'function' ? title(() => setOpen(false)) : title}
        </DialogTitle>

        <DialogContent>
          <Typography variant="body2" style={{ marginBottom: theme.spacing(2) }}>
            Select the latest version of the Excel template that users can use to upload project
            details
          </Typography>

          {/* File selection */}
          <input
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            style={{ display: 'none' }}
            id="upload-selection-input"
            type="file"
            onChange={e => {
              setFile(e.target.files[0])
              setError(null)
            }}
          />
          <label htmlFor="upload-selection-input">
            <Button variant="contained" component="span">
              Select Excel template
            </Button>
          </label>

          {/* Upload selection details */}
          {file?.name && (
            <Typography variant="body2" style={{ marginTop: theme.spacing(2), display: 'flex' }}>
              <Icon size={18} style={{ marginRight: theme.spacing(1) }} /> {file?.name}
            </Typography>
          )}

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
            disabled={!file}
            key="upload-template"
            onClick={async () => {
              const body = new FormData()
              body.append('project-upload-excel-template', file, file.name)
              const response = await fetch(apiAddress, {
                method: 'POST',
                body,
                mode: 'cors',
                credentials: 'include',
              })
              const { status } = response
              if (status === 201) {
                setOpen(false)
              } else {
                const responseText = await response.text()
                setError(new Error(`Error uploading file (HTTP code ${status}). ${responseText}`))
              }
            }}
            color="primary"
            size="small"
            variant="contained"
            disableElevation
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </span>
  )
}
