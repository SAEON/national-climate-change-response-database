import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import useTheme from '@material-ui/core/styles/useTheme'
import MobileSideMenu from './mobile-side-menu'
import Hidden from '@material-ui/core/Hidden'
import Typography from '@material-ui/core/Typography'

export default ({ MobileFilters, filters, projects }) => {
  const theme = useTheme()

  return (
    <AppBar color="inherit" variant="outlined" position="sticky">
      <Toolbar style={{ paddingLeft: theme.spacing(2), paddingRight: theme.spacing(1) }}>
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
    </AppBar>
  )
}
