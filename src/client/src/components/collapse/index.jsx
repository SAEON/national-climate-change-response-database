import { useState } from 'react'
import Collapse from '@mui/material/Collapse'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import ExpandIcon from 'mdi-react/ChevronDownIcon'
import CollapseIcon from 'mdi-react/ChevronUpIcon'
import Avatar from '@mui/material/Avatar'
import useLocalStorage from '../../hooks/use-localstorage'

export default ({
  id = undefined,
  children,
  title,
  subheader = undefined,
  Icon = undefined,
  avatarStyle = {},
  defaultExpanded = false,
  actions = [],
  cardStyle = {},
}) => {
  const [collapsed, setCollapsed] = id
    ? useLocalStorage(id, !defaultExpanded)
    : useState(!defaultExpanded)

  return (
    <Card variant="outlined" style={{ width: '100%', ...cardStyle }}>
      <CardHeader
        subheader={subheader || ''}
        style={{ cursor: 'pointer' }}
        onClick={() => setCollapsed(!collapsed)}
        avatar={
          Icon && (
            <Avatar style={avatarStyle}>
              <Icon />
            </Avatar>
          )
        }
        title={title}
        action={[
          ...actions,
          <IconButton key="in-out" size="large">
            {collapsed && <ExpandIcon />}
            {!collapsed && <CollapseIcon />}
          </IconButton>,
        ]}
      />

      <Collapse unmountOnExit in={!collapsed}>
        {children}
      </Collapse>
    </Card>
  )
}
