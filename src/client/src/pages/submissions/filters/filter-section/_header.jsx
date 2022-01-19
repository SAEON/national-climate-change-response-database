import Fade from '@mui/material/Fade'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from 'mdi-react/ExpandMoreIcon'
import ExpandLessIcon from 'mdi-react/ExpandLessIcon'

export default ({ title, collapsed, setCollapsed }) => {
  return (
    <AppBar
      sx={{ zIndex: 200 }}
      position="relative"
      color="inherit"
      elevation={collapsed ? 0 : 4}
      variant={collapsed ? 'outlined' : 'elevation'}
    >
      <Toolbar variant="regular">
        <Typography
          onClick={() => setCollapsed(!collapsed)}
          sx={{ cursor: 'pointer' }}
          variant="overline"
          noWrap
        >
          {title}
        </Typography>

        <div style={{ marginLeft: 'auto' }}>
          {/* Icon */}
          <IconButton
            onClick={() => setCollapsed(!collapsed)}
            aria-label="Collapse filter"
            color="inherit"
            size="small"
          >
            {collapsed ? (
              <Fade key={1} timeout={750} in={collapsed}>
                <span>
                  <ExpandMoreIcon />
                </span>
              </Fade>
            ) : (
              <Fade key={2} timeout={750} in={!collapsed}>
                <span>
                  <ExpandLessIcon />
                </span>
              </Fade>
            )}
          </IconButton>
        </div>
      </Toolbar>
    </AppBar>
  )
}
