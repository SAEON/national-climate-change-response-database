import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import useTheme from '@mui/material/styles/useTheme'
import NewTenant from './new-tenant'

export default () => {
  const theme = useTheme()

  return (
    <AppBar color="inherit" position="relative">
      <Toolbar
        variant="dense"
        style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: theme.spacing(2) }}
      >
        <NewTenant />
      </Toolbar>
    </AppBar>
  )
}
