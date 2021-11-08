import List from '@mui/material/List'
import Grid from '@mui/material/Grid'
import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import NavItem from './_nav-item'

export default ({ navItems, children, activeIndex, setActiveIndex }) => {
  const theme = useTheme()
  const lgAndUp = useMediaQuery(theme.breakpoints.up('lg'))

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} lg={3}>
        <List
          style={{
            backgroundColor: theme.palette.common.white,
            padding: 0,
            display: 'flex',
            flexDirection: lgAndUp ? 'column' : 'row',
            maxHeight: 1000,
            overflow: 'auto',
          }}
        >
          {navItems.map((props, i) => (
            <NavItem
              i={i}
              onClick={() => setActiveIndex(i)}
              activeIndex={activeIndex}
              {...props}
              key={i}
            />
          ))}
        </List>
      </Grid>

      <Grid item xs={12} lg={9} style={{ position: 'relative', height: '100%' }}>
        {children}
      </Grid>
    </Grid>
  )
}
