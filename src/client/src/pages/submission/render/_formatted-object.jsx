import Typography from '@material-ui/core/Typography'
import useTheme from '@material-ui/core/styles/useTheme'

export default ({ children }) => {
  const theme = useTheme()

  return Object.keys(children).map(key => {
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
          {children[key]?.term || children[key]}
        </Typography>
      </div>
    )
  })
}
