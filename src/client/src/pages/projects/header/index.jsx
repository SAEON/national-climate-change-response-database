import { useContext, cloneElement } from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import useTheme from '@material-ui/core/styles/useTheme'
import MobileSideMenu from './mobile-side-menu'
import Hidden from '@material-ui/core/Hidden'
import Typography from '@material-ui/core/Typography'
import { context as filterContext } from '../context'
import useScrollTrigger from '@material-ui/core/useScrollTrigger'

const AnimateVariant = ({ children }) =>
  cloneElement(children, {
    variant: useScrollTrigger({
      disableHysteresis: true,
      threshold: 0,
    })
      ? 'regular'
      : 'dense',
  })

export default ({ MobileFilters }) => {
  const { filters, projects } = useContext(filterContext)
  const theme = useTheme()

  return (
    <AppBar color="inherit" variant="outlined" position="sticky">
      <AnimateVariant>
        <Toolbar
          style={{
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(1),
            transition: 'min-height 300ms cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {/* RESULT COUNT */}
          <Typography variant="overline" color="primary">
            {projects.length} project{projects.length === 1 ? '' : 's'}
          </Typography>

          <div style={{ marginLeft: 'auto' }} />

          {/* MOBILE FILTERS */}
          <Hidden mdUp>
            <MobileSideMenu Filters={MobileFilters} filters={filters} />
          </Hidden>
        </Toolbar>
      </AnimateVariant>
    </AppBar>
  )
}
