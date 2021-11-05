import { SnackbarProvider } from 'notistack'
import { useTheme } from '@mui/material/styles'

export default ({ children }) => {
  const theme = useTheme()

  return <SnackbarProvider style={{ marginTop: theme.spacing(1) }}>{children}</SnackbarProvider>
}
