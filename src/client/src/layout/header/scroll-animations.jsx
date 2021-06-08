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
  const contentHeight = contentRef?.offsetHeight
  const windowHeight = window.innerHeight
  const availableHeight = windowHeight - contentHeight

  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  })

  if (!contentRef) {
    return null
  }

  return (
    <Collapse collapsedHeight={availableHeight < 0 ? 0 : availableHeight} in={!trigger}>
      <div>{children}</div>
    </Collapse>
  )
}
