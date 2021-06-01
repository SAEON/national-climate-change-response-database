import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import useTheme from '@material-ui/core/styles/useTheme'
import { fade } from '@material-ui/core/styles/colorManipulator'
import OlReact from '../../../components/ol-react'

export default () => {
  const theme = useTheme()

  return (
    <Grid container spacing={4}>
      <Grid item sm={6}>
        <Typography
          style={{ marginBottom: theme.spacing(3), color: fade(theme.palette.common.white, 0.9) }}
          variant="h4"
        >
          Welcome to the National Climate Change Response Database
        </Typography>
        <Typography
          style={{ color: fade(theme.palette.common.white, 0.9), marginBottom: theme.spacing(2) }}
          variant="body1"
        >
          The South African National Climate Change Response Database is a system designed for DFFE,
          in order to record and report upon the mitigation, adaptation and research projects
          related to climate change in South Africa.
        </Typography>
      </Grid>
      <Grid item sm={6} style={{ flexGrow: 1 }}>
        <div style={{ minHeight: 300, height: '100%', boxShadow: theme.shadows[9] }}>
          <OlReact />
        </div>
      </Grid>
    </Grid>
  )
}
