import { useContext } from 'react'
import { context as authenticationContext } from '../../../contexts/authentication'
import { Link, useLocation } from 'react-router-dom'
import MuiLink from '@material-ui/core/Link'
import Toolbar from '@material-ui/core/Toolbar'
import { NCCRD_API_ADDRESS, NCCRD_CLIENT_ADDRESS } from '../../../config'
import NavMenu from './nav-menu'
import Breadcrumbs from './breadcrumbs'
import Divider from '@material-ui/core/Divider'
import useTheme from '@material-ui/core/styles/useTheme'
import Typography from '@material-ui/core/Typography'

export default () => {
  const theme = useTheme()
  const { userInfo: authenticated } = useContext(authenticationContext)
  useLocation() // Trigger re-render on location changes

  return (
    <Toolbar
      disableGutters
      style={{
        display: 'flex',
        padding: theme.spacing(1),
      }}
    >
      {/* NAVIGATION MENU */}
      <NavMenu />

      <Divider orientation="vertical" flexItem style={{ margin: theme.spacing(2) }} />

      {/* BREADCRUMBS */}
      <Breadcrumbs />

      {/* LOG IN */}
      {window.location.pathname !== '/login' && !authenticated && (
        <MuiLink
          style={{ marginLeft: 'auto' }}
          component={Link}
          to={`/login?redirect=${window.location.href}`}
        >
          <Typography style={{ paddingRight: theme.spacing(1) }} variant="overline">
            Log in
          </Typography>
        </MuiLink>
      )}
      {/* LOG OUT */}
      {authenticated && (
        <MuiLink
          style={{ marginLeft: 'auto' }}
          href={`${NCCRD_API_ADDRESS}/logout?redirect=${NCCRD_CLIENT_ADDRESS}`}
        >
          <Typography style={{ paddingRight: theme.spacing(1) }} variant="overline">
            Log out
          </Typography>
        </MuiLink>
      )}
    </Toolbar>
  )
}
