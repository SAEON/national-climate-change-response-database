import Provider from './context'
import Grid from '@mui/material/Grid'
import Echart, { ANNUAL_FUNDING_BY_INTERVENTION } from './echarts'

export default () => (
  <Provider>
    <Grid container spacing={2}>
      <Grid item xs={12} md={6} container justifyContent="center">
        <Echart>{ANNUAL_FUNDING_BY_INTERVENTION}</Echart>
      </Grid>
      <Grid item xs={12} md={6} container justifyContent="center">
        <Echart>{ANNUAL_FUNDING_BY_INTERVENTION}</Echart>
      </Grid>
    </Grid>
  </Provider>
)
