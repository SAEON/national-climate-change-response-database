import { useState } from 'react'
import Icon from 'mdi-react/MicrosoftExcelIcon'
import Button from '@material-ui/core/Button'
import Hidden from '@material-ui/core/Hidden'
import CardContent from '@material-ui/core/CardContent'
import { NCCRD_API_HTTP_ADDRESS } from '../../../../config'
import MessageDialogue from '../../../../components/message-dialogue'
import Typography from '@material-ui/core/Typography'
import useTheme from '@material-ui/core/styles/useTheme'

export default () => {
  const [file, setFile] = useState(null)
  const theme = useTheme()

  return (
    <MessageDialogue
      title="Upload submission template"
      tooltipProps={{
        placement: 'bottom',
        title: 'Upload submission template',
      }}
      Button={openFn => {
        return (
          <Hidden xsDown>
            <Button
              startIcon={<Icon size={18} />}
              onClick={openFn}
              disableElevation
              size="small"
              variant="text"
              color="primary"
            >
              Upload submission template
            </Button>
          </Hidden>
        )
      }}
      Actions={[
        closeFn => (
          <Button
            disabled={!file}
            key="upload-template"
            onClick={async e => {
              const body = new FormData()
              body.append('project-upload-excel-template', file, file.name)
              const result = await fetch(`${NCCRD_API_HTTP_ADDRESS}/upload-template`, {
                method: 'POST',
                body,
                mode: 'cors',
                credentials: 'include',
              }).then(res => res.text())

              console.log(result)
              // https://www.geeksforgeeks.org/file-uploading-in-react-js/

              closeFn(e)
            }}
            color="primary"
            size="small"
            variant="contained"
            disableElevation
          >
            Confirm
          </Button>
        ),
      ]}
    >
      <CardContent>
        <Typography style={{ marginBottom: theme.spacing(2) }}>
          Select the latest version of the Excel template that users can use to upload project
          details
        </Typography>
        <input
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          style={{ display: 'none' }}
          id="raised-button-file"
          type="file"
          onChange={e => setFile(e.target.files[0])}
        />
        <label htmlFor="raised-button-file">
          <Button variant="contained" component="span">
            Select Excel template
          </Button>
        </label>
        {file?.name ? (
          <Typography style={{ marginTop: theme.spacing(2) }}>
            <Icon size={18} /> {file?.name}
          </Typography>
        ) : null}
      </CardContent>
    </MessageDialogue>
  )
}
