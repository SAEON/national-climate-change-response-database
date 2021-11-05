import { useState, useContext } from 'react'
import { context as authContext } from '../../../contexts/authorization'
import IconButton from '@mui/material/IconButton'
import MenuIcon from 'mdi-react/MenuIcon'
import Menu from '@mui/material/Menu'
import navItems from './nav-items'
import NavItem from './nav-item'

export default () => {
  const { hasPermission, user } = useContext(authContext)
  const [anchorEl, setAnchorEl] = useState(null)

  return (
    <div>
      <IconButton
        aria-controls="site-navigation-menu"
        aria-haspopup="true"
        onClick={e => setAnchorEl(e.currentTarget)}
        size="large"
      >
        <MenuIcon size={18} />
      </IconButton>

      {/* MENU */}
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        {navItems.map(({ label, Icon, to, excludeFromNav, requiredPermission }) => {
          if (excludeFromNav) {
            return null
          }

          if (requiredPermission) {
            if (!hasPermission(requiredPermission)) {
              return null
            }
          }

          return (
            <NavItem
              onClick={() => setAnchorEl(null)}
              key={label}
              Icon={Icon}
              label={label}
              to={to.replace(':id', user?.id || 'na')}
            />
          )
        })}
      </Menu>
    </div>
  )
}
