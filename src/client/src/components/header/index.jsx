import { useContext, forwardRef } from 'react'
import { context as layoutContext } from '../../contexts/layout'
import AppBar from '@mui/material/AppBar'
import ApplicationBanner, {
  useImageHeight,
  Toolbar as ApplicationBanner_,
} from './application-banner'
import AppHeader, { Toolbar as ApplicationHeader_ } from './application-header'
import Divider from '@mui/material/Divider'
import HideOnScroll from './animations/hide-on-scroll'
import ElevationOnScroll from './animations/elevation-on-scroll'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { Div } from '../html-tags'

const FullHeader = forwardRef(({ contentBase, contentRef, routes }, ref) => {
  const imageHeight = useImageHeight()
  const theme = useTheme()
  const mdDown = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Div ref={ref}>
      <ElevationOnScroll>
        <AppBar color="inherit">
          <HideOnScroll contentRef={contentRef}>
            <ApplicationBanner />
          </HideOnScroll>
          <Divider />
          <AppHeader contentBase={contentBase} routes={routes} />
          <Divider />
        </AppBar>
      </ElevationOnScroll>

      {/* PUSH CONTENT DOWN */}
      <HideOnScroll contentRef={contentRef}>
        <ApplicationBanner_>
          <Div sx={{ minHeight: `${imageHeight}px`, ...(mdDown ? {} : { marginBottom: 3 }) }} />
        </ApplicationBanner_>
      </HideOnScroll>
      <ApplicationHeader_ />
    </Div>
  )
})

export default ({ routes }) => {
  const { setHeaderRef, contentRef } = useContext(layoutContext)
  return <FullHeader contentRef={contentRef} ref={setHeaderRef} routes={routes} />
}
