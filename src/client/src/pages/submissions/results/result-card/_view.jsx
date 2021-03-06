import Button from '@mui/material/Button'
import ViewIcon from 'mdi-react/EyeIcon'
import { Link } from 'react-router-dom'

export default ({ id }) => {
  return (
    <Button
      component={Link}
      to={`/submissions/${id}`}
      startIcon={<ViewIcon size={18} />}
      color="primary"
      size="small"
      sx={{ marginLeft: theme => theme.spacing(1) }}
      variant="text"
    >
      View
    </Button>
  )
}
