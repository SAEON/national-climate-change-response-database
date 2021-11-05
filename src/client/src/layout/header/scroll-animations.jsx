import { cloneElement } from 'react'
import useScrollTrigger from '@mui/material/useScrollTrigger'
import Collapse from '@mui/material/Collapse'

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
  const collapsedSize = availableHeight < 0 ? 0 : availableHeight

  return (
    <Collapse collapsedSize={collapsedSize} in={!trigger}>
      <div>{children}</div>
    </Collapse>
  )
}
