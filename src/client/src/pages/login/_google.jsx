import { NCCRD_API_ADDRESS } from '../../config'
import GoogleIcon from 'mdi-react/GoogleIcon'
import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'
import clsx from 'clsx'
import useStyles from './style'

export default ({ redirect }) => {
  const classes = useStyles()

  return (
    <Tooltip title={'Login via your Google account'} placement="bottom-end">
      <span>
        <Button
          href={`${NCCRD_API_ADDRESS}/login/google?redirect=${redirect}`}
          fullWidth
          className={clsx(classes.button)}
          color="primary"
          disableElevation={true}
          variant="outlined"
          startIcon={<GoogleIcon size={22} />}
        >
          Connect with Google
        </Button>
      </span>
    </Tooltip>
  )
}
