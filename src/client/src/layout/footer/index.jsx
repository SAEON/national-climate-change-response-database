import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'

export default () => {
  return (
    <AppBar
      position="absolute"
      style={{ top: 'auto', bottom: 0 }}
      color="primary"
      variant="outlined"
    >
      <Container>
        <Toolbar variant="dense">
          <Typography style={{ textAlign: 'center', margin: 'auto' }} variant="overline">
            © DFFE 2021 - {new Date().getFullYear()}
          </Typography>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
