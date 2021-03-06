import { useContext } from 'react'
import Icon from 'mdi-react/FileUserIcon'
import Button from '@mui/material/Button'
import { Link } from 'react-router-dom'
import Tooltip from '@mui/material/Tooltip'
import Hidden from '@mui/material/Hidden'
import IconButton from '@mui/material/IconButton'
import { context as authContext } from '../../../contexts/authorization'
import Divider from '@mui/material/Divider'
import { Span } from '../../../components/html-tags'

export default () => {
  const _authContext = useContext(authContext)
  const { isAuthenticated } = _authContext

  if (!isAuthenticated) {
    return null
  }

  return (
    <>
      <Tooltip placement="bottom" title="View your project submissions">
        <Span>
          <Hidden smDown>
            <Button
              component={Link}
              to={`/user/submissions`}
              disableElevation
              size="small"
              variant="text"
              color="primary"
              startIcon={<Icon size={18} />}
            >
              Your Submissions
            </Button>
          </Hidden>
          <Hidden smUp>
            <IconButton component={Link} to="/submissions/new" size="small" color="primary">
              <Icon size={18} />
            </IconButton>
          </Hidden>
        </Span>
      </Tooltip>

      <Divider
        flexItem
        orientation="vertical"
        sx={theme => ({ marginLeft: theme.spacing(2), marginRight: theme.spacing(2) })}
      />
    </>
  )
}
