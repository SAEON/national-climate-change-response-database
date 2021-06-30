import Icon from 'mdi-react/MicrosoftExcelIcon'
import Hidden from '@material-ui/core/Hidden'
import { NCCRD_API_HTTP_ADDRESS } from '../../../../config'
import Divider from '@material-ui/core/Divider'
import FileUploadDialogue from './upload-dialogue'
import useTheme from '@material-ui/core/styles/useTheme'

export default () => {
  const theme = useTheme()

  return (
    <Hidden xsDown>
      <Divider
        flexItem
        orientation="vertical"
        style={{ marginLeft: theme.spacing(2), marginRight: theme.spacing(2) }}
      />
      <FileUploadDialogue
        Icon={Icon}
        apiAddress={`${NCCRD_API_HTTP_ADDRESS}/upload-template`}
        title="Upload submission template"
        tooltipProps={{
          placement: 'bottom',
          title: 'Upload submission template',
        }}
      />
    </Hidden>
  )
}
