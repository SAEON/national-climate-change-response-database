import CardHeader from '@material-ui/core/CardHeader'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import useTheme from '@material-ui/core/styles/useTheme'

export default ({ title, fields, style = {}, RenderField }) => {
  const theme = useTheme()

  return (
    <Card variant="outlined" style={{ backgroundColor: theme.backgroundColor, ...style }}>
      <CardHeader title={title} />
      <CardContent>
        {fields.map(field => {
          const { name } = field
          return <RenderField key={name} field={field} />
        })}
      </CardContent>
    </Card>
  )
}
