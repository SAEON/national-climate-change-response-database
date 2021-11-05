import Toolbar from '@mui/material/Toolbar'
import { useTheme } from '@mui/material/styles'

export default props => {
  const theme = useTheme()
  return (
    <Toolbar
      disableGutters
      style={{
        display: 'flex',
        padding: theme.spacing(1),
        justifyContent: 'space-between',
      }}
      {...props}
    />
  )
}
