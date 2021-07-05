import Button from '@material-ui/core/Button'
import EditIcon from 'mdi-react/EditIcon'
import { Link } from 'react-router-dom'

export default ({ id }) => {
  return (
    <Button
      component={Link}
      to={`/submissions/${id}/edit`}
      startIcon={<EditIcon size={18} />}
      color="primary"
      size="small"
      variant="outlined"
    >
      Edit
    </Button>
  )
}
