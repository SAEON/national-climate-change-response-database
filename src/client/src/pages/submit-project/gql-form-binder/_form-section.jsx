import CardHeader from '@material-ui/core/CardHeader'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import useTheme from '@material-ui/core/styles/useTheme'

export default ({
  title,
  fields,
  cardStyle = {},
  cardContentStyle = {},
  cardHeaderStyle = {},
  RenderField,
  formNumber,
}) => {
  const theme = useTheme()

  return (
    <Card variant="outlined" style={{ backgroundColor: theme.backgroundColor, ...cardStyle }}>
      <CardHeader style={cardHeaderStyle} title={title} />
      <CardContent style={cardContentStyle}>
        {fields.map(field => {
          const { name } = field
          return <RenderField key={name} field={field} i={formNumber} />
        })}
      </CardContent>
    </Card>
  )
}
