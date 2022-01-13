import { useContext } from 'react'
import { context as clientContext } from '../../contexts/client-context'
import { context as authorizationContext } from '../../contexts/authentication'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'
import { useTheme } from '@mui/material/styles'
import { Link as RouterLink } from 'react-router-dom'
import Link from '@mui/material/Link'
import checkTenantRouteAuthorization from '../../lib/check-tenant-route-authorization'

export default ({ routes }) => {
  const theme = useTheme()
  const tenantContext = useContext(clientContext)
  const { hasPermission } = useContext(authorizationContext)

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h5">Quick links</Typography>
      </Grid>
      <Grid container item xs={12}>
        {routes
          .filter(({ group, tenants, requiredPermission = false }) => {
            if (tenants) {
              if (!checkTenantRouteAuthorization(tenants, tenantContext)) {
                return false
              }
            }

            if (requiredPermission) {
              if (!hasPermission || !hasPermission(requiredPermission)) {
                return false
              }
            }

            if (group === 'legal') return false
            return true
          })
          .map(({ label, Icon, to }) => (
            <Grid item xs={12} key={label}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Icon size={18} />
                <Typography
                  component={({ style, ...otherProps }) => (
                    <Link
                      {...otherProps}
                      style={Object.assign(
                        { ...style },
                        { color: 'white', marginLeft: theme.spacing(1) }
                      )}
                      to={to}
                      component={RouterLink}
                      key={label}
                    >
                      {label}
                    </Link>
                  )}
                  variant="overline"
                >
                  {label}
                </Typography>
              </div>
            </Grid>
          ))}
      </Grid>
    </Grid>
  )
}
