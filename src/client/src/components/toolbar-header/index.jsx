import AppBar from '@material-ui/core/AppBar'
import { cloneElement } from 'react'
import Toolbar from '@material-ui/core/Toolbar'
import useScrollTrigger from '@material-ui/core/useScrollTrigger'
import useTheme from '@material-ui/core/styles/useTheme'

const AnimateVariant = ({ children }) =>
  cloneElement(children, {
    variant: useScrollTrigger({
      disableHysteresis: true,
      threshold: 0,
    })
      ? 'regular'
      : 'dense',
  })

export default ({ children }) => {
  const theme = useTheme()

  return (
    <AppBar
      style={{ marginBottom: theme.spacing(2) }}
      color="inherit"
      variant="outlined"
      position="sticky"
    >
      <AnimateVariant>
        <Toolbar
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(1),
            transition: 'min-height 300ms cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {children}
        </Toolbar>
      </AnimateVariant>
    </AppBar>
  )
}
