import { useContext } from 'react'
import DownloadIcon from 'mdi-react/DownloadIcon'
import Button from '@mui/material/Button'
import Hidden from '@mui/material/Hidden'
import { context as authContext } from '../../../contexts/authorization'
import { useTheme } from '@mui/material/styles'
import Divider from '@mui/material/Divider'
import MessageDialog from '../../../components/message-dialogue'

export default () => {
  const theme = useTheme()
  const { hasPermission } = useContext(authContext)
  if (!hasPermission('download-all-submissions')) {
    return null
  }

  return (
    <>
      <Divider
        flexItem
        orientation="vertical"
        style={{ marginLeft: theme.spacing(2), marginRight: theme.spacing(2) }}
      />

      <Hidden mdDown>
        <MessageDialog
          title="Download submissions"
          text="This button is only shown to admins, and is not implemented yet"
          tooltipProps={{
            title: 'Download all submissions from current filter context',
            placement: 'bottom',
          }}
          Button={fn => (
            <Button
              disableElevation
              size="small"
              variant="text"
              color="primary"
              onClick={fn}
              startIcon={<DownloadIcon size={18} />}
            >
              Download all (filtered) data
            </Button>
          )}
        />
      </Hidden>
    </>
  )
}
