import CardContent from '@mui/material/CardContent'
import { useTheme } from '@mui/material/styles'
import Collapse from '../../collapse'
import Typography from '@mui/material/Typography'
import Icon from 'mdi-react/EditIcon'

export default ({ title, fields, RenderField, formName }) => {
  const theme = useTheme()

  return (
    <Collapse
      defaultExpanded={false}
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
