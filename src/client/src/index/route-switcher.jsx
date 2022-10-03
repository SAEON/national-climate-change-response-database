import { useContext, useMemo } from 'react'
import { Route, Routes } from 'react-router-dom'
import checkTenantRouteAuthorization from '../lib/check-tenant-route-authorization'
import { context as clientContext } from '../contexts/client-context'
import FourFour from '../components/404'
import useTheme from '@mui/material/styles/useTheme'

export default () => {
  const tenantContext = useContext(clientContext)
  const { _clientRoutes: _routes } = tenantContext
  const theme = useTheme()

  const routes = useMemo(() => _routes.filter(({ Component }) => Boolean(Component)), [_routes])

  return (
    <Routes>
      {routes.map(({ label: key, to: path, exact, Component, tenants }) => {
        if (tenants) {
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
        }

        return <Route key={key} path={path} exact={exact} element={<Component />} />
      })}
    </Routes>
  )
}
