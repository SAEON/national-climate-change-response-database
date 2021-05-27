import { useState } from 'react'
import Drawer from '@material-ui/core/SwipeableDrawer'
import Grid from '@material-ui/core/Grid'
import CloseIcon from 'mdi-react/CloseIcon'
import IconButton from '@material-ui/core/IconButton'
import FilterIcon from 'mdi-react/FilterIcon'

export default ({ Filters }) => {
  const [showSidebar, setShowSidebar] = useState(false)

  return (
    <>
      <Drawer
        id="mobile-filters-menu"
        PaperProps={{ style: { maxWidth: '100%' } }}
        anchor="right"
        open={showSidebar}
        onOpen={() => setShowSidebar(true)}
        onClose={() => setShowSidebar(false)}
      >
        <Grid item xs={12}>
          <IconButton aria-label="Toggle search filters" onClick={() => setShowSidebar(false)}>
            <CloseIcon />
          </IconButton>
          <Filters />
        </Grid>
      </Drawer>
      <IconButton onClick={() => setShowSidebar(true)} size="small">
        <FilterIcon size={20} />
      </IconButton>
    </>
  )
}
