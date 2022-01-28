import Submit from './submit-project'
import Wrapper from './_wrapper'
import { alpha } from '@mui/material/styles'
import Overview from './overview'
import Explore from './explore-projects'
import { Div } from '../../components/html-tags'

const bg1 = { backgroundColor: theme => alpha(theme.palette.common.black, 0.25) }
const bg2 = { backgroundColor: theme => alpha(theme.palette.common.white, 0.7) }
const bg3 = { backgroundColor: theme => alpha(theme.palette.common.black, 0.4) }

export default () => (
  <>
    <Div sx={{ ...bg1 }}>
      <Wrapper>
        <Overview />
      </Wrapper>
    </Div>
    <Div sx={{ ...bg2 }}>
      <Wrapper>
        <Explore />
      </Wrapper>
    </Div>
    <Div sx={{ ...bg3 }}>
      <Wrapper>
        <Submit />
      </Wrapper>
    </Div>
  </>
)
