import DownloadIcon from 'mdi-react/DownloadIcon'
import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'
import Hidden from '@material-ui/core/Hidden'

export default () => {
  return (
    <Tooltip placement="bottom" title="Download project data">
      <span>
        <Hidden smDown>
          <Button
            disableElevation
            size="small"
            variant="text"
            color="primary"
            onClick={() => alert('TODO')}
            startIcon={<DownloadIcon size={18} />}
          >
            Download
          </Button>
        </Hidden>
      </span>
    </Tooltip>
  )
}
