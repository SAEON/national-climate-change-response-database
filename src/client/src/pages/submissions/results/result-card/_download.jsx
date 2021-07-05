import Button from '@material-ui/core/Button'
import DownloadIcon from 'mdi-react/DownloadIcon'

export default () => {
  return (
    <Button startIcon={<DownloadIcon size={18} />} color="primary" size="small" variant="outlined">
      Download
    </Button>
  )
}
