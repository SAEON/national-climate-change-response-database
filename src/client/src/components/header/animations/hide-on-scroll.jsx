import useScrollTrigger from '@mui/material/useScrollTrigger'
import Collapse from '@mui/material/Collapse'
import { useImageHeight } from '../application-banner'

export default ({ children, contentRef }) => {
  const imageHeight = useImageHeight()
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  })

  const availableHeight = Math.min(window.innerHeight - contentRef?.offsetHeight || 0, imageHeight)
  const collapsedSize = availableHeight < 0 ? 0 : availableHeight

  return (
    <Collapse collapsedSize={collapsedSize} in={!trigger}>
      <div>{children}</div>
    </Collapse>
  )
}
