import { useState } from 'react'
import Drawer from '@mui/material/SwipeableDrawer'
import Grid from '@mui/material/Grid'
import CloseIcon from 'mdi-react/CloseIcon'
import IconButton from '@mui/material/IconButton'
import FilterIcon from 'mdi-react/FilterIcon'
import Filters from '../filters'

export default () => {
  const [showSidebar, setShowSidebar] = useState(false)

  return (
    <>
      <Drawer
        id="mobile-filters-menu"
        PaperProps={{ style: { width: '100%' } }}
        anchor="left"
        open={showSidebar}
        onOpen={() => setShowSidebar(true)}
        onClose={() => setShowSidebar(false)}
      >
        <Grid container>
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton
              aria-label="Toggle search filters"
              onClick={() => setShowSidebar(false)}
              size="large"
            >
              <CloseIcon />
            </IconButton>
          </Grid>
          <Grid item xs={12}>
            <Filters />
          </Grid>
        </Grid>
      </Drawer>
      <IconButton onClick={() => setShowSidebar(true)} size="small">
        <FilterIcon size={18} />
      </IconButton>
    </>
  )
}
