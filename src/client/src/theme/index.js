import createTheme from '@material-ui/core/styles/createTheme'
import { alpha } from '@material-ui/core/styles/colorManipulator'
import overrides from './_mui-overrides'
import muiDefaults from './_mui'
import custom from './_custom'

const defaultTheme = createTheme()

export default createTheme({
  ...muiDefaults,
  overrides: overrides(defaultTheme),
  ...custom(defaultTheme),
  backgroundColor: alpha(defaultTheme.palette.common.white, 1),
  border: `1px solid ${alpha(defaultTheme.palette.common.black, 0.12)}`,
})
