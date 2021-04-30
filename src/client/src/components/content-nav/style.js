import makeStyles from '@material-ui/core/styles/makeStyles'
import { fade } from '@material-ui/core/styles/colorManipulator'

export default makeStyles(theme => {
  return {
    active: {
      backgroundColor: fade(theme.palette.primary.main, 0.2),
    },
  }
})
