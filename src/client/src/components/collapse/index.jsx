import { useState } from 'react'
import Collapse from '@material-ui/core/Collapse'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import IconButton from '@material-ui/core/IconButton'
import ExpandIcon from 'mdi-react/ChevronDownIcon'
import CollapseIcon from 'mdi-react/ChevronUpIcon'
import Avatar from '@material-ui/core/Avatar'

export default ({
  children,
  title,
  Icon = undefined,
  avatarStyle = {},
  defaultExpanded = false,
  actions = [],
}) => {
  const [collapsed, setCollapsed] = useState(!defaultExpanded)

  return (
    <Card variant="outlined" style={{ width: '100%' }}>
      <CardHeader
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
          <IconButton key="in-out">
            {collapsed && <ExpandIcon />}
            {!collapsed && <CollapseIcon />}
          </IconButton>,
        ]}
      />

      <Collapse in={!collapsed}>{children}</Collapse>
    </Card>
  )
}
