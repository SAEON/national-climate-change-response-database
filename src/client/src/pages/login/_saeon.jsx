import { NCCRD_API_HTTP_ADDRESS } from '../../config'
import NRFIcon from '../../icons/nrf-icon'
import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'
import clsx from 'clsx'
import useStyles from './style'

export default ({ redirect }) => {
  const classes = useStyles()

  return (
    <Tooltip title={"Login via SAEON's SSO provider"} placement="bottom-end">
      <span>
        <Button
          href={`${NCCRD_API_HTTP_ADDRESS}/login/saeon?redirect=${redirect}`}
          fullWidth
          className={clsx(classes.button)}
          color="default"
          disableElevation={true}
          variant="outlined"
          startIcon={<NRFIcon size={22} />}
        >
          Connect with SAEON
        </Button>
      </span>
    </Tooltip>
  )
}
