import Card from '@material-ui/core/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import useTheme from '@material-ui/core/styles/useTheme'
import FormattedObject from './_formatted-object'

export default ({ title, json }) => {
  const theme = useTheme()

  return (
    <Card style={{ backgroundColor: theme.backgroundColor }} variant="outlined">
      <CardHeader title={title} />
      <CardContent>
        <FormattedObject>{json}</FormattedObject>
      </CardContent>
    </Card>
  )
}
