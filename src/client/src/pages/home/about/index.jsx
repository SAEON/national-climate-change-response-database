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
      </Grid>
      <Grid item sm={6} style={{ flexGrow: 1 }}>
        <Typography
          style={{ color: fade(theme.palette.common.white, 0.9), marginBottom: theme.spacing(2) }}
          variant="body1"
        >
          South Africa is projected to face a higher frequency of climate related disasters that are
          increasing in intensity, and these events are likely to be associated with impacts that
          are on par with, if not worse than those already experienced (Engelbrecht et al. 2018
          Third National Communication to UNFCCC). The National Climate Change Response Database is
          intended as a resource to inform anyone currently working on climate change adaptation or
          mitigation on past, current and future climate change response efforts across South
          Africa.
        </Typography>
      </Grid>
    </Grid>
  )
}
