import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

export default () => {
  return (
    <div style={{ position: 'relative' }}>
      <AppBar
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          alignContent: 'center',
        }}
        position="relative"
        color="primary"
      >
        <Toolbar variant="dense">
          <Typography variant="overline">© SAEON 2020 - {new Date().getFullYear()}</Typography>
        </Toolbar>
      </AppBar>
    </div>
  )
}
