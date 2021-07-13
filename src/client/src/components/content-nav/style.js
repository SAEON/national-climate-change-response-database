import makeStyles from '@material-ui/core/styles/makeStyles'
import { alpha } from '@material-ui/core/styles/colorManipulator'

export default makeStyles(theme => {
  return {
    card: {
      borderRadius: 0,
    },
    buttonBase: {
      minHeight: theme.spacing(8),
      transition: `all`,
      transitionDuration: `${theme.transitions.duration.standard}ms`,
      transitionTimingFunction: theme.transitions.easing.sharp,
    },
    active: {
      transition: `all`,
      transitionDuration: `${theme.transitions.duration.standard}ms`,
      transitionTimingFunction: theme.transitions.easing.sharp,
      backgroundColor: alpha(theme.palette.primary.main, 0.3),
      minHeight: theme.spacing(16),
    },
    disabled: {
      backgroundColor: theme.palette.grey[200],
    },
  }
})
