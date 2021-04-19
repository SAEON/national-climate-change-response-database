import { useState } from 'react'
import { isIE } from 'react-device-detect'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

export default ({ children }) => {
  const [open, setOpen] = useState(false)
  const [accepted, setAccepted] = useState(false)

  if (isIE) {
    if (!accepted) {
      setAccepted(true)
      setOpen(true)
    }
  }

  return (
    <>
      <Dialog open={open}>
        <DialogTitle>
          <Typography>Browser version is not supported.</Typography>
        </DialogTitle>
        <DialogContent>
          <Typography>
            Many features of this website will not work as expected on this browser (including
            viewing maps). A newer browser (Chrome, Edge, Firefox, Safari, etc.) will certainly
            provide a nicer experience.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Okay</Button>
        </DialogActions>
      </Dialog>
      {children}
    </>
  )
}
