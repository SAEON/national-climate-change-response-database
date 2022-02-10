import Button from '@mui/material/Button'
import Link from '@mui/material/Link'
import DownloadIcon from 'mdi-react/DownloadIcon'
import { NCCRD_API_HTTP_ADDRESS } from '../../../../config'

export default () => {
  return (
    <Button
      target="_blank"
      rel="noopener noreferrer"
      href={`${NCCRD_API_HTTP_ADDRESS}/download-flagged-vocabularies`}
      component={Link}
      variant="text"
      size="small"
      startIcon={<DownloadIcon size={18} />}
    >
      Download as CSV
    </Button>
  )
}
