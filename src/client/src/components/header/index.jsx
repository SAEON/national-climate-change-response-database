import { useContext, forwardRef } from 'react'
import { context as layoutContext } from '../../contexts/layout'
import AppBar from '@mui/material/AppBar'
import ApplicationBanner, {
  IMAGE_HEIGHT,
  Toolbar as ApplicationBanner_,
} from './application-banner'
import AppHeader, { Toolbar as ApplicationHeader_ } from './application-header'
import Divider from '@mui/material/Divider'
import HideOnScroll from './animations/hide-on-scroll'
import ElevationOnScroll from './animations/elevation-on-scroll'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

const FullHeader = forwardRef(({ contentBase, title, contentRef, routes }, ref) => {
  const theme = useTheme()
  const mdDown = useMediaQuery(theme.breakpoints.down('lg'))

  return (
    <div ref={ref}>
      <ElevationOnScroll>
        <AppBar color="inherit">
          <HideOnScroll contentRef={contentRef}>
            <ApplicationBanner title={title} />
          </HideOnScroll>
          <Divider />
          <AppHeader contentBase={contentBase} routes={routes} />
          <Divider />
        </AppBar>
      </ElevationOnScroll>

      {/* PUSH CONTENT DOWN */}
      <HideOnScroll contentRef={contentRef}>
        <ApplicationBanner_>
          <div style={{ minHeight: IMAGE_HEIGHT, ...(mdDown ? {} : { margin: 9 }) }} />
        </ApplicationBanner_>
      </HideOnScroll>
      <ApplicationHeader_ />
    </div>
  )
})

export default ({ title, routes }) => {
  const { setHeaderRef, contentRef } = useContext(layoutContext)
  return <FullHeader title={title} contentRef={contentRef} ref={setHeaderRef} routes={routes} />
}
