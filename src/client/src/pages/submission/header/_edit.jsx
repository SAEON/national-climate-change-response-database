import EditIcon from 'mdi-react/EditIcon'
import Button from '@mui/material/Button'
import { Link } from 'react-router-dom'
import Tooltip from '@mui/material/Tooltip'
import Hidden from '@mui/material/Hidden'
import IconButton from '@mui/material/IconButton'

export default ({ id }) => {
  return (
    <Tooltip placement="bottom" title="Edit this project">
      <span>
        <Hidden smDown>
          <Button
            component={Link}
            to={`/submissions/${id}/edit`}
            disableElevation
            size="small"
            variant="text"
            color="primary"
            startIcon={<EditIcon size={18} />}
          >
            Edit
          </Button>
        </Hidden>
        <Hidden smUp>
          <IconButton component={Link} to={`/submissions/${id}/edit`} size="small" color="primary">
            <EditIcon size={18} />
          </IconButton>
        </Hidden>
      </span>
    </Tooltip>
  )
}
