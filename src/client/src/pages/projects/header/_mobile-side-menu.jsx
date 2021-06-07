import { useState } from 'react'
import Drawer from '@material-ui/core/SwipeableDrawer'
import Grid from '@material-ui/core/Grid'
import CloseIcon from 'mdi-react/CloseIcon'
import IconButton from '@material-ui/core/IconButton'
import FilterIcon from 'mdi-react/FilterIcon'

export default ({ Filters, filters }) => {
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
          <Grid item xs={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton aria-label="Toggle search filters" onClick={() => setShowSidebar(false)}>
              <CloseIcon />
            </IconButton>
          </Grid>
          <Grid item xs={12}>
            <Filters filters={filters} />
          </Grid>
        </Grid>
      </Drawer>
      <IconButton onClick={() => setShowSidebar(true)} size="small">
        <FilterIcon size={20} />
      </IconButton>
    </>
  )
}
