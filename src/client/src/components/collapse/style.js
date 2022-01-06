import makeStyles from '@mui/styles/makeStyles'
import color from 'color'

export default makeStyles(theme => ({
  root: {
    backgroundColor: theme.palette.common.white,
    transition: theme.transitions.create(['background-color', 'outline']),
    outline: 'none',
  },
  errorOutline: {
    outline: `1px solid ${theme.palette.error.light}`,
  },
  errorBackground: {
    backgroundColor: color(theme.palette.error.light).lighten(0.5).hex(),
  },
}))
