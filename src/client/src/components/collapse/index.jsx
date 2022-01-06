import { useState } from 'react'
import Collapse from '@mui/material/Collapse'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import ExpandIcon from 'mdi-react/ChevronDownIcon'
import CollapseIcon from 'mdi-react/ChevronUpIcon'
import Avatar from '@mui/material/Avatar'
import useLocalStorage from '../../hooks/use-localstorage'

import clsx from 'clsx'
import useStyles from './style'

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
  error = false,
}) => {
  const classes = useStyles()
  const [collapsed, setCollapsed] = id
    ? useLocalStorage(id, !defaultExpanded)
    : useState(!defaultExpanded)

  return (
    <Card
      variant="outlined"
      className={clsx({
        [classes.root]: true,
        [classes.errorOutline]: error && !collapsed,
        [classes.errorBackground]: error && collapsed,
      })}
      style={{ width: '100%', ...cardStyle }}
    >
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
