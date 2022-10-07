import { Link } from 'react-router-dom'
import Button from '@mui/material/Button'
import LoginIcon from 'mdi-react/LoginVariantIcon'
import Tooltip from '@mui/material/Tooltip'

export default props => {
  return (
    <Tooltip title="Log in">
      <span>
        <Button
          component={Link}
          to={`/login?redirect=${window.location.href}`}
          {...props}
          size="medium"
          endIcon={<LoginIcon />}
        >
          Log in / Sign up
        </Button>
      </span>
    </Tooltip>
  )
}
