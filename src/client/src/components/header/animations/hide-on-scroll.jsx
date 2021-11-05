import useScrollTrigger from '@mui/material/useScrollTrigger'
import Collapse from '@mui/material/Collapse'
import { IMAGE_HEIGHT } from '../application-banner'

export default ({ children, contentRef }) => {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  })

  const availableHeight = Math.min(window.innerHeight - contentRef?.offsetHeight || 0, IMAGE_HEIGHT)
  const collapsedSize = availableHeight < 0 ? 0 : availableHeight

  return (
    <Collapse collapsedSize={collapsedSize} in={!trigger}>
      <div>{children}</div>
    </Collapse>
  )
}
