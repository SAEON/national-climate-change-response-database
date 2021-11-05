import Submit from './submit-project'
import Wrapper from './_wrapper'
import { useTheme, alpha } from '@mui/material/styles'
import About from './about'
import Explore from './explore-projects'
import Header from './header'

export default () => {
  const theme = useTheme()

  const bg1 = alpha(theme.palette.common.black, 0.25)
  const bg2 = alpha(theme.palette.common.white, 0.7)
  const bg3 = alpha(theme.palette.common.black, 0.4)

  return (
    <>
      <Header />
      <div style={{ backgroundColor: bg1, marginTop: -20 }}>
        <Wrapper>
          <About />
        </Wrapper>
      </div>
      <div style={{ backgroundColor: bg2 }}>
        <Wrapper>
          <Explore />
        </Wrapper>
      </div>
      <div style={{ backgroundColor: bg3 }}>
        <Wrapper>
          <Submit />
        </Wrapper>
      </div>
    </>
  )
}
