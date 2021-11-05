import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'

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
