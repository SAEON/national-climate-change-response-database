import { useContext } from 'react'
import { context as authenticationContext } from '../../../contexts/authentication'
import { context as clientInfoContext } from '../../../contexts/client-info'
import { useLocation, Link } from 'react-router-dom'
import MuiLink from '@mui/material/Link'
import Toolbar from '@mui/material/Toolbar'
import { NCCRD_API_HTTP_ADDRESS } from '../../../config'
import NavMenu from './nav-menu'
import Breadcrumbs from './breadcrumbs'
import Divider from '@mui/material/Divider'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'

export default () => {
  const theme = useTheme()
  const { user } = useContext(authenticationContext)
  const { origin: NCCRD_CLIENT_ADDRESS } = useContext(clientInfoContext)
  useLocation() // Trigger re-render on location changes
  const smAndUp = useMediaQuery(theme.breakpoints.up('sm'))

  return (
    <Toolbar
      disableGutters
      style={{
        display: 'flex',
      }}
    >
      {/* NAVIGATION MENU */}
      <div style={{ marginLeft: theme.spacing(1) }} />
      <NavMenu />

      {smAndUp && (
        <Divider
          flexItem
          orientation="vertical"
          style={{ marginLeft: theme.spacing(1), marginRight: theme.spacing(2) }}
        />
      )}

      {/* BREADCRUMBS */}
      {smAndUp && <Breadcrumbs />}

      {/* LOG IN */}
      {window.location.pathname !== '/login' && !user && (
        <MuiLink
          component={Link}
          style={{ marginLeft: 'auto' }}
          to={`/login?redirect=${window.location.href}`}
          underline="hover">
          <Typography style={{ paddingRight: theme.spacing(1) }} variant="overline">
            Log in
          </Typography>
        </MuiLink>
      )}
      {/* LOG OUT */}
      {user && (
        <MuiLink
          style={{ marginLeft: 'auto' }}
          href={`${NCCRD_API_HTTP_ADDRESS}/logout?redirect=${NCCRD_CLIENT_ADDRESS}`}
          underline="hover">
          <Typography style={{ paddingRight: theme.spacing(1) }} variant="overline">
            Log out {smAndUp && `(${user.emailAddress})`}
          </Typography>
        </MuiLink>
      )}
    </Toolbar>
  );
}
