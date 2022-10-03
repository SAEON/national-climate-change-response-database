import { forwardRef } from 'react'
import { Link, useMatch } from 'react-router-dom'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'

export default forwardRef(({ onClick, label, to, Icon, href }, ref) => {
  const match = useMatch(to)

  return (
    <MenuItem
      ref={ref}
      dense
      disabled={Boolean(match)}
      component={href ? 'a' : Link}
      active={match}
      rel={href && 'noopener noreferrer'}
      target={href && '_blank'}
      onClick={onClick}
      to={to || ''}
      href={href}
    >
      <ListItemIcon
        sx={{
          color: theme => theme.palette.common.black,
        }}
      >
        <Icon />
      </ListItemIcon>
      <ListItemText
        sx={{
          color: theme => theme.palette.common.black,
        }}
        primary={label}
      />
    </MenuItem>
  )
})
