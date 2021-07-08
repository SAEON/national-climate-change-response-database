import { useContext } from 'react'
import { context as authenticationContext } from '../../contexts/authentication'
import Icon from 'mdi-react/FileDownloadIcon'
import Button from '@material-ui/core/Button'
import MessageDialogue from '../message-dialogue'
import Link from '@material-ui/core/Link'
import Typography from '@material-ui/core/Typography'
import useTheme from '@material-ui/core/styles/useTheme'
import { NCCRD_API_HTTP_ADDRESS } from '../../config'

export default () => {
  const theme = useTheme()
  const isAuthenticated = useContext(authenticationContext)

  return (
    <MessageDialogue
      title="Download Excel template"
      text={
        <>
          <Typography style={{ marginBottom: theme.spacing(2) }} variant="body2">
            You can submit filled-in Excel templates on this page.
          </Typography>
          <Typography variant="body2">
            Please note that the template has to be filled in exactly as downloaded, otherwise
            submissions will be rejected. If you would like to change the template in any way please
            contact a systems administrator.
          </Typography>
        </>
      }
      tooltipProps={{
        placement: 'bottom',
        title: 'Download Excel submission template',
      }}
      Button={openFn => {
        return (
          <Button
            onClick={e => {
              isAuthenticated.authenticate()
              openFn(e)
            }}
            disableElevation
            size="small"
            variant="text"
            color="primary"
            startIcon={<Icon size={18} />}
          >
            Download submission template
          </Button>
        )
      }}
      Actions={[
        closeFn => (
          <Button
            component={Link}
            target="_blank"
            rel="noopener noreferrer"
            href={`${NCCRD_API_HTTP_ADDRESS}/download-template`}
            key="submit-project-by-excel-template"
            startIcon={<Icon size={18} />}
            onClick={e => {
              closeFn(e)
            }}
            color="primary"
            size="small"
            variant="contained"
            disableElevation
          >
            Download
          </Button>
        ),
      ]}
    />
  )
}
