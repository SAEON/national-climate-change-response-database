import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import UploadTemplate from './upload-template'
import useTheme from '@mui/material/styles/useTheme'

export default () => {
  const theme = useTheme()

  return (
    <AppBar color="inherit" position="relative">
      <Toolbar
        variant="dense"
        style={{ display: 'flex', justifyContent: 'flex-end', paddingRight: theme.spacing(2) }}
      >
        <UploadTemplate />
      </Toolbar>
    </AppBar>
  )
}
