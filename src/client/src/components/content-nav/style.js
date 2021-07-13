import makeStyles from '@material-ui/core/styles/makeStyles'
import { alpha } from '@material-ui/core/styles/colorManipulator'

export default makeStyles(theme => {
  return {
    card: {
      borderRadius: 0,
    },
    buttonBase: {
      transition: `all`,
      transitionDuration: `${theme.transitions.duration.short}ms`,
      transitionTimingFunction: theme.transitions.easing.sharp,
      [theme.breakpoints.up('lg')]: {
        minHeight: theme.spacing(10),
      },
    },
    active: {
      transition: `all`,
      transitionDuration: `${theme.transitions.duration.short}ms`,
      transitionTimingFunction: theme.transitions.easing.sharp,
      backgroundColor: alpha(theme.palette.primary.main, 0.3),
      [theme.breakpoints.up('lg')]: {
        minHeight: theme.spacing(16),
      },
    },
    disabled: {
      backgroundColor: theme.palette.grey[200],
    },
  }
})
