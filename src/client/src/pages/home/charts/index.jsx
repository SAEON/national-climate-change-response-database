import Provider from './context'
import Grid from '@mui/material/Grid'
import Echart, { ANNUAL_FUNDING_BY_INTERVENTION } from './echarts'
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
        <Echart>{ANNUAL_FUNDING_BY_INTERVENTION}</Echart>
      </Grid>
      <Grid item xs={12} md={6} container justifyContent="center">
        <Echart>{() => 'ACTUAL INTERVENTION SPEND'}</Echart>
      </Grid>
      <Grid item xs={12} md={6} container justifyContent="center">
        <Echart>{() => 'PROJECTS BY INTERVENTION BY SECTOR'}</Echart>
      </Grid>
      <Grid item xs={12} md={6} container justifyContent="center">
        <Echart>{() => 'MAP SECTOR'}</Echart>
      </Grid>
    </Grid>
  </Provider>
)
