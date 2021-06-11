import { useContext } from 'react'
import { context as authenticationContext } from '../../../contexts/authentication'
import { context as clientInfoContext } from '../../../contexts/client-info'
import { useLocation } from 'react-router-dom'
import MuiLink from '@material-ui/core/Link'
import Toolbar from '@material-ui/core/Toolbar'
import { NCCRD_API_HTTP_ADDRESS } from '../../../config'
import NavMenu from './nav-menu'
import Breadcrumbs from './breadcrumbs'
import Divider from '@material-ui/core/Divider'
import useTheme from '@material-ui/core/styles/useTheme'
import Typography from '@material-ui/core/Typography'
import useMediaQuery from '@material-ui/core/useMediaQuery'

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
        padding: theme.spacing(1),
      }}
    >
      {/* NAVIGATION MENU */}
      <NavMenu />

      {smAndUp && <Divider orientation="vertical" flexItem style={{ margin: theme.spacing(1) }} />}

      {/* BREADCRUMBS */}
      {smAndUp && <Breadcrumbs />}

      {/* LOG IN */}
      {window.location.pathname !== '/login' && !user && (
        <MuiLink
          style={{ marginLeft: 'auto' }}
          href={`${NCCRD_API_HTTP_ADDRESS}/login?redirect=${window.location.href}`}
        >
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
        >
          <Typography style={{ paddingRight: theme.spacing(1) }} variant="overline">
            Log out {smAndUp && `(${user.emailAddress})`}
          </Typography>
        </MuiLink>
      )}
    </Toolbar>
  )
}
