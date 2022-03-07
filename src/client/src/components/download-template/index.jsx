import { useContext } from 'react'
import { context as authenticationContext } from '../../contexts/authentication'
import Icon from 'mdi-react/MicrosoftExcelIcon'
import Button from '@mui/material/Button'
import MessageDialogue from '../message-dialogue'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import { useTheme } from '@mui/material/styles'
import { NCCRD_API_HTTP_ADDRESS, NCCRD_DFFE_CONTACT } from '../../config'
import useMediaQuery from '@mui/material/useMediaQuery'

export default () => {
  const theme = useTheme()
  const lgUp = useMediaQuery(theme.breakpoints.up('lg'))
  const isAuthenticated = useContext(authenticationContext)

  return (
    <MessageDialogue
      title="Download Excel template"
      text={
        <>
          <Typography sx={{ marginBottom: theme => theme.spacing(2) }} variant="body2">
            Download excel template for capturing submission data offline
          </Typography>
          <Typography variant="body2">
            Please submit filled in templates to {NCCRD_DFFE_CONTACT.replace('@', ' [ at ] ')}. Note
            that the online form is much easier to fill in, and the offline template is provided as
            a backup in case the online form is not accessible for whatever reason
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
            startIcon={lgUp ? <Icon size={18} /> : null}
          >
            Offline submission
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
