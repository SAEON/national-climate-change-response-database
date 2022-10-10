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
import { format } from 'date-fns'
import CircularProgress from '@mui/material/CircularProgress'

/**
 * https://gist.github.com/devloco/5f779216c988438777b76e7db113d05c
 */
const DownloadButton = ({ closeFn, id, search }) => {
  const [loading, setLoading] = useState(false)

  return (
    <Button
      disabled={loading}
      size="small"
      variant="text"
      startIcon={
        loading ? <CircularProgress size={14} /> : <Icon component={DownloadIcon} size={16} />
      }
      onClick={async () => {
        setLoading(true)
        const url = `${NCCRD_API_HTTP_ADDRESS}/download-submissions`
        const formData = new FormData()

        if (id) {
          formData.append('ids', JSON.stringify([id]))
        }

        if (search) {
          formData.append('search', JSON.stringify(search))
        }

        const res = await fetch(url, {
          method: 'POST',
          credentials: 'include',
          mode: 'cors',
          body: formData,
        })

        const obj = {
          filename: `CCRD download ${format(new Date(), 'yyyy-MM-dd HH-mm-ss')}.csv`,
          blob: await res.blob(),
        }

        const blob = new Blob([obj.blob], { type: 'text/csv' })

        // MS Edge and IE don't allow using a blob object directly as link href, instead it is necessary to use msSaveOrOpenBlob
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
          window.navigator.msSaveOrOpenBlob(blob)
        } else {
          // For other browsers: create a link pointing to the ObjectURL containing the blob.
          const objUrl = window.URL.createObjectURL(blob)

          let link = document.createElement('a')
          link.href = objUrl
          link.download = obj.filename
          link.click()

          // For Firefox it is necessary to delay revoking the ObjectURL.
          setTimeout(() => {
            window.URL.revokeObjectURL(objUrl)
          }, 250)
        }

        closeFn()
      }}
    >
      {loading ? 'Preparing download...' : 'Download submission data'}
    </Button>
  )
}

const OpenedDialog = ({ title, id, search, closeFn }) => {
  const isAuthenticated = useContext(authenticationContext)
  const { hasPermission } = useContext(authContext)

  const redirect =
    search || window.location.href.includes(id)
      ? window.location.href
      : `${window.location.href}/${id}`

  if (!isAuthenticated.user) {
    return (
      <>
        <DialogTitle>Download: {title}</DialogTitle>
        <DialogContent dividers>
          Please log in to download the data. If you do not already have an account you will be
          prompted to sign up, and then downloads will be available
        </DialogContent>
        <DialogActions>
          <Link component={RouterLink} to={`/login?redirect=${redirect}`} underline="hover">
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
          (submission ID <i>{id || 'many'}</i>)<br />
          <br />
          While we take reasonable care to curate the information made available via this site, we
          cannot guarantee accuracy since most information is submitted via 3<sup>rd</sup> parties,
          and errors / misleading information is possible.
          <br />
          <br />
          <b>
            <i>Opening the CSV in Excel</i>
          </b>
          <br />
          The download is in CSV format. To use in Excel, (1) Open Excel, (2) Go to the Data tab,
          and (3) Import the CSV via the text file data source wizard.
        </span>
      </DialogContent>
      <DialogActions>
        <DownloadButton search={search} closeFn={closeFn} id={id} />
      </DialogActions>
    </>
  )
}

export default ({ title, search, id, buttonTitle }) => {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* TOGGLE */}
      <Tooltip title="Download submission data as CSV file" placement="top">
        <span>
          <Button
            onClick={() => setOpen(!open)}
            startIcon={<Icon size={18} component={DownloadIcon} />}
            color="primary"
            size="small"
            variant="text"
          >
            {buttonTitle || 'Download'}
          </Button>
        </span>
      </Tooltip>

      {/* DIALOG */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <OpenedDialog closeFn={() => setOpen(false)} id={id} title={title} search={search} />
      </Dialog>
    </>
  )
}
