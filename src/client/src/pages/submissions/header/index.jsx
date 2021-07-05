import { useContext } from 'react'
import useTheme from '@material-ui/core/styles/useTheme'
import MobileSideMenu from './_mobile-side-menu'
import Hidden from '@material-ui/core/Hidden'
import { context as filterContext } from '../context'
import SubmitProject from './_submit-project'
import DownloadData from './_download-data'
import Pagination from './pagination'
import UserProjects from './_user-projects'
import Divider from '@material-ui/core/Divider'
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

      {/* SUBMIT PROJECT */}
      <SubmitProject />

      {/* DOWNLOAD PROJECT DATA */}
      <div style={{ marginLeft: theme.spacing(2) }} />
      <Hidden xsDown>
        <DownloadData />
        <Divider
          flexItem
          orientation="vertical"
          style={{ marginLeft: theme.spacing(2), marginRight: theme.spacing(2) }}
        />
      </Hidden>

      <Hidden smUp>
        <Divider
          flexItem
          orientation="vertical"
          style={{ marginLeft: theme.spacing(0), marginRight: theme.spacing(2) }}
        />
      </Hidden>

      {/* USER PROJECTS */}
      <UserProjects />

      {/* Pagination */}
      <div style={{ marginLeft: 'auto' }} />
      <Divider
        flexItem
        orientation="vertical"
        style={{ marginLeft: theme.spacing(2), marginRight: theme.spacing(2) }}
      />
      <Pagination />
    </ToolbarHeader>
  )
}
