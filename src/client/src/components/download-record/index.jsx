import { useContext, useState } from 'react'
import { context as authContext } from '../../contexts/authorization'
import { context as authenticationContext } from '../../contexts/authentication'
import Button from '@mui/material/Button'
import DownloadIcon from 'mdi-react/DownloadIcon'
import Link from '@mui/material/Link'
import { Link as RouterLink } from 'react-router-dom'
import { NCCRD_API_HTTP_ADDRESS } from '../../config'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Tooltip from '@mui/material/Tooltip'
import Icon from '@mui/material/Icon'

const OpenedDialog = ({ title, id, closeFn }) => {
  const isAuthenticated = useContext(authenticationContext)
  const { hasPermission } = useContext(authContext)

  if (!isAuthenticated.user) {
    return (
      <>
        <DialogTitle>Download: {title}</DialogTitle>
        <DialogContent dividers>
          Please log in to download the data. If you do not already have an account you will be
          prompted to sign up, and then downloads will be available
        </DialogContent>
        <DialogActions>
          <Link
            component={RouterLink}
            to={`/login?redirect=${window.location.href}${
              window.location.href.includes(id) ? '' : `/${id}`
            }`}
            underline="hover"
          >
            Login
          </Link>
        </DialogActions>
      </>
    )
  }

  if (!hasPermission('download-submission')) {
    return null
  }

  return (
    <>
      <DialogTitle>Download: {title}</DialogTitle>
      <DialogContent dividers>
        <span>
          Download project information for submission{' '}
          <b>
            <i>{title}</i>
          </b>{' '}
          (submission ID <i>{id}</i>)<br />
          <br />
          While we take reasonable care to curate the information made available via this site, we
          cannot guarantee accuracy since most information is submitted via 3<sup>rd</sup> parties,
          and errors / misleading information is possible.
        </span>
      </DialogContent>
      <DialogActions>
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href={`${NCCRD_API_HTTP_ADDRESS}/download-submissions?ids=${encodeURIComponent(id)}`}
          key="download-link"
          onClick={closeFn}
          underline="hover"
        >
          Download record
        </Link>
      </DialogActions>
    </>
  )
}

export default ({ title, id }) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* TOGGLE */}
      <Tooltip title="Download this record as Excel file" placement="top">
        <span>
          <Button
            onClick={() => setOpen(!open)}
            startIcon={<Icon size={18} component={DownloadIcon} />}
            color="primary"
            size="small"
            variant="text"
          >
            Download
          </Button>
        </span>
      </Tooltip>

      {/* DIALOG */}
      <Dialog id={id} open={open} onClose={() => setOpen(false)}>
        <OpenedDialog closeFn={() => setOpen(false)} id={id} title={title} />
      </Dialog>
    </>
  )
}
