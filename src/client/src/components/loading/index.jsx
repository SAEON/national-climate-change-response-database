import LinearProgress from '@material-ui/core/LinearProgress'

export default ({ msg = undefined }) => (
  <>
    <LinearProgress style={{ zIndex: 1099 }} />
    {msg && msg}
  </>
)
