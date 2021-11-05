import LinearProgress from '@mui/material/LinearProgress'

export default ({ msg = undefined }) => (
  <>
    <LinearProgress style={{ zIndex: 1099 }} />
    {msg && msg}
  </>
)
