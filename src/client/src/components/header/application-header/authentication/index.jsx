import { useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import CircularProgress from '@mui/material/CircularProgress'
import { useTheme } from '@mui/material/styles'
import { context as authContext } from '../../../../contexts/authentication'
import Login from './_login'
import UserMenu from './user-menu'
import Divider from '@mui/material/Divider'

export default () => {
  const { pathname } = useLocation()
  const isLoginPage = useMemo(() => pathname.includes('login'), [pathname])
  const theme = useTheme()

  return (
    <>
      <Divider flexItem orientation="vertical" style={{ marginRight: theme.spacing(1) }} />
      <div style={{ marginRight: theme.spacing(1) }}>
        <authContext.Consumer>
          {({ user, authenticating }) => {
            if (authenticating) {
              return <CircularProgress color="inherit" thickness={2} size={18} />
            }

            return (
              <>
                {user && (
                  <UserMenu
                    style={{ display: 'flex', alignItems: 'center', marginRight: theme.spacing(1) }}
                    user={user}
                  />
                )}
                {!user && <Login disabled={isLoginPage} />}
              </>
            )
          }}
        </authContext.Consumer>
      </div>
    </>
  )
}
