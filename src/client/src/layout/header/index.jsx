import { cloneElement, forwardRef } from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import BannerToolbar from './banner/toolbar'
import Banner, { IMAGE_HEIGHT, HideOnScroll } from './banner'
import Divider from '@material-ui/core/Divider'
import ApplicationToolbar from './appbar'
import useScrollTrigger from '@material-ui/core/useScrollTrigger'

const ElevationScroll = props => {
  const { children } = props
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  })
  return cloneElement(children, {
    elevation: trigger ? 4 : 0,
  })
}

export default forwardRef((props, ref) => {
  return (
    <div ref={ref}>
      <ElevationScroll {...props}>
        <AppBar color="inherit">
          <Banner {...props} />
          <Divider />
          <ApplicationToolbar />
          <Divider />
        </AppBar>
      </ElevationScroll>

      {/* Push content down below banner and toolbar */}
      <HideOnScroll>
        <BannerToolbar>
          <div style={{ minHeight: IMAGE_HEIGHT }}></div>
        </BannerToolbar>
      </HideOnScroll>
      <Toolbar />
    </div>
  )
})
