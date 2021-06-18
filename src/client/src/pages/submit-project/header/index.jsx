import ToolbarHeader from '../../../components/toolbar-header'
import ResetForm from './reset-form'
import DownloadExcelTemplate from './download-template'
import UploadProject from './submit-template'
import useTheme from '@material-ui/core/styles/useTheme'
import Divider from '@material-ui/core/Divider'
import Hidden from '@material-ui/core/Hidden'

export default () => {
  const theme = useTheme()

  return (
    <ToolbarHeader>
      <Hidden xsDown>
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

      <ResetForm />
    </ToolbarHeader>
  )
}
