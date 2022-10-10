import { Link } from 'react-router-dom'
import Button from '@mui/material/Button'
import SvgIcon from '@mui/material/SvgIcon'
import LoginIcon from 'mdi-react/LoginVariantIcon'
import Tooltip from '@mui/material/Tooltip'

export default props => {
  return (
    <Tooltip title="Log in">
      <span>
        <Button
          component={Link}
          to={`/login?redirect=${window.location.href}`}
          size="small"
          endIcon={
            <SvgIcon {...props}>
              <LoginIcon />
            </SvgIcon>
          }
          {...props}
        >
          Log in / Sign up
        </Button>
      </span>
    </Tooltip>
  )
}
