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
import { Div } from '../html-tags'

const FullHeader = forwardRef(({ contentBase, contentRef }, ref) => {
  const imageHeight = useImageHeight()

  return (
    <Div ref={ref}>
      <ElevationOnScroll>
        <AppBar color="inherit">
          <HideOnScroll contentRef={contentRef}>
            <ApplicationBanner />
          </HideOnScroll>
          <Divider />
          <AppHeader contentBase={contentBase} />
          <Divider />
        </AppBar>
      </ElevationOnScroll>

      {/* PUSH CONTENT DOWN */}
      <HideOnScroll contentRef={contentRef}>
        <ApplicationBanner_>
          <Div
            sx={{
              height: theme =>
                `${imageHeight + parseInt(theme.spacing(1).replace('px', ''), 10)}px`,
            }}
          />
        </ApplicationBanner_>
      </HideOnScroll>
      <ApplicationHeader_ />
    </Div>
  )
})

export default () => {
  const { setHeaderRef, contentRef } = useContext(layoutContext)
  return <FullHeader contentRef={contentRef} ref={setHeaderRef} />
}
