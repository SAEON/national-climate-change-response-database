import { useContext } from 'react'
import { context as authContext } from '../../contexts/authorization'
import Button from '@mui/material/Button'
import DownloadIcon from 'mdi-react/DownloadIcon'
import Dialog from '../message-dialogue'
import Link from '@mui/material/Link'
import { NCCRD_API_HTTP_ADDRESS } from '../../config'

export default ({ title, id, variant = 'outlined' }) => {
  const { hasPermission } = useContext(authContext)

  if (!hasPermission('download-submission')) {
    return null
  }

  return (
    <Dialog
      title={'Download submission'}
      text={
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
      }
      Actions={[
        closeFn => (
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href={`${NCCRD_API_HTTP_ADDRESS}/download-submission?id=${id}`}
            key="download-link"
            onClick={closeFn}
            underline="hover">
            Download record
          </Link>
        ),
      ]}
      tooltipProps={{
        placement: 'top',
        title: 'Download this record as Excel file',
      }}
      Button={openFn => (
        <Button
          onClick={openFn}
          startIcon={<DownloadIcon size={18} />}
          color="primary"
          size="small"
          variant={variant}
        >
          Download
        </Button>
      )}
    />
  );
}
