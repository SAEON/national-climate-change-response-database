import DownloadIcon from 'mdi-react/DownloadIcon'
import Button from '@material-ui/core/Button'

export default () => {
  return (
    <Button
      disableElevation
      size="small"
      variant="contained"
      color="primary"
      startIcon={<DownloadIcon size={18} />}
    >
      Download data
    </Button>
  )
}
