import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import RefreshIcon from 'mdi-react/RefreshIcon'

export default ({ style }) => {
  return (
    <Tooltip title="Reset form" placement="top">
      <IconButton
        style={style}
        size="small"
        color="default"
        variant="contained"
        onClick={() => window.location.reload()}
      >
        <RefreshIcon />
      </IconButton>
    </Tooltip>
  )
}
