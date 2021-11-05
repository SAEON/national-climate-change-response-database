import { useState, useContext } from 'react'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuIcon from 'mdi-react/MenuIcon'
import NavItem from './_nav-item'
import { context as authorizationContext } from '../../../../contexts/authorization'

export default ({ routes }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const { hasPermission } = useContext(authorizationContext)

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
          .filter(({ requiredPermission = false, excludeFromNav = false }) => {
            if (excludeFromNav) {
              return false
            }
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
