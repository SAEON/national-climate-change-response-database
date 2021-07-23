import { useContext } from 'react'
import Icon from 'mdi-react/FileUserIcon'
import Button from '@material-ui/core/Button'
import { Link } from 'react-router-dom'
import Tooltip from '@material-ui/core/Tooltip'
import Hidden from '@material-ui/core/Hidden'
import IconButton from '@material-ui/core/IconButton'
import { context as authContext } from '../../../contexts/authorization'
import Divider from '@material-ui/core/Divider'
import useTheme from '@material-ui/core/styles/useTheme'

export default () => {
  const theme = useTheme()
  const _authContext = useContext(authContext)
  const { isAuthenticated } = _authContext

  if (!isAuthenticated) {
    return null
  }

  return (
    <>
      <Tooltip placement="bottom" title="View your project submissions">
        <span>
          <Hidden xsDown>
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
        </span>
      </Tooltip>

      <Divider
        flexItem
        orientation="vertical"
        style={{ marginLeft: theme.spacing(2), marginRight: theme.spacing(2) }}
      />
    </>
  )
}
