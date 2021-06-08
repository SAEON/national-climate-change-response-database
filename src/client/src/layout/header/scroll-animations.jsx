import { cloneElement } from 'react'
import useScrollTrigger from '@material-ui/core/useScrollTrigger'
import Collapse from '@material-ui/core/Collapse'

export const ElevationOnScroll = ({ children }) => {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  })

  return cloneElement(children, {
    elevation: trigger ? 4 : 0,
  })
}

export const HideOnScroll = ({ children, contentRef }) => {
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  })

  if (!contentRef) {
    return null
  }

  const availableHeight = window.innerHeight - contentRef.offsetHeight
  const collapsedHeight = availableHeight < 0 ? 0 : availableHeight

  return (
    <Collapse collapsedHeight={collapsedHeight} in={!trigger}>
      <div>{children}</div>
    </Collapse>
  )
}
