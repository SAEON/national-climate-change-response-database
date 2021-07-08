import { useContext } from 'react'
import { context as authContext } from '../../../../contexts/authorization'
import Button from '@material-ui/core/Button'
import EditIcon from 'mdi-react/EditIcon'
import { Link } from 'react-router-dom'

export default ({ id, createdBy }) => {
  const { hasPermission, user } = useContext(authContext)

  /**
   * Users can edit their own submissions
   *
   * Users with the permission 'edit-project'
   * can edit submissions
   */
  if (!hasPermission('update-project')) {
    if (createdBy?.id !== user?.id) {
      return null
    }
  }

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