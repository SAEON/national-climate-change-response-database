import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import useTheme from '@material-ui/core/styles/useTheme'
import MobileSideMenu from './mobile-side-menu'
import Hidden from '@material-ui/core/Hidden'
import Typography from '@material-ui/core/Typography'

export default ({ MobileFilters, projects }) => {
  const theme = useTheme()

  return (
    <AppBar
      style={{ backgroundColor: theme.backgroundColor, zIndex: 999 }}
      variant="outlined"
      position="relative"
    >
      <Toolbar
        style={{ paddingLeft: theme.spacing(2), paddingRight: theme.spacing(1) }}
        variant="dense"
      >
        {/* RESULT COUNT */}
        <Typography variant="overline" color="primary">
          {projects.length} project{projects.length === 1 ? '' : 's'}
        </Typography>

        <div style={{ marginLeft: 'auto' }} />

        {/* MOBILE FILTERS */}
        <Hidden mdUp>
          <MobileSideMenu Filters={MobileFilters} />
        </Hidden>
      </Toolbar>
    </AppBar>
  )
}
