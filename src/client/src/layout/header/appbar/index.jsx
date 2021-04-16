import { useContext } from 'react'
import { context as authenticationContext } from '../../../contexts/authentication'
import { Link, useLocation } from 'react-router-dom'
import MuiLink from '@material-ui/core/Link'
import Toolbar from '@material-ui/core/Toolbar'
import { NCCRD_API_ADDRESS, NCCRD_CLIENT_ADDRESS } from '../../../config'

export default () => {
  const { userInfo: authenticated } = useContext(authenticationContext)
  useLocation() // Trigger re-render on location changes

  return (
    <Toolbar
      style={{
        display: 'flex',
      }}
    >
      {/* LOG IN */}
      {window.location.pathname !== '/login' && !authenticated && (
        <MuiLink
          style={{ marginLeft: 'auto' }}
          component={Link}
          to={`/login?redirect=${window.location.href}`}
        >
          Log in
        </MuiLink>
      )}

      {/* LOG OUT */}
      {authenticated && (
        <MuiLink
          style={{ marginLeft: 'auto' }}
          href={`${NCCRD_API_ADDRESS}/logout?redirect=${NCCRD_CLIENT_ADDRESS}`}
        >
          Log out
        </MuiLink>
      )}
    </Toolbar>
  )
}
