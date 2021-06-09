import SubmitIcon from 'mdi-react/DatabasePlusIcon'
import Button from '@material-ui/core/Button'
import { Link } from 'react-router-dom'
import Tooltip from '@material-ui/core/Tooltip'
import Hidden from '@material-ui/core/Hidden'
import IconButton from '@material-ui/core/IconButton'

export default () => {
  return (
    <Tooltip placement="bottom" title="Submit a new project using the online form">
      <span>
        <Hidden xsDown>
          <Button
            component={Link}
            to="/projects/submission"
            disableElevation
            size="small"
            variant="text"
            color="primary"
            startIcon={<SubmitIcon size={18} />}
          >
            Submit project
          </Button>
        </Hidden>
        <Hidden smUp>
          <IconButton component={Link} to="/projects/submission" size="small" color="primary">
            <SubmitIcon size={18} />
          </IconButton>
        </Hidden>
      </span>
    </Tooltip>
  )
}
