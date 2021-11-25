import Icon from 'mdi-react/MicrosoftExcelIcon'
import Hidden from '@mui/material/Hidden'
import { NCCRD_API_HTTP_ADDRESS } from '../../../../../config'
import FileUploadDialogue from './upload-dialogue'

export default () => {
  return (
    <Hidden smDown>
      <FileUploadDialogue
        Icon={Icon}
        apiAddress={`${NCCRD_API_HTTP_ADDRESS}/upload-template`}
        title="Upload new template"
        tooltipProps={{
          placement: 'bottom',
          title: 'Upload submission template',
        }}
      />
    </Hidden>
  )
}