import MobileSideMenu from './_mobile-side-menu'
import Hidden from '@mui/material/Hidden'
import NewSubmission from '../../../components/new-submission'
import DownloadData from './_download-data'
import Pagination from './pagination'
import UserSubmissions from './_user-submissions'
import Divider from '@mui/material/Divider'
import ToolbarHeader from '../../../components/toolbar-header'
import { Div } from '../../../components/html-tags'

export default () => {
  return (
    <ToolbarHeader>
      {/* MOBILE FILTERS */}
      <Hidden mdUp>
        <MobileSideMenu />
        <Divider
          flexItem
          orientation="vertical"
          sx={theme => ({ marginLeft: theme.spacing(2), marginRight: theme.spacing(2) })}
        />
      </Hidden>

      {/* NEW SUBMISSION */}
      <NewSubmission />
      <Div sx={{ marginLeft: theme => theme.spacing(2) }} />

      <Hidden smUp>
        <Divider
          flexItem
          orientation="vertical"
          sx={theme => ({ marginLeft: theme.spacing(0), marginRight: theme.spacing(2) })}
        />
      </Hidden>

      {/* USER PROJECTS */}
      <UserSubmissions />

      {/* DOWNLOAD PROJECT DATA */}
      <Div sx={{ marginLeft: 'auto' }} />
      <Hidden mdDown>
        <DownloadData />
      </Hidden>

      {/* Pagination */}
      <Divider
        flexItem
        orientation="vertical"
        sx={theme => ({ marginLeft: theme.spacing(2), marginRight: theme.spacing(2) })}
      />
      <Pagination />
    </ToolbarHeader>
  )
}
