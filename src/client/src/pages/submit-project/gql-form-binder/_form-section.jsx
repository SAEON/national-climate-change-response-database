import CardContent from '@material-ui/core/CardContent'
import useTheme from '@material-ui/core/styles/useTheme'
import Collapse from '../../../components/collapse'

export default ({ title, fields, RenderField }) => {
  const theme = useTheme()

  return (
    <Collapse defaultExpanded title={title} cardStyle={{ marginBottom: theme.spacing(2) }}>
      <CardContent>
        {fields.map(field => {
          const { name } = field
          return <RenderField key={name} field={field} />
        })}
      </CardContent>
    </Collapse>
  )
}
