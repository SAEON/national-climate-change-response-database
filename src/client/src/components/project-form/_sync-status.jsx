import Card from '@material-ui/core/Card'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import useTheme from '@material-ui/core/styles/useTheme'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'

export default ({ syncing, style }) => {
  const theme = useTheme()
  const xsAndDown = useMediaQuery(theme.breakpoints.down('xs'))

  return (
    <Card
      variant="outlined"
      style={{
        display: xsAndDown ? 'none' : 'flex',
        borderRadius: 0,
        flexGrow: 1,
        border: 'none',
        ...style,
      }}
    >
      <CardContent style={{ padding: theme.spacing(2) }}>
        <Typography style={{ display: 'block' }} variant="overline">
          Form: {`${syncing ? 'Saving ...' : 'Saved'}`}
        </Typography>
      </CardContent>
    </Card>
  )
}
