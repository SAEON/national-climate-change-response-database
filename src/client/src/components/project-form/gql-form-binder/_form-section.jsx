import CardContent from '@material-ui/core/CardContent'
import useTheme from '@material-ui/core/styles/useTheme'
import Collapse from '../../collapse'
import Typography from '@material-ui/core/Typography'
import Icon from 'mdi-react/EditIcon'

export default ({ title, fields, RenderField, formName }) => {
  const theme = useTheme()

  return (
    <Collapse
      defaultExpanded
      avatarStyle={{
        width: theme.spacing(4),
        height: theme.spacing(4),
        backgroundColor: theme.palette.primary.main,
      }}
      Icon={() => <Icon size={18} />}
      title={<Typography variant="overline">{title}</Typography>}
      cardStyle={{ marginBottom: theme.spacing(2) }}
    >
      <CardContent>
        {fields.map(field => {
          const { name } = field
          return <RenderField key={name} field={field} formName={formName} />
        })}
      </CardContent>
    </Collapse>
  )
}
