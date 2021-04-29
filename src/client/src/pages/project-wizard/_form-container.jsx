import CardHeader from '@material-ui/core/CardHeader'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'

export default ({ title = undefined, children }) => {
  return (
    <Card variant="outlined">
      {title && <CardHeader title={title} />}
      <CardContent>{children}</CardContent>
    </Card>
  )
}
