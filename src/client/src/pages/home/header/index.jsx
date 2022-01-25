import DownloadExcelTemplate from '../../../components/download-template'
import UploadProject from '../../../components/submit-template'
import NewSubmission from '../../../components/new-submission'
import ToolbarHeader from '../../../components/toolbar-header'
import { Div } from '../../../components/html-tags'
import Divider from '@mui/material/Divider'
import Hidden from '@mui/material/Hidden'

export default () => {
  return (
    <ToolbarHeader>
      <NewSubmission />
      <Hidden smDown>
        <Divider
          flexItem
          orientation="vertical"
          sx={{ marginLeft: theme => theme.spacing(2), marginRight: theme => theme.spacing(2) }}
        />
        <DownloadExcelTemplate />
        <Div sx={{ marginLeft: theme => theme.spacing(2) }} />
        <UploadProject />
        <Divider
          flexItem
          orientation="vertical"
          sx={{ marginLeft: theme => theme.spacing(2), marginRight: theme => theme.spacing(2) }}
        />
      </Hidden>
      <Div sx={{ marginRight: 'auto' }} />
    </ToolbarHeader>
  )
}
