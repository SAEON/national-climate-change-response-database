import SubmitIcon from 'mdi-react/DatabasePlusIcon'
import Button from '@material-ui/core/Button'
import { Link } from 'react-router-dom'

export default () => {
  return (
    <Button
      component={Link}
      to="/projects/submission"
      disableElevation
      size="small"
      variant="contained"
      color="primary"
      startIcon={<SubmitIcon size={18} />}
    >
      Submit project
    </Button>
  )
}
