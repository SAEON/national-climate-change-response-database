import AppBar from '@mui/material/AppBar'
import { cloneElement, forwardRef } from 'react'
import Toolbar from '@mui/material/Toolbar'
import useScrollTrigger from '@mui/material/useScrollTrigger'
import useTheme from '@mui/material/styles/useTheme'

const AnimateVariant = ({ children }) =>
  cloneElement(children, {
    variant: useScrollTrigger({
      disableHysteresis: true,
      threshold: location.pathname === '/' ? 0 : 2,
    })
      ? 'regular'
      : 'dense',
  })

export default forwardRef(({ children, style, ...props }, ref) => {
  const theme = useTheme()

  return (
    <AppBar color="inherit" variant="outlined" elevation={0} position="sticky" {...props}>
      <AnimateVariant>
        <Toolbar
          ref={ref}
          style={{
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
            display: 'flex',
            justifyContent: 'flex-end',
            transition: 'min-height 300ms cubic-bezier(0.4, 0, 0.2, 1)',
            ...style,
          }}
        >
          {children}
        </Toolbar>
      </AnimateVariant>
    </AppBar>
  )
})
