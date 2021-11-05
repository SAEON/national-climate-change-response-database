import DownloadExcelTemplate from '../../../components/download-template'
import UploadProject from '../../../components/submit-template'
import NewSubmission from '../../../components/new-submission'
import ToolbarHeader from '../../../components/toolbar-header'
import Divider from '@mui/material/Divider'
import { useTheme } from '@mui/material/styles'
import Hidden from '@mui/material/Hidden'

export default () => {
  const theme = useTheme()

  return (
    <ToolbarHeader>
      <NewSubmission />
      <Hidden smDown>
        <Divider
          flexItem
          orientation="vertical"
          style={{ marginLeft: theme.spacing(2), marginRight: theme.spacing(2) }}
        />
        <DownloadExcelTemplate />
        <div style={{ marginLeft: theme.spacing(2) }} />
        <UploadProject />
        <Divider
          flexItem
          orientation="vertical"
          style={{ marginLeft: theme.spacing(2), marginRight: theme.spacing(2) }}
        />
      </Hidden>
      <div style={{ marginRight: 'auto' }} />
    </ToolbarHeader>
  )
}
