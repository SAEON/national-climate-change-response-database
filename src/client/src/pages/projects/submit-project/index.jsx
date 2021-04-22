import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import Typography from '@material-ui/core/Typography'
import { Link } from 'react-router-dom'

const buttonStyle = {
  width: 250,
}

export default () => {
  return (
    <Card style={{ width: '100%' }}>
      <CardHeader style={{ textAlign: 'center' }} title="NCCRD project submission" />
      <CardContent>
        <Typography>Description of the different types of project submission</Typography>
      </CardContent>
      <CardActions style={{ justifyContent: 'space-between' }}>
        <Button
          disableElevation
          component={Link}
          style={buttonStyle}
          color="primary"
          variant="contained"
          to="/projects/submission"
        >
          Submission wizard
        </Button>
        <Button disableElevation style={buttonStyle} color="primary" variant="contained">
          Bulk upload
        </Button>
        <Button disableElevation style={buttonStyle} color="primary" variant="contained">
          Download Excel template
        </Button>
      </CardActions>
    </Card>
  )
}
