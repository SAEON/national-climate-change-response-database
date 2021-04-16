import createMuiTheme from '@material-ui/core/styles/createMuiTheme'
import overrides from './_mui-overrides'
import muiDefaults from './_mui'
import custom from './_custom'

const defaultTheme = createMuiTheme()

export default createMuiTheme({
  ...muiDefaults,
  overrides: overrides(defaultTheme),
  ...custom(defaultTheme),
})
