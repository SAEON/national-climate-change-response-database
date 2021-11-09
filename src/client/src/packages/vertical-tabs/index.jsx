import List from '@mui/material/List'
import Grid from '@mui/material/Grid'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import NavItem from './_nav-item'

export default ({ navItems, children, activeIndex, setActiveIndex }) => {
  const theme = useTheme()
  const lgUp = useMediaQuery(theme.breakpoints.up('lg'))

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} lg={3}>
        <List
          style={{
            padding: 0,
            display: 'flex',
            flexDirection: lgUp ? 'column' : 'row',
            maxHeight: 1000,
            overflow: 'auto',
          }}
        >
          {navItems.map((props, i) => (
            <span key={i} style={{ flex: '1 1 0' }}>
              <NavItem
                i={i}
                onClick={() => setActiveIndex(i)}
                activeIndex={activeIndex}
                {...props}
              />
            </span>
          ))}
        </List>
      </Grid>

      <Grid item xs={12} lg={9} style={{ position: 'relative', height: '100%' }}>
        {children}
      </Grid>
    </Grid>
  )
}
