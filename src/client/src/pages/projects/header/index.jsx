import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import useTheme from '@material-ui/core/styles/useTheme'

export default () => {
  const theme = useTheme()

  return (
    <AppBar
      style={{ backgroundColor: theme.backgroundColor }}
      variant="outlined"
      position="relative"
    >
      <Toolbar variant="dense">hi</Toolbar>
    </AppBar>
  )
}
