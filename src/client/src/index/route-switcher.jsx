import { Route, Switch, withRouter } from 'react-router-dom'
import { useContext } from 'react'
import checkTenantRouteAuthorization from '../lib/check-tenant-route-authorization'
import { context as clientContext } from '../contexts/client-context'
import FourFour from '../components/404'
import useTheme from '@mui/material/styles/useTheme'

export default withRouter(({ routes }) => {
  const tenantContext = useContext(clientContext)
  const theme = useTheme()

  return (
    <Switch key={location.pathname || '/'}>
      {routes.map(({ label: key, to: path, exact, render, tenants = [] }) => {
        if (!checkTenantRouteAuthorization(tenants, tenantContext)) {
          return (
            <Route
              key={key}
              path={path}
              exact={exact}
              render={() => (
                <>
                  <div style={{ marginTop: theme.spacing(3) }} />
                  <FourFour />
                </>
              )}
            />
          )
        }
        return <Route key={key} path={path} exact={exact} render={render} />
      })}
    </Switch>
  )
})
