import { useState } from 'react'
import Collapse from '@mui/material/Collapse'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import IconButton from '@mui/material/IconButton'
import ExpandIcon from 'mdi-react/ChevronDownIcon'
import CollapseIcon from 'mdi-react/ChevronUpIcon'
import Avatar from '@mui/material/Avatar'
import { useTheme } from '@mui/material/styles'

export default ({
  children,
  title,
  subheader = undefined,
  Icon = undefined,
  avatarStyle = {},
  defaultExpanded = false,
  actions = [],
  cardStyle = {},
}) => {
  const theme = useTheme()
  const [collapsed, setCollapsed] = useState(!defaultExpanded)

  return (
    <Card
      variant="outlined"
      style={{ width: '100%', backgroundColor: theme.backgroundColor, ...cardStyle }}
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
