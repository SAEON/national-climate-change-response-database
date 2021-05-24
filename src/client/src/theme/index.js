import createMuiTheme from '@material-ui/core/styles/createMuiTheme'
import { fade } from '@material-ui/core/styles/colorManipulator'
import overrides from './_mui-overrides'
import muiDefaults from './_mui'
import custom from './_custom'

const defaultTheme = createMuiTheme()

export default createMuiTheme({
  ...muiDefaults,
  overrides: overrides(defaultTheme),
  ...custom(defaultTheme),
  backgroundColor: fade(defaultTheme.palette.common.white, 0.9),
  border: `1px solid ${fade(defaultTheme.palette.common.black, 0.12)}`,
})
