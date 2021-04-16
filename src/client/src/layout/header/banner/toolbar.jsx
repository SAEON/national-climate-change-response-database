import Toolbar from '@material-ui/core/Toolbar'
import useTheme from '@material-ui/core/styles/useTheme'

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
