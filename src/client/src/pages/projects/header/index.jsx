import { useContext, cloneElement } from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import useTheme from '@material-ui/core/styles/useTheme'
import MobileSideMenu from './_mobile-side-menu'
import Hidden from '@material-ui/core/Hidden'
import Typography from '@material-ui/core/Typography'
import { context as filterContext } from '../context'
import useScrollTrigger from '@material-ui/core/useScrollTrigger'
import SubmitProject from './_submit-project'
import DownloadData from './_download-data'

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
    <AppBar
      style={{ marginBottom: theme.spacing(2) }}
      color="inherit"
      variant="outlined"
      position="sticky"
    >
      <AnimateVariant>
        <Toolbar
          style={{
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(1),
            transition: 'min-height 300ms cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {/* MOBILE FILTERS */}
          <Hidden mdUp>
            <MobileSideMenu Filters={MobileFilters} filters={filters} />
            <div style={{ marginRight: theme.spacing(2) }} />
          </Hidden>
          {/* RESULT COUNT */}
          <Typography variant="overline" color="primary">
            {projects.length} project{projects.length === 1 ? '' : 's'}
          </Typography>

          <div style={{ marginLeft: 'auto' }} />
          <SubmitProject />
          <div style={{ marginLeft: theme.spacing(1) }} />
          <DownloadData />
        </Toolbar>
      </AnimateVariant>
    </AppBar>
  )
}
