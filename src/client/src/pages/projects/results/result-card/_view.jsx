import Button from '@material-ui/core/Button'
import ViewIcon from 'mdi-react/EyeIcon'
import { Link } from 'react-router-dom'

export default ({ id }) => {
  return (
    <Button
      component={Link}
      to={`/projects/${id}`}
      startIcon={<ViewIcon size={18} />}
      color="primary"
      size="small"
      variant="outlined"
    >
      View
    </Button>
  )
}
