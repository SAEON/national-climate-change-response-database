import ToolbarHeader from '../../../components/toolbar-header'
import UploadTemplate from './upload-template'
import Divider from '@material-ui/core/Divider'
import useTheme from '@material-ui/core/styles/useTheme'

export default () => {
  const theme = useTheme()

  return (
    <ToolbarHeader>
      <Divider
        flexItem
        orientation="vertical"
        style={{ marginLeft: theme.spacing(2), marginRight: theme.spacing(2) }}
      />

      <UploadTemplate />
    </ToolbarHeader>
  )
}
