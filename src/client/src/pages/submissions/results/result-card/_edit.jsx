import { useContext } from 'react'
import { context as authContext } from '../../../../contexts/authorization'
import Button from '@mui/material/Button'
import EditIcon from 'mdi-react/EditIcon'
import { Link } from 'react-router-dom'

export default ({ id, createdBy }) => {
  const { hasPermission, user } = useContext(authContext)

  /**
   * Users can edit their own submissions
   *
   * Users with the permission
   * can edit submissions
   */
  if (!hasPermission('update-submission')) {
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
