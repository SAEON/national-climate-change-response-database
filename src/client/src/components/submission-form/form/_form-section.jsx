import { useMemo } from 'react'
import CardContent from '@mui/material/CardContent'
import { useTheme } from '@mui/material/styles'
import Collapse from '../../collapse'
import Typography from '@mui/material/Typography'
import Icon from 'mdi-react/EditIcon'

export default ({ title, fields, validation, RenderField, formName, defaultExpanded = false }) => {
  const theme = useTheme()

  const incomplete = useMemo(
    () =>
      fields.reduce((isIncomplete, { name: fieldName }) => {
        let _isIncomplete = false
        if (Object.prototype.hasOwnProperty.call(validation.requiredFields, fieldName)) {
          if (!validation.requiredFields[fieldName]) {
            _isIncomplete = true
          }
        }
        return _isIncomplete || isIncomplete
      }, false),
    [fields, validation.requiredFields]
  )

  return (
    <Collapse
      error={incomplete}
      id={`${window.location.href}-${formName}-${title}`}
      defaultExpanded={defaultExpanded}
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
