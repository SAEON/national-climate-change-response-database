import ToolbarHeader from '../../../components/toolbar-header'
import ResetForm from './reset-form'
import DownloadExcelTemplate from './download-template'
import UploadProject from './submit-template'
import useTheme from '@material-ui/core/styles/useTheme'
import Divider from '@material-ui/core/Divider'

export default () => {
  const theme = useTheme()

  return (
    <ToolbarHeader>
      <DownloadExcelTemplate />
      <div style={{ marginLeft: theme.spacing(2) }} />
      <UploadProject />

      <Divider
        flexItem
        orientation="vertical"
        style={{ marginLeft: theme.spacing(2), marginRight: theme.spacing(2) }}
      />

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
