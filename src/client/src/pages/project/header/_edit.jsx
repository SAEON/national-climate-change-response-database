import EditIcon from 'mdi-react/EditIcon'
import Button from '@material-ui/core/Button'
import { Link } from 'react-router-dom'
import Tooltip from '@material-ui/core/Tooltip'
import Hidden from '@material-ui/core/Hidden'
import IconButton from '@material-ui/core/IconButton'

export default ({ id }) => {
  return (
    <Tooltip placement="bottom" title="Edit this project">
      <span>
        <Hidden xsDown>
          <Button
            component={Link}
            to={`/projects/${id}/edit`}
            disableElevation
            size="small"
            variant="text"
            color="primary"
            startIcon={<EditIcon size={18} />}
          >
            Edit project
          </Button>
        </Hidden>
        <Hidden smUp>
          <IconButton component={Link} to={`/projects/${id}/edit`} size="small" color="primary">
            <EditIcon size={18} />
          </IconButton>
        </Hidden>
      </span>
    </Tooltip>
  )
}
