import ChartDataProvider from './context'
import Container from '@mui/material/Container'
import Header from './header'
import { Div } from '../../components/html-tags'
import BoxButton from '../../components/fancy-buttons/box-button'
import Grid from '@mui/material/Grid'
import Heatmap from './heatmap'
import { alpha } from '@mui/material/styles'

export default () => {
  return (
    <ChartDataProvider>
      <Header />
      {/* MAP */}
      <Heatmap />
      <Div sx={{ backgroundColor: theme => alpha(theme.palette.common.black, 0.4) }}>
        <Container
          sx={{ paddingTop: theme => theme.spacing(3), paddingBottom: theme => theme.spacing(3) }}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <BoxButton sx={{ height: 100 }} to="/about" title={'More ...'} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <BoxButton sx={{ height: 100 }} to="/reports" title={'Data overview'} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <BoxButton sx={{ height: 100 }} to="/submissions/new" title={'Submit a project'} />
            </Grid>
          </Grid>
        </Container>
      </Div>
    </ChartDataProvider>
  )
}
