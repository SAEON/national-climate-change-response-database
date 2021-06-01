import Submit from './submit-project-2'
import Wrapper from './_wrapper'
import useTheme from '@material-ui/core/styles/useTheme'
import { fade } from '@material-ui/core/styles/colorManipulator'
import About from './about'
import Explore from './explore-projects'

export default () => {
  const theme = useTheme()

  const bg1 = fade(theme.palette.common.black, 0.25)
  const bg2 = fade(theme.palette.common.white, 0.7)
  const bg3 = fade(theme.palette.common.black, 0.4)

  return (
    <>
      <div style={{ backgroundColor: bg1 }}>
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
