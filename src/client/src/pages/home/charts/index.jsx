import Provider from './context'
import Grid from '@mui/material/Grid'
import Chart, {
  SPEND_BUDGET,
  FUNDING_SOURCE,
  OPERATIONAL_PROJECTS,
  OPERATIONAL_PROJECTS_BY_YEAR,
  PROJECT_COUNT,
  SECTOR_BUDGET,
  SECTOR_FUNDING,
} from './chart'
import Typography from '@mui/material/Typography'
import { alpha } from '@mui/material/styles'

export default () => (
  <Provider>
    <Typography
      sx={theme => ({
        textAlign: 'center',
        marginBottom: theme.spacing(3),
        color: alpha(theme.palette.common.black, 0.9),
      })}
      variant="h4"
    >
      Project status and summary
    </Typography>
    {/* <Typography
      sx={{ textAlign: 'center', color: theme => alpha(theme.palette.common.black, 0.9) }}
      variant="body2"
    >
      These charts show an overview of the projects that is in our database. Please contact for
      information in how to utilize this data
    </Typography> */}
    <Grid container spacing={2}>
      <Grid item container justifyContent={'center'}>
        <PROJECT_COUNT
          sx={{ marginTop: theme => theme.spacing(4), padding: theme => theme.spacing(2) }}
        />
      </Grid>
      <Grid item xs={12} md={6} container justifyContent="center">
        <Chart>{SPEND_BUDGET}</Chart>
      </Grid>
      <Grid item xs={12} md={6} container justifyContent="center">
        <Chart>{FUNDING_SOURCE}</Chart>
      </Grid>
      <Grid item xs={12} md={6} container justifyContent="center">
        <Chart>{OPERATIONAL_PROJECTS_BY_YEAR}</Chart>
      </Grid>
      <Grid item xs={12} md={6} container justifyContent="center">
        <Chart>{OPERATIONAL_PROJECTS}</Chart>
      </Grid>
      <Grid item xs={12} md={6} container justifyContent="center">
        <Chart>{SECTOR_BUDGET}</Chart>
      </Grid>
      <Grid item xs={12} md={6} container justifyContent="center">
        <Chart>{SECTOR_FUNDING}</Chart>
      </Grid>
    </Grid>
  </Provider>
)
