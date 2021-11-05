import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'

const renderValue = value => {
  if (value?.term) {
    return value.term
  }

  if (typeof value === 'object') {
    return JSON.stringify(value)
  }

  return value
}

export default ({ json }) => {
  const theme = useTheme()

  return Object.keys(json).map(key => {
    return (
      <div key={key}>
        {/* TITLE */}
        <Typography variant="overline">
          <b>{key.replace(/([a-z])([A-Z])/g, '$1 $2')}</b>
        </Typography>

        {/* VALUE */}
        <Typography
          variant="body2"
          style={{
            wordBreak: 'break-word',
            marginBottom: theme.spacing(2),
          }}
        >
          <>{renderValue(json[key])}</>
        </Typography>
      </div>
    )
  })
}
