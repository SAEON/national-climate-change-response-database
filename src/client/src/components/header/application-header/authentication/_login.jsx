import { Link } from 'react-router-dom'
import IconButton from '@mui/material/IconButton'
import LoginIcon from 'mdi-react/LoginVariantIcon'
import Tooltip from '@mui/material/Tooltip'

export default props => {
  return (
    <Tooltip title="Log in">
      <span>
        <IconButton
          component={Link}
          to={`/login?redirect=${window.location.href}`}
          {...props}
          size="large"
        >
          <LoginIcon />
        </IconButton>
      </span>
    </Tooltip>
  )
}
