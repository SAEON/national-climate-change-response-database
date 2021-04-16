import { useState } from 'react'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from 'mdi-react/MenuIcon'
import Menu from '@material-ui/core/Menu'
import navItems from './nav-items'
import NavItem from './nav-item'

export default () => {
  const [anchorEl, setAnchorEl] = useState(null)

  return (
    <div>
      <IconButton
        aria-controls="site-navigation-menu"
        aria-haspopup="true"
        onClick={e => setAnchorEl(e.currentTarget)}
      >
        <MenuIcon />
      </IconButton>

      {/* MENU */}
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        {navItems.map(({ label, Icon, to, excludeFromNav }) =>
          excludeFromNav ? null : (
            <NavItem
              onClick={() => setAnchorEl(null)}
              key={label}
              Icon={Icon}
              label={label}
              to={to}
            />
          )
        )}
      </Menu>
    </div>
  )
}
