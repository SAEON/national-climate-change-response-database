import CardHeader from '@material-ui/core/CardHeader'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import IconButton from '@material-ui/core/IconButton'
import NextIcon from 'mdi-react/ArrowRightCircleIcon'
import PreviousIcon from 'mdi-react/ArrowLeftCircleIcon'

export default ({ title, children }) => {
  return (
    <Card variant="outlined">
      <CardHeader title={title} />
      <CardContent>{children}</CardContent>
      <CardActions>
        <IconButton color="primary">
          <PreviousIcon size={32} />
        </IconButton>
        <IconButton color="primary" style={{ marginLeft: 'auto' }}>
          <NextIcon size={32} />
        </IconButton>
      </CardActions>
    </Card>
  )
}
