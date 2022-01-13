import { useState, useContext } from 'react'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuIcon from 'mdi-react/MenuIcon'
import NavItem from './_nav-item'
import { context as authorizationContext } from '../../../../contexts/authorization'
import { context as clientContext } from '../../../../contexts/client-context'
import checkTenantRouteAuthorization from '../../../../lib/check-tenant-route-authorization'

/**
 * SPA routes are shown based on 2 authorization conditions
 *  (1) Does the current tenant have permission to show the route
 *  (2) Does the current user have permission to see the route
 *
 * TODO - a lot of this logic is duplicated in the footer component.
 * Should be combined
 */
export default ({ routes }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const { hasPermission } = useContext(authorizationContext)
  const tenantContext = useContext(clientContext)

  return (
    <>
      <IconButton
        aria-label="Show navigation menu"
        onClick={e => setAnchorEl(anchorEl ? null : e.currentTarget)}
        color="inherit"
        size="large"
      >
        <MenuIcon />
      </IconButton>

      <Menu
        id="site-navigation-menu"
        anchorEl={anchorEl}
        disableScrollLock
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        {routes
          .filter(({ requiredPermission = false, excludeFromNav = false, tenants }) => {
            if (excludeFromNav) {
              return false
            }

            /**
             * Authorization condition (1): does
             * the tenant have permission to advertise
             * this route
             */
            if (tenants) {
              if (!checkTenantRouteAuthorization(tenants, tenantContext)) {
                return false
              }
            }

            /**
             * Authorization condition (2): does
             * the user have permission to access
             * this route
             */
            return requiredPermission ? hasPermission(requiredPermission) : true
          })
          .map(({ label, Icon, to, href }) => {
            if (!Icon) {
              throw new Error('Cannot draw menu item without an Icon')
            }

            return (
              <NavItem
                onClick={() => setAnchorEl(null)}
                href={href}
                key={label}
                Icon={Icon}
                label={label}
                to={to}
              />
            )
          })}
      </Menu>
    </>
  )
}
