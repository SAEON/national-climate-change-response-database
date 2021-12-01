import { useContext } from 'react'
import { useTheme } from '@mui/material/styles'
import MobileSideMenu from './_mobile-side-menu'
import Hidden from '@mui/material/Hidden'
import { context as filterContext } from '../context'
import NewSubmission from '../../../components/new-submission'
import DownloadData from './_download-data'
import Pagination from './pagination'
import UserSubmissions from './_user-submissions'
import Divider from '@mui/material/Divider'
import ToolbarHeader from '../../../components/toolbar-header'

export default ({ MobileFilters }) => {
  const { filters } = useContext(filterContext)
  const theme = useTheme()

  return (
    <ToolbarHeader>
      {/* MOBILE FILTERS */}
      <Hidden mdUp>
        <MobileSideMenu Filters={MobileFilters} filters={filters} />
        <Divider
          flexItem
          orientation="vertical"
          style={{ marginLeft: theme.spacing(2), marginRight: theme.spacing(2) }}
        />
      </Hidden>

      {/* NEW SUBMISSION */}
      <NewSubmission />
      <div style={{ marginLeft: theme.spacing(2) }} />

      <Hidden smUp>
        <Divider
          flexItem
          orientation="vertical"
          style={{ marginLeft: theme.spacing(0), marginRight: theme.spacing(2) }}
        />
      </Hidden>

      {/* USER PROJECTS */}
      <UserSubmissions />

      {/* DOWNLOAD PROJECT DATA */}
      <div style={{ marginLeft: 'auto' }} />
      <Hidden mdDown>
        <DownloadData />
      </Hidden>

      {/* Pagination */}

      <Divider
        flexItem
        orientation="vertical"
        style={{ marginLeft: theme.spacing(2), marginRight: theme.spacing(2) }}
      />
      <Pagination />
    </ToolbarHeader>
  )
}
