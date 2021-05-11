import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'
import RefreshIcon from 'mdi-react/RefreshIcon'

export default ({ style }) => {
  return (
    <Tooltip title="Reset form" placement="top">
      <IconButton
        style={Object.assign({}, style)}
        size="small"
        color="primary"
        onClick={() => window.location.reload()}
      >
        <RefreshIcon />
      </IconButton>
    </Tooltip>
  )
}
