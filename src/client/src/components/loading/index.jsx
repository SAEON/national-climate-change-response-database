import Typography from '@material-ui/core/Typography'
import LinearProgress from '@material-ui/core/LinearProgress'

export default ({ msg = undefined }) => (
  <>
    <LinearProgress style={{ zIndex: 1099 }} />
    {msg && <Typography variant="body2">{msg}</Typography>}
  </>
)
