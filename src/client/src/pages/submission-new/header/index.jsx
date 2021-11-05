import ToolbarHeader from '../../../components/toolbar-header'
import DeleteSubmission from './delete-submission'
import DownloadExcelTemplate from '../../../components/download-template'
import UploadProject from '../../../components/submit-template'
import { useTheme } from '@mui/material/styles'
import Divider from '@mui/material/Divider'
import Hidden from '@mui/material/Hidden'
import ShareForm from './share-form'

export default ({ id }) => {
  const theme = useTheme()

  return (
    <ToolbarHeader>
      <Hidden smDown>
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

      <Divider
        flexItem
        orientation="vertical"
        style={{ marginLeft: theme.spacing(2), marginRight: theme.spacing(2) }}
      />

      <ShareForm />

      <Divider
        flexItem
        orientation="vertical"
        style={{ marginLeft: theme.spacing(2), marginRight: theme.spacing(2) }}
      />

      <DeleteSubmission id={id} />
    </ToolbarHeader>
  )
}
