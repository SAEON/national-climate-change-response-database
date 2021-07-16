import { useContext } from 'react'
import DownloadIcon from 'mdi-react/DownloadIcon'
import Button from '@material-ui/core/Button'
import Tooltip from '@material-ui/core/Tooltip'
import Hidden from '@material-ui/core/Hidden'
import { context as authContext } from '.././../../contexts/authorization'
import useTheme from '@material-ui/core/styles/useTheme'
import Divider from '@material-ui/core/Divider'

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
      <Tooltip placement="bottom" title="Download submission data">
        <span>
          <Hidden smDown>
            <Button
              disableElevation
              size="small"
              variant="text"
              color="primary"
              onClick={() => alert('TODO')}
              startIcon={<DownloadIcon size={18} />}
            >
              Download all (filtered) data
            </Button>
          </Hidden>
        </span>
      </Tooltip>
    </>
  )
}
