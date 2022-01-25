import Provider from './context'
import Grid from '@mui/material/Grid'
import Chart, { SPEND_BUDGET } from './chart'
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
    <Grid container spacing={2}>
      <Grid item xs={12} md={6} container justifyContent="center">
        <Chart>{SPEND_BUDGET}</Chart>
      </Grid>
      <Grid item xs={12} md={6} container justifyContent="center">
        <Chart>{() => 'ACTUAL INTERVENTION SPEND'}</Chart>
      </Grid>
      <Grid item xs={12} md={6} container justifyContent="center">
        <Chart>{() => 'PROJECTS BY INTERVENTION BY SECTOR'}</Chart>
      </Grid>
      <Grid item xs={12} md={6} container justifyContent="center">
        <Chart>{() => 'MAP SECTOR'}</Chart>
      </Grid>
    </Grid>
  </Provider>
)
