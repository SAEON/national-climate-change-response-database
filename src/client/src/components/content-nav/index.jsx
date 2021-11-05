import { useState, useCallback, memo } from 'react'
import List from '@mui/material/List'
import Grid from '@mui/material/Grid'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import NavItem from './_nav-item'

const RenderNavContent = memo(
  ({ children, activeIndex, setActiveIndex }) => {
    return <div>{children({ setActiveIndex, activeIndex })}</div>
  },
  (a, b) => {
    if (a.activeIndex !== b.activeIndex) return false
    return true
  }
)

export default ({ navItems, subNavChildren = null, children }) => {
  const theme = useTheme()
  const lgAndUp = useMediaQuery(theme.breakpoints.up('lg'))
  const [activeIndex, setActiveIndex] = useState(0)

  const setIndex = useCallback(val => setActiveIndex(() => val), [setActiveIndex])

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} lg={3}>
        <List style={{ padding: 0, display: 'flex', flexDirection: lgAndUp ? 'column' : 'row' }}>
          {navItems.map((props, i) => (
            <NavItem i={i} setActiveIndex={setIndex} activeIndex={activeIndex} {...props} key={i} />
          ))}
        </List>
        {subNavChildren && subNavChildren({ setActiveIndex })}
      </Grid>

      <Grid item xs={12} lg={9}>
        <RenderNavContent setActiveIndex={setActiveIndex} activeIndex={activeIndex}>
          {children}
        </RenderNavContent>
      </Grid>
    </Grid>
  )
}
