import makeStyles from '@material-ui/core/styles/makeStyles'
import { alpha } from '@material-ui/core/styles/colorManipulator'

export default makeStyles(theme => {
  return {
    card: {
      borderRadius: 0,
    },
    active: {
      backgroundColor: alpha(theme.palette.primary.main, 0.2),
    },
    disabled: {
      backgroundColor: theme.palette.grey[200],
    },
  }
})
