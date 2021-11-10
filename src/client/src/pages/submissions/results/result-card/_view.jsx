import Button from '@mui/material/Button'
import ViewIcon from 'mdi-react/EyeIcon'
import { Link } from 'react-router-dom'
import useTheme from '@mui/material/styles/useTheme'

export default ({ id }) => {
  const theme = useTheme()

  return (
    <Button
      component={Link}
      to={`/submissions/${id}`}
      startIcon={<ViewIcon size={18} />}
      color="primary"
      size="small"
      style={{ marginLeft: theme.spacing(1) }}
      variant="text"
    >
      View
    </Button>
  )
}
