import { useState } from 'react'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import Tooltip from '@mui/material/Tooltip'
import UserIcon from 'mdi-react/AccountIcon'
import Logout from './_logout'

export default props => {
  const [anchor, setAnchor] = useState(null)

  const onClose = () => setAnchor(null)
  const onOpen = e => setAnchor(e.currentTarget)

  return (
    <div>
      {/* MENU TRIGGER */}
      <Tooltip title={`Hi ${props.user.name || props.user.emailAddress}`}>
        <IconButton onClick={onOpen} size="large">
          <UserIcon />
        </IconButton>
      </Tooltip>

      {/* MENU */}
      <Menu
        disableScrollLock
        id="simple-menu"
        anchorEl={anchor}
        keepMounted
        open={Boolean(anchor)}
        onClose={onClose}
      >
        <Logout />
      </Menu>
    </div>
  )
}
