import SubmitIcon from 'mdi-react/DatabasePlusIcon'
import Button from '@mui/material/Button'
import { Link } from 'react-router-dom'
import Tooltip from '@mui/material/Tooltip'
import Hidden from '@mui/material/Hidden'
import IconButton from '@mui/material/IconButton'
import { Span } from '../../../components/html-tags'

export default () => {
  return (
    <Tooltip placement="bottom" title="Submit a new project using the online form">
      <Span>
        <Hidden smDown>
          <Button
            component={Link}
            to="/submissions/new"
            disableElevation
            size="small"
            variant="text"
            color="primary"
            startIcon={<SubmitIcon size={18} />}
          >
            New submission
          </Button>
        </Hidden>
        <Hidden smUp>
          <IconButton component={Link} to="/submissions/new" size="small" color="primary">
            <SubmitIcon size={18} />
          </IconButton>
        </Hidden>
      </Span>
    </Tooltip>
  )
}
