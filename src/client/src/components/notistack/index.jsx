import { SnackbarProvider } from 'notistack'
import useTheme from '@material-ui/core/styles/useTheme'

export default ({ children }) => {
  const theme = useTheme()

  return <SnackbarProvider style={{ marginTop: theme.spacing(1) }}>{children}</SnackbarProvider>
}
