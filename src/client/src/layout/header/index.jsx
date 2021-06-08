import { forwardRef } from 'react'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import BannerToolbar from './banner/toolbar'
import Banner, { IMAGE_HEIGHT } from './banner'
import Divider from '@material-ui/core/Divider'
import ApplicationToolbar from './appbar'
import { ElevationOnScroll, HideOnScroll } from './scroll-animations'

export default forwardRef((props, ref) => {
  return (
    <div ref={ref}>
      <ElevationOnScroll>
        <AppBar color="inherit">
          <HideOnScroll contentRef={props.contentRef}>
            <Banner {...props} />
          </HideOnScroll>
          <Divider />
          <ApplicationToolbar />
          <Divider />
        </AppBar>
      </ElevationOnScroll>

      {/* Push content down below banner and toolbar */}
      <HideOnScroll contentRef={props.contentRef}>
        <BannerToolbar>
          <div style={{ minHeight: IMAGE_HEIGHT }}></div>
        </BannerToolbar>
      </HideOnScroll>
      <Toolbar />
    </div>
  )
})
