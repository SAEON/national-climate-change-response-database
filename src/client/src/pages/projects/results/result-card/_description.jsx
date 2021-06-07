import Typography from '@material-ui/core/Typography'
import CardContent from '@material-ui/core/CardContent'

export default ({ description }) => {
  return (
    <CardContent>
      <Typography variant="body2">{description || 'No description'}</Typography>
    </CardContent>
  )
}
