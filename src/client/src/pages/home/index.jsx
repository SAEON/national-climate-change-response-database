import Submit from './submit-project'
import Wrapper from './_wrapper'
import Container from '@mui/material/Container'
import { alpha } from '@mui/material/styles'
import About from './about'
import Explore from './explore-projects'
import HeatMap from './charts/chart/heat-map'
import Header from './header'
import Charts from './charts'
import { Div } from '../../components/html-tags'

const bg1 = { backgroundColor: theme => alpha(theme.palette.common.black, 0.25) }
const bg2 = { backgroundColor: theme => alpha(theme.palette.common.white, 0.7) }
const bg3 = { backgroundColor: theme => alpha(theme.palette.common.black, 0.4) }

export default () => (
  <>
    <Header />
    <HeatMap />
    {/* <Div sx={bg1}>
      <Wrapper>
        <About />
      </Wrapper>
    </Div>
    <Div sx={bg2}>
      <Wrapper>
        <Explore />
      </Wrapper>
    </Div>
    <Div sx={bg3}>
      <Wrapper>
        <Submit />
      </Wrapper>
    </Div> */}
    <Div sx={bg3}>
      <Container
        sx={{ paddingTop: theme => theme.spacing(3), paddingBottom: theme => theme.spacing(3) }}
      >
        <Charts />
      </Container>
    </Div>
  </>
)
