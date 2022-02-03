import SubmitIcon from 'mdi-react/DatabasePlusIcon'
import Button from '@mui/material/Button'
import { Link } from 'react-router-dom'
import Tooltip from '@mui/material/Tooltip'
import Hidden from '@mui/material/Hidden'
import IconButton from '@mui/material/IconButton'

export default () => {
  return (
    <Tooltip placement="bottom" title="Submit a new project using the online form">
      <span>
        <Hidden smDown>
          <Button
            component={Link}
            to="/submissions/new"
            disableElevation
            size="small"
            variant="text"
            color="primary"
            startIcon={
              <Hidden lgDown>
                <SubmitIcon size={18} />
              </Hidden>
            }
          >
            New submission
          </Button>
        </Hidden>
        <Hidden smUp>
          <IconButton component={Link} to="/submissions/new" size="small" color="primary">
            <SubmitIcon size={18} />
          </IconButton>
        </Hidden>
      </span>
    </Tooltip>
  )
}
